
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyType, PropertyStatus } from '@/types/property';
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
  try {
    // Simple, explicit query without problematic columns
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
        profiles!properties_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `, { count: 'exact' })
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(options.limit || 10);

    if (error) {
      console.error('Database error:', error);
      return {
        properties: [],
        totalCount: 0,
        hasMore: false
      };
    }

    const properties = (data || []).map((item: Record<string, unknown>) => {
      try {
        return transformDbProperty(item);
      } catch (transformError) {
        console.error('Transform error:', transformError);
        // Return a basic property on transform error
        return {
          id: item.id || 'unknown',
          owner_id: item.owner_id || 'unknown',
          name: item.title || 'Unknown Property',
          title: item.title || 'Unknown Property',
          description: item.description || '',
          type: 'hostel' as PropertyType,
          status: 'available' as PropertyStatus,
          price: item.rent || 0,
          rent: item.rent || 0,
          location: item.address || '',
          address: item.address || '',
          city: item.city || '',
          state: item.state || '',
          zip: item.zip || '',
          propertyCategory: 'Hostel' as const,
          verified: true,
          is_available: true,
          bedrooms: item.bedrooms || 1,
          bathrooms: item.bathrooms || 1,
          amenities: [],
          images: [],
          available_from: '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          house_rules: 'No smoking, no pets',
          stories: [],
          features: []
        } as Property;
      }
    });

    const totalCount = count || 0;
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    return {
      properties,
      totalCount,
      hasMore: properties.length === limit && totalCount > offset + properties.length
    };
  } catch (error) {
    console.error('Fetch properties error:', error);
    return {
      properties: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    console.log('fetchPropertyById called with ID:', id);

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
      .single();

    console.log('Supabase query result:', { data, error });

    if (error) {
      console.error('Database error:', error);
      return null;
    }

    if (!data) {
      console.log('No data returned from query');
      return null;
    }

    console.log('Raw data before transform:', data);
    const transformedProperty = transformDbProperty(data as any);
    console.log('Transformed property:', transformedProperty);

    return transformedProperty;
  } catch (error) {
    console.error('Fetch property by ID error:', error);
    return null;
  }
}
