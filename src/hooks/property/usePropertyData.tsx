
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyType, PropertyStatus, PropertyCategory } from '@/types/property';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PropertyQueryOptions {
  limit?: number;
  offset?: number;
  filters?: {
    type?: PropertyType;
    status?: PropertyStatus;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
  };
}

interface PropertyData {
  properties: Property[];
  totalCount: number;
  hasMore: boolean;
}

// Explicit type for database results - no deep inference
interface RawProperty {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  rent: number;
  property_type: string;
  property_category?: string;
  is_available: boolean;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
  available_from?: string;
  available_to?: string;
  created_at: string;
  updated_at: string;
  house_rules?: string;
  profiles?: RawProfile | RawProfile[];
}

interface RawProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

// Simple transformation function with explicit types
function transformDbProperty(dbItem: RawProperty): Property {
  // Extract profile data safely
  const profileData: RawProfile | undefined = Array.isArray(dbItem.profiles) 
    ? dbItem.profiles[0] 
    : dbItem.profiles;
  
  const property: Property = {
    id: dbItem.id,
    owner_id: dbItem.owner_id,
    name: dbItem.title,
    title: dbItem.title,
    description: dbItem.description,
    type: (dbItem.property_type as PropertyType) || 'hostel',
    status: (dbItem.is_available ? 'available' : 'occupied') as PropertyStatus,
    price: dbItem.rent,
    rent: dbItem.rent,
    location: dbItem.address,
    address: dbItem.address,
    city: dbItem.city,
    state: dbItem.state,
    zip: dbItem.zip || '',
    propertyCategory: (dbItem.property_category as PropertyCategory) || 'Hostel',
    verified: true,
    is_available: dbItem.is_available,
    bedrooms: dbItem.bedrooms,
    bathrooms: dbItem.bathrooms,
    amenities: dbItem.amenities || [],
    images: dbItem.images || [],
    available_from: dbItem.available_from || '',
    created_at: dbItem.created_at,
    updated_at: dbItem.updated_at,
    house_rules: dbItem.house_rules || 'No smoking, no pets',
    stories: [],
    features: []
  };

  // Add owner info if available
  if (profileData) {
    property.owner = {
      id: profileData.id || dbItem.owner_id,
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: profileData.email || '',
      phone: profileData.phone || '',
      verified: true,
      responseRate: '95%'
    };
  } else {
    property.owner = {
      id: dbItem.owner_id,
      name: 'Property Owner',
      email: '',
      phone: '',
      verified: false,
      responseRate: '0%'
    };
  }

  return property;
}

export const usePropertyData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Explicitly typed function to avoid deep type inference
  const getProperties: (options?: PropertyQueryOptions) => Promise<PropertyData> = useCallback(async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_owner_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `, { count: 'exact' });

      // Apply filters
      if (options.filters) {
        const { type, status, minPrice, maxPrice, city } = options.filters;
        
        if (type) {
          query = query.eq('property_type', type);
        }
        
        if (status) {
          query = query.eq('status', status);
        }
        
        if (minPrice) {
          query = query.gte('rent', minPrice);
        }
        
        if (maxPrice) {
          query = query.lte('rent', maxPrice);
        }
        
        if (city) {
          query = query.ilike('city', `%${city}%`);
        }
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Transform properties with explicit typing
      const transformedProperties: Property[] = [];
      if (data) {
        for (const item of data) {
          try {
            const rawProperty = item as RawProperty;
            const transformed = transformDbProperty(rawProperty);
            transformedProperties.push(transformed);
          } catch (transformError) {
            console.error('Error transforming property:', transformError);
            // Skip this property but continue with others
          }
        }
      }

      const result: PropertyData = {
        properties: transformedProperties,
        totalCount: count || 0,
        hasMore: transformedProperties.length === (options.limit || 10) && count ? count > (options.offset || 0) + transformedProperties.length : false
      };

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      ErrorHandler.handle(err, 'Error fetching properties:');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Explicitly typed function to avoid deep type inference
  const getPropertyById: (id: string) => Promise<Property | null> = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_owner_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (queryError) throw queryError;
      if (!data) return null;

      const rawProperty = data as RawProperty;
      const transformedProperty = transformDbProperty(rawProperty);
      return transformedProperty;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property';
      setError(errorMessage);
      ErrorHandler.handle(err, 'Error fetching property:');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProperties,
    getPropertyById,
    loading,
    error
  };
};
