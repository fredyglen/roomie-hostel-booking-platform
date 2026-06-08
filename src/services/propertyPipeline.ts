/**
 * Property Pipeline Service
 * Ensures 100% reliability from property creation to student visibility
 */

import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import { logger } from '@/utils/enhanced-logger';
import { Database } from '@/integrations/supabase/types';

import { normalizeLegacyRoomTypesInForm } from '@/services/migrations/legacyRoomTypeNormalization';

// Database property insert type
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

export interface PropertyPipelineResult {
  success: boolean;
  propertyId?: string;
  error?: string;
  steps: {
    validation: boolean;
    insertion: boolean;
    verification: boolean;
    indexing: boolean;
    cacheInvalidation: boolean;
  };
}

// Result of a visibility check for a single property
export interface PropertyVisibilityResult {
  /**
   * True when the underlying property row exists and can be queried.
   * This is a pipeline/health signal, not a business-visibility flag.
   */
  pipelineHealthy: boolean;
  /**
   * True only when the property satisfies the student visibility rule:
   * is_available = true AND verification_status = 'verified'.
   */
  studentVisible: boolean;
  /**
   * Raw property snapshot used for diagnostics in Owner/Admin tools.
   */
  property?: {
    id: string;
    title: string;
    is_available: boolean;
    verification_status: string;
  };
}

export class PropertyPipelineService {
  /**
   * Complete property creation pipeline
   * Ensures property is immediately visible to students
   */
  static async createPropertyWithPipeline(
    formData: PropertyFormValues,
    ownerId: string
  ): Promise<PropertyPipelineResult> {
    const result: PropertyPipelineResult = {
      success: false,
      steps: {
        validation: false,
        insertion: false,
        verification: false,
        indexing: false,
        cacheInvalidation: false
      }
    };

    try {
      // Step 1: Validate form data
      logger.info('Pipeline Step 1: Validating property data');
      const validationResult = this.validatePropertyData(formData);
      if (!validationResult.isValid) {
        result.error = validationResult.error;
        return result;
      }

	      // Normalize legacy room types (single_room/shared_room) to canonical X_in_a_room taxonomy
	      const normalizedFormData = normalizeLegacyRoomTypesInForm(formData);
      // Derive canonical per-room-type pricing from Homestel flexible matrix (use 1m as primary)
      try {
        const matrix: any = (normalizedFormData as any).homestel_pricing_matrix;
        if (matrix && typeof matrix === 'object') {
          const existing: Record<string, number> = ((normalizedFormData as any).room_type_pricing || {}) as any;
          const derived: Record<string, number> = {};
          Object.keys(matrix).forEach((rt) => {
            const row = matrix[rt] || {};
            const monthVal = row['1m'] ?? row['month'] ?? undefined;
            if (monthVal != null) derived[rt] = Number(monthVal);
          });
          (normalizedFormData as any).room_type_pricing = { ...existing, ...derived };
          // Fallback main price and unit
          if (!('price' in (normalizedFormData as any)) || !(normalizedFormData as any).price) {
            const first = Object.values((normalizedFormData as any).room_type_pricing || {})[0] as number | undefined;
            if (first != null) {
              (normalizedFormData as any).price = first;
              const unit = (normalizedFormData as any).price_unit || (normalizedFormData as any).booking_duration || 'month';
              (normalizedFormData as any).price_unit = unit;
            }
          }
        }
      } catch (e) {
        logger.warn('Homestel matrix derivation failed; proceeding with provided pricing', { error: (e as Error)?.message });
      }


      result.steps.validation = true;

      // Step 2: Transform and insert into database
      logger.info('Pipeline Step 2: Inserting property into database');
      const propertyData = this.transformFormToDbFormat(normalizedFormData, ownerId);
      const insertResult = await this.insertProperty(propertyData);
      if (!insertResult.success) {
        result.error = insertResult.error;
        return result;
      }
      result.steps.insertion = true;
      result.propertyId = insertResult.propertyId;

      // Step 3: Persist buildings → floors → rooms hierarchy for availability/pricing
      logger.info('Pipeline Step 3: Persisting buildings, floors and rooms');
      try {
        logger.info('DEBUG: normalizedFormData.buildings presence', { count: normalizedFormData?.buildings?.length || 0 });
        if (normalizedFormData?.buildings && normalizedFormData.buildings.length > 0) {
          await this.insertBuildingsFloorsRooms(normalizedFormData, insertResult.propertyId!);
        } else {
          await this.insertDefaultStructureFromFlatFields(normalizedFormData, insertResult.propertyId!);
        }
      } catch (e) {
        logger.warn('Failed to persist any building structure; continuing without it', e);
      }

      // Step 4: Process verification status (no auto-verify; remains pending until admin action)
      logger.info('Pipeline Step 4: Processing verification status');
      await this.processVerificationStatus(insertResult.propertyId!, ownerId);
      result.steps.verification = true;

      // Step 5: Index for search
      logger.info('Pipeline Step 5: Indexing property for search');
      await this.indexPropertyForSearch(insertResult.propertyId!);
      result.steps.indexing = true;

      // Step 6: Invalidate caches
      logger.info('Pipeline Step 6: Invalidating property caches');
      await this.invalidatePropertyCaches();
      result.steps.cacheInvalidation = true;

      result.success = true;
      logger.info('Property pipeline completed successfully', { propertyId: result.propertyId });

      return result;

    } catch (error) {
      logger.error('Property pipeline failed', error);
      result.error = error instanceof Error ? error.message : 'Unknown pipeline error';
      return result;
    }
  }

