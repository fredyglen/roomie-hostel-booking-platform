
/**
 * Property Data Service for ROOMi Platform
 * Handles property data fetching with proper type safety and error handling
 *
 * @fileoverview Apple-Level Property Data Service Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyType, PropertyStatus } from '@/types/property';
import { transformDbProperty } from '@/utils/propertyTransforms';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { PropertyNotFoundError } from '@/errors/property-errors';
import { InternalServerError } from '@/errors/base';

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

/**
 * Fetch properties with filtering and pagination
 *
 * @param options - Query options for filtering and pagination
 * @returns Promise<PropertyData> - Properties with metadata
 * @throws InternalServerError - When database operation fails
 */
export async function fetchProperties(options: PropertyQueryOptions = {}): Promise<PropertyData> {
  try {
    // Build query with proper column selection
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
        base_price_per_semester,
        currency,
        property_type,
        verification_status,
        is_available,
        bedrooms,
        bathrooms,
        kitchens,
        parking_spaces,
        furnished,
        pets_allowed,
        has_internet,
        has_gas,
        has_cleaning,
        has_security,
        amenities,
        rules,
        images,
        created_at,
        updated_at,
        profiles!properties_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone,
          avatar,
          created_at,
          updated_at
        )
      `, { count: 'exact' });

    // Apply filters
    if (options.filters) {
      const { type, status, minPrice, maxPrice, city } = options.filters;

      if (type) {
        query = query.eq('property_type', type);
      }

      if (status === 'active') {
        query = query.eq('is_available', true);
      } else if (status === 'inactive') {
        query = query.eq('is_available', false);
      }

      if (minPrice) {
        query = query.gte('base_price_per_semester', minPrice);
      }

      if (maxPrice) {
        query = query.lte('base_price_per_semester', maxPrice);
      }

      if (city) {
        query = query.ilike('city', `%${city}%`);
      }
    } else {
      // Default to available properties only
      query = query.eq('is_available', true);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new InternalServerError(`Database query failed: ${error.message}`, {
        operation: 'fetchProperties',
        error: error.message
      });
    }

    // Transform database results to Property interface
    const properties: Property[] = [];

    for (const item of data || []) {
      try {
        const transformedProperty = transformDbProperty(item);
        properties.push(transformedProperty);
      } catch (transformError) {
        // Log transformation error but continue processing other properties
        ErrorHandler.handle(transformError, {
          operation: 'transformDbProperty',
          propertyId: item.id,
          propertyTitle: item.title
        });

        // Skip this property rather than returning invalid data
        continue;
      }
    }

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

/**
 * Fetch a single property by ID
 *
 * @param id - Property ID to fetch
 * @returns Promise<Property | null> - The property or null if not found
 * @throws PropertyNotFoundError - When property doesn't exist
 * @throws InternalServerError - When database operation fails
 */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  if (!id) {
    throw new PropertyNotFoundError('Property ID is required', id);
  }

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
        base_price_per_semester,
        currency,
        property_type,
        verification_status,
        is_available,
        bedrooms,
        bathrooms,
        kitchens,
        parking_spaces,
        furnished,
        pets_allowed,
        has_internet,
        has_gas,
        has_cleaning,
        has_security,
        amenities,
        rules,
        images,
        created_at,
        updated_at,
        profiles!properties_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone,
          avatar,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new PropertyNotFoundError(`Property with ID ${id} not found`, id);
      }
      throw new InternalServerError(`Database query failed: ${error.message}`, {
        operation: 'fetchPropertyById',
        propertyId: id,
        error: error.message
      });
    }

    if (!data) {
      throw new PropertyNotFoundError(`Property with ID ${id} not found`, id);
    }

    // Transform database result to Property interface
    const transformedProperty = transformDbProperty(data);

    return transformedProperty;
  } catch (error) {
    if (error instanceof PropertyNotFoundError) {
      throw error;
    }

    const appError = ErrorHandler.handle(error, {
      operation: 'fetchPropertyById',
      propertyId: id
    });
    throw appError;
  }
}
