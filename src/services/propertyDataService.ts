
import { supabase } from '@/lib/supabase';
import { Property, PropertyType, PropertyStatus } from '@/types/property';

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

// Simple type for database property - avoiding deep inference
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
  house_rules?: string;
  profiles?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

function transformProperty(dbProperty: SimpleDbProperty): Property {
  const profileData = dbProperty.profiles;
  
  return {
    id: dbProperty.id,
    owner_id: dbProperty.owner_id,
    name: dbProperty.title,
    title: dbProperty.title,
    description: dbProperty.description,
    type: (dbProperty.property_type as PropertyType) || 'hostel',
    status: (dbProperty.is_available ? 'available' : 'occupied') as PropertyStatus,
    price: dbProperty.rent,
    rent: dbProperty.rent,
    location: dbProperty.address,
    address: dbProperty.address,
    city: dbProperty.city,
    state: dbProperty.state,
    zip: dbProperty.zip || '',
    propertyCategory: (dbProperty.property_category as any) || 'Hostel',
    verified: true,
    is_available: dbProperty.is_available,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    amenities: dbProperty.amenities || [],
    images: dbProperty.images || [],
    available_from: dbProperty.available_from || '',
    created_at: dbProperty.created_at,
    updated_at: dbProperty.updated_at,
    house_rules: dbProperty.house_rules || 'No smoking, no pets',
    stories: [],
    features: [],
    owner: profileData ? {
      id: profileData.id || dbProperty.owner_id,
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: profileData.email || '',
      phone: profileData.phone || '',
      verified: true,
      responseRate: '95%'
    } : {
      id: dbProperty.owner_id,
      name: 'Property Owner',
      email: '',
      phone: '',
      verified: false,
      responseRate: '0%'
    }
  };
}

export async function fetchProperties(options: PropertyQueryOptions = {}): Promise<PropertyData> {
  try {
    // Build query step by step to avoid type inference issues
    let query = supabase
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
        house_rules,
        profiles!properties_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `, { count: 'exact' });

    // Apply filters
    if (options.filters?.type) {
      query = query.eq('property_type', options.filters.type);
    }
    
    if (options.filters?.status) {
      const isAvailable = options.filters.status === 'available';
      query = query.eq('is_available', isAvailable);
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
      const end = options.offset + (options.limit || 10) - 1;
      query = query.range(options.offset, end);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const properties = (data || []).map((item: any) => {
      try {
        return transformProperty(item as SimpleDbProperty);
      } catch (transformError) {
        console.error('Error transforming property:', transformError);
        // Return a minimal property object on error
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
          propertyCategory: 'Hostel' as any,
          verified: false,
          is_available: true,
          bedrooms: item.bedrooms || 1,
          bathrooms: item.bathrooms || 1,
          amenities: [],
          images: [],
          available_from: '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          house_rules: '',
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
    console.error('Error in fetchProperties:', error);
    // Return empty result on error instead of throwing
    return {
      properties: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
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
        updated_at,
        house_rules,
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

    if (error) throw error;
    if (!data) return null;

    return transformProperty(data as SimpleDbProperty);
  } catch (error) {
    console.error('Error in fetchPropertyById:', error);
    return null;
  }
}
