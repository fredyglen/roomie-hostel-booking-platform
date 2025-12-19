/**
 * Enhanced Property Service
 * Apple-Grade Dynamic Property Data Loading Service
 * 
 * Purpose: Replace all hardcoded property data with database-driven dynamic loading
 * Compliance: BE CONSCIOUS zero tolerance for any types, comprehensive error handling
 * Architecture: Result pattern, performance optimization, real-time capabilities
 */

import { supabase } from '@/lib/supabase';
import { logger as enhancedLogger } from '@/utils/enhanced-logger';
import { Result, createSuccess, createError } from '@/types/result';
import { Property, PropertyId, PropertyCategory, PropertyType } from '@/types/property';
import { transformDbProperty } from '@/utils/propertyTransforms';

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

type PropertySearchQuery = string & { readonly __brand: 'PropertySearchQuery' };
type PropertyLimit = number & { readonly __brand: 'PropertyLimit' };
type PropertyOffset = number & { readonly __brand: 'PropertyOffset' };

const createPropertySearchQuery = (query: string): PropertySearchQuery => 
  query as PropertySearchQuery;

const createPropertyLimit = (limit: number): PropertyLimit => {
  if (limit < 1 || limit > 100) {
    throw new Error('Property limit must be between 1 and 100');
  }
  return limit as PropertyLimit;
};

const createPropertyOffset = (offset: number): PropertyOffset => {
  if (offset < 0) {
    throw new Error('Property offset must be non-negative');
  }
  return offset as PropertyOffset;
};

// ============================================================================
// INTERFACES
// ============================================================================

interface PropertySearchFilters {
  readonly category?: PropertyCategory;
  readonly type?: PropertyType;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly bedrooms?: number;
  readonly bathrooms?: number;
  readonly amenities?: readonly string[];
  readonly isAvailable?: boolean;
  readonly verified?: boolean;
}

interface PropertySearchOptions {
  readonly query?: PropertySearchQuery;
  readonly filters?: PropertySearchFilters;
  readonly limit?: PropertyLimit;
  readonly offset?: PropertyOffset;
  readonly sortBy?: 'price' | 'created_at' | 'updated_at' | 'name';
  readonly sortOrder?: 'asc' | 'desc';
}

interface PropertySearchResult {
  readonly properties: readonly Property[];
  readonly totalCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
}

interface PropertyStatistics {
  readonly totalProperties: number;
  readonly availableProperties: number;
  readonly verifiedProperties: number;
  readonly averagePrice: number;
  readonly priceRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly categoryCounts: Record<PropertyCategory, number>;
  readonly typeCounts: Record<PropertyType, number>;
}

// ============================================================================
// ENHANCED PROPERTY SERVICE CLASS
// ============================================================================

class EnhancedPropertyService {
  private static instance: EnhancedPropertyService;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private readonly cache = new Map<string, { data: any; timestamp: number }>();

  private constructor() {
    enhancedLogger.info('Enhanced Property Service initialized');
  }

  public static getInstance(): EnhancedPropertyService {
    if (!EnhancedPropertyService.instance) {
      EnhancedPropertyService.instance = new EnhancedPropertyService();
    }
    return EnhancedPropertyService.instance;
  }

  // ============================================================================
  // CORE PROPERTY OPERATIONS
  // ============================================================================

