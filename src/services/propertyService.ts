
import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyType,
  PropertyCategory,
  PropertyId,
  PropertyPrice,
  createPropertyId,
  createPropertyPrice
} from '@/types/property';
import { User } from '@/types/core';
import { PropertyQueries } from '@/services/database/standardizedQueries';
import { Database } from '@/integrations/supabase/types';

// Apple-grade branded type functions for type safety
const createAddress = (address: string): string => address;

// Type-safe database update interface
type DatabasePropertyUpdate = Partial<Database['public']['Tables']['properties']['Update']>;

// Apple-grade property field mapping for database updates
// Mutable interface to handle readonly Property interface updates
interface PropertyUpdateMapping {
  title?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  rent?: number;
  property_type?: string;
  property_category?: string;
  bedrooms?: number;
  bathrooms?: number;
  is_available?: boolean;
  available_from?: string;
  amenities?: string[];
  images?: string[];
  base_price_per_semester?: number;
  gender_restriction?: string;
  max_occupants?: number;
  current_occupancy?: number;
  verification_status?: string;
}

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    try {
      // Use direct database query instead of PropertyQueries to avoid column issues
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          owner_id,
          title,
          description,
          property_type,
          property_category,
          address,
          city,
          state,
          zip,
          base_price_per_semester,
          currency,
          is_available,
          gender_restriction,
          max_occupants,
          amenities,
          images,
          verification_status,
          created_at,
          updated_at
        `)
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      // Transform the data to match our Property interface
      return (data || []).map(property => {

      return {
        // Core identification with branded types
        id: createPropertyId(property.id),
        name: property.title || 'Unnamed Property',
        title: property.title,
        description: property.description || '',
        type: (property.property_type as PropertyType) || 'hostel',
        property_type: property.property_type,
        status: property.is_available ? 'available' : 'inactive',
        is_available: property.is_available,

        // Location information with branded types
        address: createAddress(property.address || ''),
        city: property.city || '',
        state: property.state || '',
        zip: property.zip || '',

        // Pricing with branded types
        price: createPropertyPrice(property.base_price_per_semester || 0),
        base_price_per_semester: property.base_price_per_semester || 0,
        currency: property.currency || 'GHS',

        // Property category and occupancy
        property_category: property.property_category,
        gender_restriction: (property as any).gender_restriction,
        max_occupancy: property.max_occupants,
        current_occupancy: 0,

        // Verification
        verification_status: property.verification_status,

        // Features and amenities
        amenities: property.amenities || [],
        images: property.images || [],
        cover_image_url: Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null,

        // Ownership and metadata
        owner_id: property.owner_id,
        ownerId: property.owner_id || '',

        // Timestamps
        created_at: property.created_at,
        updated_at: property.updated_at,
        createdAt: property.created_at,
        updatedAt: property.updated_at,

        // Additional fields for compatibility
        buildings: [],
        stories: [],
      } as Property;
    });
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  async getPropertyById(id: string): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .select(`*`)
      .eq('id', id)
      .single();
    if (error) throw error;
    

    return {
      id: createPropertyId(data.id),
      owner_id: data.owner_id,
      name: data.title,
      title: data.title,
      description: data.description,
      address: createAddress(data.address || ''),
      city: data.city,
      state: data.state,
      zip: data.zip || '00000',
      type: data.property_type as PropertyType,
      property_type: data.property_type,
      property_category: data.property_category,
      status: data.is_available ? 'available' : 'inactive',
      is_available: data.is_available,
      verification_status: data.verification_status,
      images: data.images || [],
      amenities: data.amenities || [],
      available_from: data.available_from,
      created_at: data.created_at,
      updated_at: data.updated_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,

      // Additional fields for compatibility
      buildings: [],
      stories: [],
    } as Property;
  },
  
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    // Convert Property to database format
    const dbProperty = {
      title: property.title || property.name,
      description: property.description,
      address: typeof property.address === 'string' ? property.address : '',
      city: property.city,
      state: property.state,
      zip: property.zip,
      rent: property.rent,
      property_type: property.type,
      property_category: property.property_category,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      owner_id: property.owner_id,
      is_available: property.is_available,
      available_from: property.available_from,
      amenities: Array.isArray(property.amenities) ? property.amenities as string[] : [],
      images: property.images
    };
    
    const { data, error } = await supabase
      .from('properties')
      .insert([dbProperty])
      .select()
      .single();
    if (error) throw error;
    return data as Property;
  },
  
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    // Apple-grade type-safe conversion from Property updates to database format
    const dbUpdates: PropertyUpdateMapping = {};

    // Direct field mappings with type safety
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (typeof updates.address === 'string') dbUpdates.address = updates.address;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.zip !== undefined) dbUpdates.zip = updates.zip;
    if (updates.is_available !== undefined) dbUpdates.is_available = updates.is_available;
    if (updates.available_from !== undefined) dbUpdates.available_from = updates.available_from;

    // Field name transformations with Apple-grade type safety
    if (updates.rent !== undefined) {
      dbUpdates.base_price_per_semester = updates.rent;
    }
    if (updates.type !== undefined) {
      dbUpdates.property_type = updates.type;
    }
    if (updates.property_category !== undefined) {
      dbUpdates.property_category = updates.property_category;
    }
    if (updates.gender_restriction !== undefined) {
      dbUpdates.gender_restriction = updates.gender_restriction as string;
    }
    if (updates.max_occupancy !== undefined) {
      dbUpdates.max_occupants = updates.max_occupancy;
    }
    // current_occupancy is not a physical column; skip updating it
    if (updates.verification_status !== undefined) {
      dbUpdates.verification_status = updates.verification_status;
    }

    // Array fields with validation
    if (updates.amenities !== undefined) {
      dbUpdates.amenities = Array.isArray(updates.amenities) ? updates.amenities : [];
    }
    if (updates.images !== undefined) {
      dbUpdates.images = Array.isArray(updates.images) ? updates.images : [];
    }

    // Perform the database update with type safety
    const { data, error } = await supabase
      .from('properties')
      .update(dbUpdates as DatabasePropertyUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update property: ${error.message}`);
    }

    if (!data) {
      throw new Error('Property update returned no data');
    }

    return data as Property;
  },
  
  async deleteProperty(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },
}; 
