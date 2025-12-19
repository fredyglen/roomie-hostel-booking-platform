
import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyType,
  PropertyStatus,
  PropertyCategory,
  PropertyId,
  PropertyPrice,
  createPropertyId,
  createPropertyPrice
} from '@/types/property';
import { transformDbProperty } from '@/utils/propertyTransforms';

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

// Simple database property interface matching actual database columns
interface SimpleDbProperty {
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
  profiles?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

export async function fetchProperties(options: PropertyQueryOptions = {}): Promise<PropertyData> {
  // Fail-loud variant: any database or transform error will throw so callers
  // (typically React Query hooks) can surface a clear error state instead of
  // silently returning empty data.
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;

  const { data, error, count } = await supabase
    .from('properties')
    .select(`
      id,
      owner_id,
      title,
      description,
      address,
      city,
      state,
      zip,
      rent,
      property_type,
      property_category,
      is_available,
      bedrooms,
      bathrooms,
      amenities,
      images,
      available_from,
      available_to,
      created_at,
      updated_at,
      profiles:owner_id (
        id,
        first_name,
        last_name,
        email,
        phone
      )
    `, { count: 'exact' })
    .eq('is_available', true)
    .eq('verification_status', 'verified')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Database error in fetchProperties:', error);
    throw new Error(error.message || 'Failed to fetch properties');
  }

  if (!data) {
    throw new Error('No data returned from properties query');
  }

  const properties = data.map((item: SimpleDbProperty) => {
    try {
      return transformDbProperty(item);
    } catch (transformError) {
      console.error('Transform error in fetchProperties:', transformError, { item });
      throw new Error('Failed to transform property data');
    }
  });

  const totalCount = count ?? properties.length;

  return {
    properties,
    totalCount,
    hasMore: properties.length === limit && totalCount > offset + properties.length
  };
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  // Fail-loud variant: true "not found" returns null, all other
  // database/transform issues throw so the caller can distinguish them.
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id,
      owner_id,
      title,
      description,
      address,
      city,
      state,
      zip,
      rent,
      property_type,
      property_category,
      is_available,
      bedrooms,
      bathrooms,
      amenities,
      images,
      available_from,
      available_to,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    // If Supabase explicitly reports no rows, treat as not-found
    if ((error as any).code === 'PGRST116' || error.message.includes('Results contain 0 rows')) {
      return null;
    }

    console.error('Database error in fetchPropertyById:', error);
    throw new Error(error.message || 'Failed to fetch property');
  }

  if (!data) {
    return null;
  }

  try {
    return transformDbProperty(data as SimpleDbProperty);
  } catch (transformError) {
    console.error('Transform error in fetchPropertyById:', transformError, { data });
    throw new Error('Failed to transform property data');
  }
}
