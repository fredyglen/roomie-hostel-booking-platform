/**
 * Hostel Data Transformation Service
 * Apple-Grade TypeScript service for transforming various hostel data formats
 * into unified database schema following BE CONSCIOUS architectural guidelines
 * 
 * @fileoverview Comprehensive data transformation for Ghana hostels
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { ghanaHostelsSemesterPricing } from '@/data/ghana-hostels-semester-pricing';
import { ghanaHostelsExtended } from '@/data/ghana-hostels-extended';
import { allGhanaHostels } from '@/data/mock-properties';
import type { GhanaHostelProperty } from '@/types/property';

/**
 * Database property interface matching Supabase schema
 */
interface DatabaseProperty {
  readonly id?: string;
  readonly owner_id: string;
  readonly title: string;
  readonly description: string;
  readonly address: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly property_type: string;
  readonly property_category: string;
  readonly rent: number;
  readonly base_price_per_semester?: number;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly max_occupants?: number;
  readonly size?: number;
  readonly available_from: string;
  readonly available_to?: string;
  readonly is_furnished?: boolean;
  readonly is_available: boolean;
  readonly images: readonly string[];
  readonly amenities: readonly string[];
  readonly gender_restriction?: string;
  readonly semester_availability?: readonly string[];
  readonly total_rooms?: number;
  readonly rooms_available?: number;
  readonly beds_per_room?: number;
  readonly beds_available?: number;
  readonly has_bedframes?: boolean;
  readonly has_mattresses?: boolean;
  readonly has_wardrobes?: boolean;
  readonly has_fan?: boolean;
  readonly has_tiled_room?: boolean;
  readonly washroom_type?: string;
  readonly shared_washroom_count?: number;
  readonly currency: string;
  readonly verification_status: string;
  readonly subscription_status: string;
}

/**
 * Room configuration for hostels
 */
interface RoomConfiguration {
  readonly type: string;
  readonly price: number;
  readonly maxOccupants: number;
  readonly available: boolean;
  readonly description?: string;
}

/**
 * Hostel Data Transformation Service
 * Handles conversion of various hostel data formats to unified database schema
 */
export class HostelDataTransformationService {
  private static instance: HostelDataTransformationService;
  private readonly defaultOwnerId = 'default-owner-id';

  private constructor() {}

  static getInstance(): HostelDataTransformationService {
    if (!HostelDataTransformationService.instance) {
      HostelDataTransformationService.instance = new HostelDataTransformationService();
    }
    return HostelDataTransformationService.instance;
  }

  /**
   * Transform Ghana hostel property to database format
   */
  private transformGhanaHostelToDatabase(hostel: GhanaHostelProperty): DatabaseProperty {
    // Extract gender restriction from amenities
    const genderRestriction = hostel.amenities.includes('Female Only') 
      ? 'female' 
      : hostel.amenities.includes('Male Only') 
        ? 'male' 
        : 'mixed';

    // Determine washroom type
    const washroom_type = hostel.bathrooms > 0 ? 'self_contained' : 'shared';
    
    // Calculate room configurations
    const roomOptions = hostel.roomOptions || [];
    const maxOccupants = Math.max(...roomOptions.map(r => r.maxOccupants), hostel.maxOccupants || 1);
    const minPrice = Math.min(...roomOptions.map(r => r.price), hostel.pricePerSemester);

    return {
      id: hostel.id,
      owner_id: this.defaultOwnerId,
      title: hostel.name,
      description: hostel.description,
      address: typeof hostel.location === 'string' ? hostel.location : hostel.location.address,
      city: typeof hostel.location === 'string' ? 'Accra' : hostel.location.city,
      state: typeof hostel.location === 'string' ? 'Greater Accra' : hostel.location.state,
      zip: '00000',
      property_type: hostel.propertyType || 'hostel',
      property_category: 'Hostel',
      rent: minPrice,
      base_price_per_semester: hostel.pricePerSemester,
      bedrooms: hostel.bedrooms || 1,
      bathrooms: hostel.bathrooms || 0,
      max_occupants: maxOccupants,
      size: null,
      available_from: hostel.availableFrom || '2024-08-01',
      available_to: hostel.availableTo || '2025-07-31',
      is_furnished: true,
      is_available: hostel.isActive !== false,
      images: hostel.images || [],
      amenities: hostel.amenities || [],
      gender_restriction: genderRestriction,
      semester_availability: ['2024-2025'],
      total_rooms: roomOptions.length || 1,
      rooms_available: roomOptions.filter(r => r.available).length || 1,
      beds_per_room: maxOccupants,
      beds_available: roomOptions.reduce((sum, r) => sum + (r.available ? r.maxOccupants : 0), 0) || maxOccupants,
      has_bedframes: true,
      has_mattresses: true,
      has_wardrobes: true,
      has_fan: hostel.amenities.includes('Fan') || hostel.amenities.includes('Air Conditioning'),
      has_tiled_room: true,
      washroom_type,
      shared_washroom_count: washroom_type === 'shared' ? 2 : null,
      currency: 'GHS',
      verification_status: 'verified',
      subscription_status: 'free'
    };
  }

