import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyInsert,
  PropertyUpdate,
  PropertyType,
  PropertyStatus
} from '@/types/property';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/CommonTypes';

// Property search parameters interface
interface PropertySearchParams {
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Get all properties with pagination
export async function getProperties(
  params: PaginationParams & Partial<PropertySearchParams> = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<Property>>> {
  try {
    const { page = 1, pageSize = 10, ...filters } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.city) {
      query = query.ilike('address->city', `%${filters.city}%`);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: {
        data: data as Property[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch properties',
        details: error
      }
    };
  }
}

// Get a single property by ID
export async function getPropertyById(id: string): Promise<ApiResponse<Property>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, owner:owner_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Property
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch property',
        details: error
      }
    };
  }
}

// Create a new property
export async function createProperty(property: PropertyInsert): Promise<ApiResponse<Property>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Property
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to create property',
        details: error
      }
    };
  }
}

// Update an existing property
export async function updateProperty(
  id: string, 
  property: PropertyUpdate
): Promise<ApiResponse<Property>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: data as Property
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to update property',
        details: error
      }
    };
  }
}

// Delete a property
export async function deleteProperty(id: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: null
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to delete property',
        details: error
      }
    };
  }
}

// Get properties by owner ID
export async function getPropertiesByOwnerId(
  ownerId: string,
  params: PaginationParams = { page: 1, pageSize: 10 }
): Promise<ApiResponse<PaginatedResponse<Property>>> {
  try {
    const { page = 1, pageSize = 10 } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      status: 'success',
      data: {
        data: data as Property[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: {
        message: 'Failed to fetch properties by owner',
        details: error
      }
    };
  }
}