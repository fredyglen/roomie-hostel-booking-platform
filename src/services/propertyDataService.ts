
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
    // Use a much simpler approach to avoid deep type inference
    const queryBuilder = supabase
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

    // Apply filters one by one to avoid complex type building
    if (options.filters?.type) {
      queryBuilder.eq('property_type', options.filters.type);
    }
    
    if (options.filters?.status) {
      queryBuilder.eq('status', options.filters.status);
    }
    
    if (options.filters?.minPrice) {
      queryBuilder.gte('rent', options.filters.minPrice);
    }
    
    if (options.filters?.maxPrice) {
      queryBuilder.lte('rent', options.filters.maxPrice);
    }
    
    if (options.filters?.city) {
      queryBuilder.ilike('city', `%${options.filters.city}%`);
    }

    // Apply pagination
    if (options.limit) {
      queryBuilder.limit(options.limit);
    }
    
    if (options.offset) {
      queryBuilder.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Execute the query with minimal typing
    const result = await queryBuilder;
    const { data, error: queryError, count } = result;

    if (queryError) throw queryError;

    // Process results with explicit type handling
    const transformedProperties: Property[] = [];
    if (data) {
      for (const item of data) {
        try {
          // Use any type to completely avoid inference issues
          const rawProperty = item as any;
          const transformed = transformDbProperty(rawProperty);
          transformedProperties.push(transformed);
        } catch (transformError) {
          console.error('Error transforming property:', transformError);
        }
      }
    }

    const totalCount = count || 0;
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    return {
      properties: transformedProperties,
      totalCount,
      hasMore: transformedProperties.length === limit && totalCount > offset + transformedProperties.length
    };
  } catch (error) {
    console.error('Error in fetchProperties:', error);
    throw error;
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const result = await supabase
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

    const { data, error: queryError } = result;

    if (queryError) throw queryError;
    if (!data) return null;

    // Use any type to avoid inference issues
    const rawProperty = data as any;
    const transformedProperty = transformDbProperty(rawProperty);
    return transformedProperty;
  } catch (error) {
    console.error('Error in fetchPropertyById:', error);
    throw error;
  }
}