  /**
   * Transform standard property to database format
   */
  private transformPropertyToDatabase(property: any): DatabaseProperty {
    const genderRestriction = property.amenities?.includes('Female Only') 
      ? 'female' 
      : property.amenities?.includes('Male Only') 
        ? 'male' 
        : 'mixed';

    return {
      id: property.id,
      owner_id: this.defaultOwnerId,
      title: property.name || property.title,
      description: property.description,
      address: typeof property.location === 'string' ? property.location : property.location?.address || property.address || 'Accra, Ghana',
      city: typeof property.location === 'string' ? 'Accra' : property.location?.city || property.city || 'Accra',
      state: typeof property.location === 'string' ? 'Greater Accra' : property.location?.state || property.state || 'Greater Accra',
      zip: '00000',
      property_type: property.propertyType || property.property_type || 'hostel',
      property_category: 'Hostel',
      rent: property.price || property.rent || property.pricePerSemester || 3000,
      base_price_per_semester: property.pricePerSemester || property.price || property.rent || 3000,
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 0,
      max_occupants: property.maxOccupants || property.max_occupants || 2,
      available_from: property.availableFrom || property.available_from || '2024-08-01',
      available_to: property.availableTo || property.available_to || '2025-07-31',
      is_furnished: true,
      is_available: property.isActive !== false && property.is_available !== false,
      images: property.images || [],
      amenities: property.amenities || [],
      gender_restriction: genderRestriction,
      semester_availability: ['2024-2025'],
      total_rooms: 1,
      rooms_available: 1,
      beds_per_room: property.maxOccupants || property.max_occupants || 2,
      beds_available: property.maxOccupants || property.max_occupants || 2,
      has_bedframes: true,
      has_mattresses: true,
      has_wardrobes: true,
      has_fan: property.amenities?.includes('Fan') || property.amenities?.includes('Air Conditioning') || false,
      has_tiled_room: true,
      washroom_type: (property.bathrooms || 0) > 0 ? 'self_contained' : 'shared',
      shared_washroom_count: (property.bathrooms || 0) === 0 ? 2 : null,
      currency: 'GHS',
      verification_status: 'verified',
      subscription_status: 'free'
    };
  }

  /**
   * Get all unique hostels from all data sources
   */
  private getAllUniqueHostels(): DatabaseProperty[] {
    const allHostels: DatabaseProperty[] = [];
    const seenIds = new Set<string>();

    // Transform Ghana hostels with semester pricing
    for (const hostel of ghanaHostelsSemesterPricing) {
      if (!seenIds.has(hostel.id)) {
        allHostels.push(this.transformGhanaHostelToDatabase(hostel));
        seenIds.add(hostel.id);
      }
    }

    // Transform extended Ghana hostels
    for (const hostel of ghanaHostelsExtended) {
      if (!seenIds.has(hostel.id)) {
        allHostels.push(this.transformPropertyToDatabase(hostel));
        seenIds.add(hostel.id);
      }
    }

    // Transform all Ghana hostels from mock data
    for (const hostel of allGhanaHostels) {
      if (!seenIds.has(hostel.id)) {
        allHostels.push(this.transformPropertyToDatabase(hostel));
        seenIds.add(hostel.id);
      }
    }

    logger.info(`Transformed ${allHostels.length} unique hostels for database insertion`);
    return allHostels;
  }

  /**
   * Check if hostel already exists in database
   */
  private async hostelExistsInDatabase(hostelId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id')
        .eq('id', hostelId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return !!data;
    } catch (error) {
      logger.error(`Error checking if hostel exists: ${hostelId}`, error);
      return false;
    }
  }

  /**
   * Insert single hostel into database
   */
  private async insertHostelToDatabase(hostel: DatabaseProperty): Promise<boolean> {
    try {
      const exists = await this.hostelExistsInDatabase(hostel.id!);
      if (exists) {
        logger.info(`Hostel already exists, skipping: ${hostel.title}`);
        return true;
      }

      const { error } = await supabase
        .from('properties')
        .insert([hostel]);

      if (error) {
        throw error;
      }

      logger.info(`Successfully inserted hostel: ${hostel.title}`);
      return true;
    } catch (error) {
      ErrorHandler.handle(error, `Failed to insert hostel: ${hostel.title}`);
      return false;
    }
  }

  /**
   * Populate database with all hostels
   */
  async populateDatabase(): Promise<{ success: number; failed: number; total: number }> {
    try {
      logger.info('Starting comprehensive hostel database population');
      
      const allHostels = this.getAllUniqueHostels();
      let successCount = 0;
      let failedCount = 0;

      for (const hostel of allHostels) {
        const success = await this.insertHostelToDatabase(hostel);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      }

      const result = {
        success: successCount,
        failed: failedCount,
        total: allHostels.length
      };

      logger.info('Hostel database population completed', result);
      return result;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to populate hostel database');
      throw error;
    }
  }

  /**
   * Get transformation statistics
   */
  getTransformationStats(): {
    semesterPricingHostels: number;
    extendedHostels: number;
    mockDataHostels: number;
    totalUniqueHostels: number;
  } {
    const allHostels = this.getAllUniqueHostels();
    
    return {
      semesterPricingHostels: ghanaHostelsSemesterPricing.length,
      extendedHostels: ghanaHostelsExtended.length,
      mockDataHostels: allGhanaHostels.length,
      totalUniqueHostels: allHostels.length
    };
  }
}

// Export singleton instance
export const hostelDataTransformationService = HostelDataTransformationService.getInstance();
export default hostelDataTransformationService;