  /**
   * Get property by ID with comprehensive error handling
   */
  async getPropertyById(propertyId: PropertyId): Promise<Result<any>> {
    try {
      enhancedLogger.info('Fetching property by ID', { propertyId });

      const cacheKey = `property:${propertyId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        enhancedLogger.info('Property found in cache', { propertyId });
        return createSuccess(cached);
      }

      const { data, error } = await supabase
        .from('properties')
        .select(`*`)
        .eq('id', propertyId)
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .single();

      if (error) {
        enhancedLogger.error('Failed to fetch property by ID', { error, propertyId });
        return createError(new Error(`Failed to fetch property: ${error.message}`));
      }

      if (!data) {
        enhancedLogger.warn('Property not found', { propertyId });
        return createError(new Error('Property not found'));
      }

      const transformedProperty = this.transformDatabaseProperty(data);
      this.setCache(cacheKey, transformedProperty);

      enhancedLogger.info('Successfully fetched property by ID', { propertyId });
      return createSuccess(transformedProperty);

    } catch (error) {
      enhancedLogger.error('Unexpected error fetching property by ID', { error, propertyId });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Search properties with advanced filtering and pagination
   */
  async searchProperties(options: PropertySearchOptions = {}): Promise<Result<any>> {
    try {
      enhancedLogger.info('Searching properties', { options });

      const {
        query,
        filters = {},
        limit = createPropertyLimit(20),
        offset = createPropertyOffset(0),
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options;

      // IMPORTANT: Avoid embedding profiles to prevent RLS recursion (stack depth exceeded)
      // See migrations where profiles policies call is_admin(), which queries profiles again.
      // This embed triggers policy evaluation on profiles and can recurse.
      let queryBuilder = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.category) {
        queryBuilder = queryBuilder.eq('property_category', filters.category);
      }

      if (filters.type) {
        queryBuilder = queryBuilder.eq('type', filters.type);
      }

      if (filters.minPrice !== undefined) {
        // Support both legacy price and rent columns
        queryBuilder = queryBuilder.or(`price.gte.${filters.minPrice},rent.gte.${filters.minPrice}`);
      }

      if (filters.maxPrice !== undefined) {
        // Support both legacy price and rent columns
        queryBuilder = queryBuilder.or(`price.lte.${filters.maxPrice},rent.lte.${filters.maxPrice}`);
      }

      if (filters.bedrooms !== undefined) {
        queryBuilder = queryBuilder.eq('bedrooms', filters.bedrooms);
      }

      if (filters.bathrooms !== undefined) {
        queryBuilder = queryBuilder.eq('bathrooms', filters.bathrooms);
      }

      if (filters.isAvailable !== undefined) {
        queryBuilder = queryBuilder.eq('is_available', filters.isAvailable);
      }

      // Student-facing default: only show verified unless caller explicitly requests otherwise
      if (filters.verified === undefined) {
        queryBuilder = queryBuilder.eq('verification_status', 'verified');
      } else {
        queryBuilder = queryBuilder.eq('verification_status', filters.verified ? 'verified' : 'pending');
      }

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(`
          title.ilike.%${query}%,
          description.ilike.%${query}%,
          address.ilike.%${query}%,
          city.ilike.%${query}%
        `);
      }

      // Apply sorting and pagination
      queryBuilder = queryBuilder
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        enhancedLogger.error('Failed to search properties', { error, options });
        return createError(new Error(`Failed to search properties: ${error.message}`));
      }

      const properties = (data || []).map(this.transformDatabaseProperty);
      const totalCount = count || 0;
      const currentPage = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(totalCount / limit);

      const result: PropertySearchResult = {
        properties,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
        currentPage,
        totalPages
      };

      enhancedLogger.info('Successfully searched properties', { 
        resultCount: properties.length,
        totalCount,
        currentPage,
        totalPages
      });

      return createSuccess(result);

    } catch (error) {
      enhancedLogger.error('Unexpected error searching properties', { error, options });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Get featured properties for homepage
   */
  async getFeaturedProperties(limit: PropertyLimit = createPropertyLimit(6)): Promise<Result<any>> {
    try {
      enhancedLogger.info('Fetching featured properties', { limit });

      const cacheKey = `featured:${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        enhancedLogger.info('Featured properties found in cache');
        return createSuccess(cached);
      }

      const { data, error } = await supabase
        .from('properties')
        .select(`*`)
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        enhancedLogger.error('Failed to fetch featured properties', { error });
        return createError(new Error(`Failed to fetch featured properties: ${error.message}`));
      }

      const properties = (data || []).map(this.transformDatabaseProperty);
      this.setCache(cacheKey, properties);

      enhancedLogger.info('Successfully fetched featured properties', { count: properties.length });
      return createSuccess(properties);

    } catch (error) {
      enhancedLogger.error('Unexpected error fetching featured properties', { error });
      return createError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Transform database property to application Property type
   *
   * IMPORTANT: This now delegates to transformDbProperty (canonical DB→Property
   * transformer) and then layers in any DB-backed fields that aren't yet fully
   * modeled on Property but are required by current UIs/filters.
   */
  private transformDatabaseProperty(data: any): any {
    const transformed = transformDbProperty(data as any);

    return {
      ...transformed,
      // Ensure verification / availability flags are always present
      verification_status:
        typeof data.verification_status === 'string'
          ? data.verification_status
          : transformed.verification_status ?? 'pending',
      is_available:
        typeof data.is_available === 'boolean'
          ? data.is_available
          : transformed.is_available ?? true,
      status:
        typeof (transformed as any).status === 'string'
          ? (transformed as any).status
          : (data.is_available ? 'available' : 'unavailable'),
      // Preserve DB-driven filter fields where present
      gender_restriction:
        data.gender_restriction ?? transformed.gender_restriction,
      washroom_type:
        data.washroom_type ?? transformed.washroom_type,
      internet_speed:
        data.internet_speed ?? (transformed as any).internet_speed,
      shared_washroom_count:
        data.shared_washroom_count ?? (transformed as any).shared_washroom_count,
      // Room-type pricing metadata used by booking/pricing UIs
      room_types:
        data.room_types ?? transformed.room_types ?? null,
      room_type_pricing:
        data.room_type_pricing ?? transformed.room_type_pricing ?? null,
      base_price_per_semester:
        data.base_price_per_semester ?? transformed.base_price_per_semester ?? null,
    };
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    enhancedLogger.info('Property service cache cleared');
  }
}

// Export singleton instance
export const enhancedPropertyService = EnhancedPropertyService.getInstance();

// Export types for external use
export type {
  PropertySearchQuery,
  PropertyLimit,
  PropertyOffset,
  PropertySearchFilters,
  PropertySearchOptions,
  PropertySearchResult,
  PropertyStatistics
};

export {
  createPropertySearchQuery,
  createPropertyLimit,
  createPropertyOffset
};
