
import { supabase } from '@/lib/supabase';
import { Property, PropertyType, PropertyStatus } from '@/types/property';
import { transformDbProperty, RawProperty } from '@/utils/propertyTransforms';

export interface PropertyQueryOptions {
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

export interface PropertyData {
  properties: Property[];
  totalCount: number;
  hasMore: boolean;
}

export async function fetchProperties(options: PropertyQueryOptions = {}): Promise<PropertyData> {
  try {
    // Build the base query with explicit typing
    const baseQuery = supabase
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

    // Apply filters step by step to avoid deep inference
    let query = baseQuery;
    
    if (options.filters?.type) {
      query = query.eq('property_type', options.filters.type);
    }
    
    if (options.filters?.status) {
      query = query.eq('status', options.filters.status);
    }
    
    if (options.filters?.minPrice) {
      query = query.gte('rent', options.filters.minPrice);
    }
    
    if (options.filters?.maxPrice) {
      query = query.lte('rent', options.filters.maxPrice);
    }
    
    if (options.filters?.city) {
      query = query.ilike('city', `%${options.filters.city}%`);
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

    // Transform properties with explicit typing to avoid deep inference
    const transformedProperties: Property[] = [];
    if (data && Array.isArray(data)) {
      for (const item of data) {
        try {
          // Explicitly cast to avoid deep type inference
          const rawProperty = item as unknown as RawProperty;
          const transformed = transformDbProperty(rawProperty);
          transformedProperties.push(transformed);
        } catch (transformError) {
          console.error('Error transforming property:', transformError);
          // Skip this property but continue with others
        }
      }
    }

    const totalCount = count || 0;
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    const result: PropertyData = {
      properties: transformedProperties,
      totalCount,
      hasMore: transformedProperties.length === limit && totalCount > offset + transformedProperties.length
    };

    return result;
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    throw error;
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
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

    // Explicitly cast to avoid deep type inference
    const rawProperty = data as unknown as RawProperty;
    const transformedProperty = transformDbProperty(rawProperty);
    return transformedProperty;
  } catch (error) {
    console.error('Error in fetchPropertyById:', error);
    throw error;
  }
}