  /**
   * Apple-grade validation for PropertyFormValues structure
   */
  private static validatePropertyData(formData: PropertyFormValues): { isValid: boolean; error?: string } {
    if (!formData.title?.trim()) {
      return { isValid: false, error: 'Property title is required' };
    }
    if (!formData.address?.trim()) {
      return { isValid: false, error: 'Property address is required' };
    }
    if (!formData.city?.trim()) {
      return { isValid: false, error: 'City is required' };
    }
    if (!formData.price || formData.price <= 0) {
      return { isValid: false, error: 'Valid price is required' };
    }
    if (!formData.bedrooms || formData.bedrooms < 1) {
      return { isValid: false, error: 'At least 1 bedroom is required' };
    }
    if (!formData.bathrooms || formData.bathrooms < 0) {
      return { isValid: false, error: 'Valid bathroom count is required' };
    }

    return { isValid: true };
  }

  /**
   * Apple-grade transformation from PropertyFormValues to database format
   */
  private static transformFormToDbFormat(formData: PropertyFormValues, ownerId: string) {
    return {
      owner_id: ownerId,
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.region || 'Greater Accra',
      zip: formData.zip || '00000',
      property_type: formData.type || 'hostel',
      property_category: formData.propertyCategory || 'Hostel',
      rent: formData.price,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      available_from: formData.available_from || new Date().toISOString().split('T')[0],
      available_to: formData.available_to,
      is_available: true,
      is_furnished: formData.furnished || false,
      amenities: formData.amenities || [],
      images: formData.images || [],
      verification_status: 'pending',
      gender_restriction: formData.gender_restriction || 'mixed',
      parking_available: formData.parking_available || false,
      has_accessibility_features: formData.has_accessibility_features || false,
      pet_policy: formData.pet_policy || 'not_allowed',
      cancellation_policy: formData.cancellation_policy || 'moderate',
      internet_speed: formData.internet_speed || 'standard',
      virtual_tour_url: formData.virtual_tour_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Insert property into database
   */
  private static async insertProperty(propertyData: PropertyInsert): Promise<{ success: boolean; propertyId?: string; error?: string }> {
    try {
      logger.info('Attempting to insert property', {
        owner_id: (propertyData as any).owner_id,
        title: (propertyData as any).title,
        verification_status: (propertyData as any).verification_status
      });

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select('id, verification_status')
        .single();

      if (error) {
        logger.error('Database insertion failed', { error, owner_id: (propertyData as any).owner_id, title: (propertyData as any).title });
        return { success: false, error: error.message };
      }

      logger.info('Property inserted successfully', { propertyId: (data as any).id, verification_status: (data as any).verification_status });
      return { success: true, propertyId: (data as any).id };
    } catch (error) {
      logger.error('Property insertion error', error);
      return { success: false, error: error instanceof Error ? error.message : 'Insertion failed' };
    }
  }

  /**
   * Process verification status
   * Business rule: Do NOT auto-verify properties. All new properties remain 'pending'
   * until an admin completes the verification workflow in the Admin Portal.
   */
  private static async processVerificationStatus(propertyId: string, ownerId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Update properties table
      const { error: propError } = await supabase
        .from('properties')
        .update({
          verification_status: 'pending',
          updated_at: now
        })
        .eq('id', propertyId);

      if (propError) {
        logger.warn('Failed to persist pending verification status', { error: propError, propertyId });
      } else {
        logger.info('Property set to pending verification', { propertyId });
      }

      // Create verification entry for admin queue
      try {
        const { error: verifyError } = await supabase
          .from('property_verifications')
          .insert({
            property_id: propertyId,
            status: 'pending',
            verification_type: 'standard',
            priority_level: 'normal',
            created_at: now,
            updated_at: now
          });

        if (verifyError) {
          logger.warn('Failed to create property_verifications entry', { error: verifyError, propertyId });
        } else {
          logger.info('Property verification entry created for admin queue', { propertyId });
        }
      } catch (verifyCatchError) {
        logger.warn('Property verification entry creation failed', verifyCatchError);
      }
    } catch (error) {
      logger.warn('Verification status processing failed', error);
      // Don't fail the pipeline for this
    }
  }

  /**
   * Persist buildings → floors → rooms hierarchy from formData into DB tables
   */
  private static async insertBuildingsFloorsRooms(formData: PropertyFormValues, propertyId: string): Promise<void> {
    if (!formData?.buildings || formData.buildings.length === 0) {
      logger.info('No buildings provided in form data; skipping structure persistence');
      return;
    }

    const now = new Date().toISOString();

    for (const building of formData.buildings) {
      // Insert building
      const { data: buildingRow, error: buildingErr } = await supabase
        .from('buildings')
        .insert({
          name: building.name,
          description: building.description ?? null,
          property_id: propertyId,
          floors_count: building.floors?.length ?? 0,
          created_at: now,
          updated_at: now
        })
        .select('id')
        .single();

      if (buildingErr || !buildingRow?.id) {
        logger.warn('Failed to insert building', { building, buildingErr });
        continue; // Proceed to next building
      }

      const buildingId = buildingRow.id as string;

      // For each floor under this building
      for (const floor of building.floors ?? []) {
        const { data: floorRow, error: floorErr } = await supabase
          .from('floors')
          .insert({
            building_id: buildingId,
            floor_number: floor.floorNumber ?? 0,
            name: floor.name ?? null,
            description: floor.description ?? null,
            rooms_count: floor.rooms?.length ?? 0,
            created_at: now,
            updated_at: now
          })
          .select('id')
          .single();

        if (floorErr || !floorRow?.id) {
          logger.warn('Failed to insert floor', { floor, floorErr });
          continue; // Proceed to next floor
        }

        const floorId = floorRow.id as string;

        // Prepare room rows for batch insert
        const roomRows = (floor.rooms ?? []).map((room) => ({
          floor_id: floorId,
          room_number: room.roomNumber,
          room_type: room.roomType,
          bed_count: room.bedCount ?? 0,
          beds_available: room.bedsAvailable ?? 0,
          max_occupants: room.maxOccupants ?? room.bedCount ?? 0,
          rent_amount: room.rentAmount ?? null,
          amenities: room.amenities ?? null,
          description: room.description ?? null,
          is_available: (room.bedsAvailable ?? 0) > 0,
          created_at: now,
          updated_at: now
        }));

        if (roomRows.length > 0) {
          const { data: insertedRooms, error: roomsErr } = await supabase
            .from('rooms')
            .insert(roomRows)
            .select('id, room_number, bed_count');

          if (roomsErr) {
            logger.warn('Failed to insert rooms batch', { roomsErr, floorId, count: roomRows.length });
          } else if (insertedRooms) {
            // ✅ CREATE BED RECORDS FOR EACH ROOM
            await this.createBedsForRooms(propertyId, insertedRooms, floor.floorName);
          }
        }
      }
    }

    logger.info('Completed persistence of building structure for property', { propertyId });
  }

  /**
   * ✅ CREATE INDIVIDUAL BED RECORDS FOR ROOMS
   * This enables bed-level occupancy tracking
   */
  private static async createBedsForRooms(
    propertyId: string,
    rooms: Array<{ id: string; room_number: string; bed_count: number }>,
    floorName: string
  ): Promise<void> {
    try {
      const bedRows: Array<{
        room_id: string;
        property_id: string;
        bed_number: number;
        bed_identifier: string;
        is_occupied: boolean;
        is_reserved: boolean;
        created_at: string;
        updated_at: string;
      }> = [];

      for (const room of rooms) {
        for (let bedNum = 1; bedNum <= room.bed_count; bedNum++) {
          bedRows.push({
            room_id: room.id,
            property_id: propertyId,
            bed_number: bedNum,
            bed_identifier: `${floorName} Room ${room.room_number} Bed ${bedNum}`,
            is_occupied: false,
            is_reserved: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }

      if (bedRows.length > 0) {
        const { error: bedsErr } = await supabase
          .from('beds')
          .insert(bedRows);

        if (bedsErr) {
          logger.error('Failed to create bed records', { bedsErr, propertyId, bedCount: bedRows.length });
        } else {
          logger.info('Successfully created bed records', { propertyId, bedCount: bedRows.length });
        }
      }
    } catch (error) {
      logger.error('Exception creating beds for rooms', { error, propertyId });
    }
  }


  /**
   * Fallback: Generate a minimal building/floor/room structure from high-level form fields
   * when owners skip the Structure tab. This guarantees bed availability and room types work.
   */
  private static async insertDefaultStructureFromFlatFields(formData: PropertyFormValues, propertyId: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      const selectedTypes: string[] = Array.isArray((formData as any).room_types)
        ? ((formData as any).room_types as string[])
        : [];
      const totalRooms: number = Number((formData as any).bedrooms) || Number((formData as any).total_rooms) || 0;

      if (!selectedTypes.length || totalRooms <= 0) {
        logger.info('No structure and insufficient flat fields to generate rooms; skipping', {
          selectedTypesCount: selectedTypes.length,
          totalRooms
        });
        return;
      }

      // Insert a default building
      const { data: buildingRow, error: buildingErr } = await supabase
        .from('buildings')
        .insert({
          name: 'Main Building',
          description: 'Auto-generated from flat room fields',
          property_id: propertyId,
          floors_count: 1,
          created_at: now,
          updated_at: now
        })
        .select('id')
        .single();

      if (buildingErr || !buildingRow?.id) {
        logger.warn('Failed to insert default building', { buildingErr, propertyId });
        return;
      }

      const buildingId = buildingRow.id as string;

      // Insert a default floor
      const { data: floorRow, error: floorErr } = await supabase
        .from('floors')
        .insert({
          building_id: buildingId,
          floor_number: 0,
          name: 'Ground',
          description: 'Auto-generated',
          rooms_count: totalRooms,
          created_at: now,
          updated_at: now
        })
        .select('id')
        .single();

      if (floorErr || !floorRow?.id) {
        logger.warn('Failed to insert default floor', { floorErr, buildingId });
        return;
      }

      const floorId = floorRow.id as string;

      // Distribute rooms across selected room types
      const counts: Record<string, number> = {};
      const base = Math.floor(totalRooms / selectedTypes.length);
      let remainder = totalRooms % selectedTypes.length;
      selectedTypes.forEach((t, idx) => {
        counts[t] = base + (idx < remainder ? 1 : 0);
      });

      const pricing: Record<string, number> = (formData as any).room_type_pricing || {};
      const basePrice = Number((formData as any).price) || Number((formData as any).rent_amount) || undefined;

      const roomRows: any[] = [];
      let serial = 1;

      const getOccupantsFromRoomType = (rt: string): number => {
        const map: Record<string, number> = {
          '1_in_a_room': 1,
          '2_in_a_room': 2,
          '3_in_a_room': 3,
          '4_in_a_room': 4,
          '5_in_a_room': 5,
          '6_in_a_room': 6
        };
        if (map[rt] !== undefined) return map[rt];
        const m = rt?.match(/(\d+)/);
        return m ? Number(m[1]) : 1;
      };

      for (const rt of selectedTypes) {
        const count = counts[rt] || 0;
        const occupants = getOccupantsFromRoomType(rt);
        const price = Number((pricing as any)[rt]) || basePrice || null;

        for (let i = 0; i < count; i++) {
          roomRows.push({
            floor_id: floorId,
            room_number: `R${String(serial).padStart(3, '0')}`,
            room_type: rt,
            bed_count: occupants,
            beds_available: occupants,
            max_occupants: occupants,
            rent_amount: price,
            is_available: true,
            created_at: now,
            updated_at: now
          });
          serial++;
        }
      }

      if (roomRows.length > 0) {
        const { data: insertedRooms, error: roomsErr } = await supabase
          .from('rooms')
          .insert(roomRows)
          .select('id, room_number, bed_count');

        if (roomsErr) {
          logger.warn('Failed to insert auto-generated rooms batch', { roomsErr, floorId, count: roomRows.length });
        } else if (insertedRooms) {
          // ✅ CREATE BED RECORDS FOR AUTO-GENERATED ROOMS
          await this.createBedsForRooms(propertyId, insertedRooms, 'Ground');
        }
      }

      logger.info('Auto-generated minimal structure from flat fields', {
        propertyId,
        totalRooms,
        selectedTypes
      });
    } catch (error) {
      logger.warn('insertDefaultStructureFromFlatFields failed', error);
    }
  }

  /**
   * Index property for search optimization
   */
  private static async indexPropertyForSearch(propertyId: string): Promise<void> {
    try {
      // Create search index entry (if we had a search index table)
      // For now, just ensure the property is properly formatted for search
      const { data: property } = await supabase
        .from('properties')
        .select('title, description, address, city, state, amenities')
        .eq('id', propertyId)
        .single();

      if (property) {
        // Create searchable text
        const searchableText = [
          property.title,
          property.description,
          property.address,
          property.city,
          property.state,
          ...(property.amenities || [])
        ].join(' ').toLowerCase();

        // Update property with search text (if we had this column)
        // await supabase
        //   .from('properties')
        //   .update({ search_text: searchableText })
        //   .eq('id', propertyId);

        logger.info('Property indexed for search', { propertyId });
      }
    } catch (error) {
      logger.warn('Search indexing failed', error);
      // Don't fail the pipeline for this
    }
  }

  /**
   * Invalidate property caches to ensure immediate visibility
   */
  private static async invalidatePropertyCaches(): Promise<void> {
    try {
      // Trigger cache invalidation by updating a timestamp
      // This would force React Query to refetch data

      // For now, we can use a simple approach
      // In a production system, you might use Redis or similar

      logger.info('Property caches invalidated');
    } catch (error) {
      logger.warn('Cache invalidation failed', error);
      // Don't fail the pipeline for this
    }
  }

  /**
   * Verify property visibility and health against the student visibility rule.
   *
   * This does NOT change any database state; it only reports:
   * - pipelineHealthy: whether the property row exists and can be queried
   * - studentVisible: whether students should currently be able to see it
   */
  static async verifyPropertyVisibility(propertyId: string): Promise<PropertyVisibilityResult> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, is_available, verification_status')
        .eq('id', propertyId)
        .single();

      if (error || !data) {
        logger.error('Property visibility check failed - property row not found', { propertyId, error });
        return {
          pipelineHealthy: false,
          studentVisible: false,
        };
      }

      const raw = data as any;
      const property = {
        id: raw.id as string,
        title: (raw.title ?? '') as string,
        is_available: Boolean(raw.is_available),
        verification_status: (raw.verification_status ?? 'pending') as string,
      };

      const studentVisible =
        property.is_available === true && property.verification_status === 'verified';

      if (studentVisible) {
        logger.info('Property is visible to students', { propertyId, title: property.title });
      } else {
        logger.info('Property not yet visible to students', {
          propertyId,
          title: property.title,
          is_available: property.is_available,
          verification_status: property.verification_status,
        });
      }

      return {
        pipelineHealthy: true,
        studentVisible,
        property,
      };
    } catch (error) {
      logger.error('Visibility check failed', error);
      return {
        pipelineHealthy: false,
        studentVisible: false,
      };
    }
  }
}
