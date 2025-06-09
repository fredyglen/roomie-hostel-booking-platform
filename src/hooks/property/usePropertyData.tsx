
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

interface DatabaseProperty {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: string;
  property_category: string;
  is_available: boolean;
  rent: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  available_from: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }[];
}

export const usePropertyData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformDatabaseProperty = (item: DatabaseProperty): Property => {
    // Handle profiles - it might be an array or a single object
    const ownerProfile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
    
    return {
      id: item.id,
      owner_id: item.owner_id,
      name: item.title, // Add missing name property
      title: item.title,
      description: item.description,
      type: item.property_type as PropertyType,
      status: item.is_available ? 'available' as PropertyStatus : 'unavailable' as PropertyStatus,
      price: item.rent,
      rent: item.rent,
      location: item.address,
      address: item.address,
      city: item.city,
      state: item.state,
      zip: item.zip || '',
      propertyCategory: item.property_category as PropertyCategory || 'Hostel',
      verified: true,
      is_available: item.is_available,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      amenities: Array.isArray(item.amenities) ? item.amenities : [],
      images: Array.isArray(item.images) ? item.images : [],
      available_from: item.available_from,
      created_at: item.created_at,
      updated_at: item.updated_at,
      owner: ownerProfile ? {
        id: item.owner_id,
        name: `${ownerProfile.first_name || ''} ${ownerProfile.last_name || ''}`.trim(),
        email: ownerProfile.email,
        phone: ownerProfile.phone,
        verified: true,
        responseRate: '95%'
      } : {
        id: item.owner_id,
        name: 'Property Owner',
        email: '',
        phone: '',
        verified: false,
        responseRate: '0%'
      },
      house_rules: 'No smoking, no pets',
      stories: [],
      features: []
    };
  };

  const getProperties = useCallback(async (options: PropertyQueryOptions = {}): Promise<PropertyData> => {
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

      const transformedProperties: Property[] = (data || []).map(transformDatabaseProperty);

      return {
        properties: transformedProperties,
        totalCount: count || 0,
        hasMore: transformedProperties.length === (options.limit || 10) && count ? count > (options.offset || 0) + transformedProperties.length : false
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      ErrorHandler.handle(err, 'Error fetching properties:');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyById = useCallback(async (id: string): Promise<Property | null> => {
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

      const transformedProperty = transformDatabaseProperty(data);
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
