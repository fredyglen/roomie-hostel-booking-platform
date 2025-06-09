
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
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
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
}
