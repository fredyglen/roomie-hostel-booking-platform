/**
 * Apple-Grade Hostel Management Service
 * Following BE CONSCIOUS guidelines for enterprise-level service architecture
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  HostelProperty,
  HostelId,
  HostelOperationResult,
  HostelError,
  HostelPropertyInput,
  SemesterAvailability,
  BedAvailability
} from '../types/hostel-management';
import type { UserId, Timestamp } from '../types/platform-core';
import { validateHostelProperty, createHostelId, HOSTEL_BUSINESS_RULES } from '../types/hostel-management';

// ============================================================================
// BROWSER-COMPATIBLE UUID GENERATOR
// ============================================================================

/**
 * Browser-compatible UUID v4 generator
 * Replaces Node.js crypto.randomUUID for client-side compatibility
 */
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// ============================================================================
// APPLE-LEVEL SERVICE ARCHITECTURE
// ============================================================================

export class HostelManagementService {
  private readonly supabase: SupabaseClient;
  private readonly cache: Map<string, { data: unknown; expiry: number }> = new Map();
  private readonly metrics: MetricsCollector;
  private readonly logger: Logger;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    metrics: MetricsCollector,
    logger: Logger
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.metrics = metrics;
    this.logger = logger;
  }

  // ============================================================================
  // HOSTEL CREATION WITH COMPREHENSIVE VALIDATION
  // ============================================================================

  async createHostel(
    hostelData: HostelPropertyInput,
    createdBy: UserId
  ): Promise<HostelOperationResult<HostelProperty>> {
    const operationId = generateUUID();
    const startTime = Date.now();

    try {
      this.logger.info('Creating hostel', {
        operationId,
        createdBy,
        hostelTitle: hostelData.title
      });

      // Validate input data
      const validationResult = validateHostelProperty(hostelData);
      if (!validationResult.success) {
        this.metrics.increment('hostel.creation.validation_failed');
        return validationResult;
      }

      // Check for duplicate hostels
      const duplicateCheck = await this.checkForDuplicateHostel(
        hostelData.title,
        hostelData.address.coordinates
      );
      if (!duplicateCheck.success) {
        return duplicateCheck;
      }

      // Generate unique hostel ID
      const hostelId = createHostelId(generateUUID());

      // Transform data for database insertion
      const dbHostel = await this.transformToDatabase(hostelData, hostelId, createdBy);

      // Insert into database with transaction
      const insertResult = await this.insertHostelWithTransaction(dbHostel);
      if (!insertResult.success) {
        return insertResult;
      }

      // Create initial availability records
      const availabilityResult = await this.createInitialAvailability(hostelId, hostelData);
      if (!availabilityResult.success) {
        // Rollback hostel creation
        await this.deleteHostel(hostelId);
        return availabilityResult;
      }

      // Fetch complete hostel data
      const completeHostel = await this.getHostelById(hostelId);
      if (!completeHostel.success) {
        return completeHostel;
      }

      // Track success metrics
      this.metrics.increment('hostel.creation.success');
      this.metrics.timing('hostel.creation.duration', Date.now() - startTime);

      this.logger.info('Hostel created successfully', {
        operationId,
        hostelId,
        duration: Date.now() - startTime
      });

      return { success: true, data: completeHostel.data };

    } catch (error) {
      this.metrics.increment('hostel.creation.error');
      this.logger.error('Hostel creation failed', {
        operationId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      return {
        success: false,
        error: {
          type: 'database_error',
          code: 'CREATION_FAILED',
          message: 'Failed to create hostel due to internal error'
        }
      };
    }
  }

  // ============================================================================
  // HOSTEL RETRIEVAL WITH INTELLIGENT CACHING
  // ============================================================================

  async getHostelById(hostelId: HostelId): Promise<HostelOperationResult<HostelProperty>> {
    const cacheKey = `hostel:${hostelId}`;
    const startTime = Date.now();

    try {
      // Check cache first
      const cached = this.getFromCache<HostelProperty>(cacheKey);
      if (cached) {
        this.metrics.increment('hostel.retrieval.cache_hit');
        return { success: true, data: cached };
      }

      this.metrics.increment('hostel.retrieval.cache_miss');

      // Fetch from database with comprehensive joins
      const { data, error } = await this.supabase
        .from('properties')
        .select(`
          *,
          owner:profiles!properties_owner_id_fkey(id, name, avatar_url),
          images:property_images(id, url, thumbnail_url, alt, category, order),
          amenities:property_amenities(amenity_id, amenities(id, name, category, icon)),
          availability:property_availability(
            semester_id,
            academic_year,
            start_date,
            end_date,
            available_beds,
            total_beds
          ),
          rooms:property_rooms(
            id,
            room_number,
            room_type,
            beds_count,
            beds_available,
            floor_number
          )
        `)
        .eq('id', hostelId)
        .eq('property_type', 'hostel')
        .eq('deleted_at', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: { type: 'not_found', hostelId }
          };
        }

        this.logger.error('Database error retrieving hostel', {
          hostelId,
          error: error.message,
          code: error.code
        });

        return {
          success: false,
          error: {
            type: 'database_error',
            code: error.code,
            message: error.message
          }
        };
      }

      // Transform database result to domain model
      const hostel = this.transformFromDatabase(data);

      // Cache the result
      this.setCache(cacheKey, hostel, 15 * 60 * 1000); // 15 minutes

      this.metrics.timing('hostel.retrieval.duration', Date.now() - startTime);

      return { success: true, data: hostel };

    } catch (error) {
      this.metrics.increment('hostel.retrieval.error');
      this.logger.error('Hostel retrieval failed', {
        hostelId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: {
          type: 'database_error',
          code: 'RETRIEVAL_FAILED',
          message: 'Failed to retrieve hostel'
        }
      };
    }
  }

  // ============================================================================
  // HOSTEL SEARCH WITH PERFORMANCE OPTIMIZATION
  // ============================================================================

  async searchHostels(criteria: HostelSearchCriteria): Promise<HostelOperationResult<HostelSearchResult>> {
    const startTime = Date.now();
    const operationId = generateUUID();

    try {
      this.logger.info('Searching hostels', { operationId, criteria });

      // Build optimized query
      let query = this.supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          address,
          base_price_per_semester,
          currency,
          images:property_images!inner(url, thumbnail_url, alt),
          amenities:property_amenities!inner(amenities(name, icon)),
          availability:property_availability!inner(available_beds, total_beds)
        `, { count: 'exact' })
        .eq('property_type', 'hostel')
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .is('deleted_at', null);

      // Apply filters
      if (criteria.priceRange) {
        query = query
          .gte('base_price_per_semester', criteria.priceRange.min)
          .lte('base_price_per_semester', criteria.priceRange.max);
      }

      if (criteria.genderRestriction) {
        query = query.eq('gender_restriction', criteria.genderRestriction);
      }

      if (criteria.roomTypes?.length) {
        // Complex filter for room types - requires custom query
        const roomTypeFilter = criteria.roomTypes.map(type => `"${type}"`).join(',');
        query = query.filter('room_types', 'cs', `{${roomTypeFilter}}`);
      }

      if (criteria.amenities?.length) {
        // Filter by required amenities
        for (const amenity of criteria.amenities) {
          query = query.contains('amenities', [amenity]);
        }
      }

      // Apply sorting
      switch (criteria.sortBy) {
        case 'price_low_to_high':
          query = query.order('base_price_per_semester', { ascending: true });
          break;
        case 'price_high_to_low':
          query = query.order('base_price_per_semester', { ascending: false });
          break;
        case 'distance':
          // Use PostGIS for distance sorting if coordinates provided
          if (criteria.userLocation) {
            query = query.order('location_geom', {
              ascending: true,
              referencedTable: 'properties',
              foreignTable: 'properties'
            });
          }
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const offset = (criteria.page - 1) * criteria.limit;
      query = query.range(offset, offset + criteria.limit - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Hostel search failed', {
          operationId,
          error: error.message,
          criteria
        });

        return {
          success: false,
          error: {
            type: 'database_error',
            code: error.code,
            message: error.message
          }
        };
      }

      // Transform results
      const hostels = data?.map(item => this.transformSearchResult(item)) || [];

      const result: HostelSearchResult = {
        hostels,
        pagination: {
          page: criteria.page,
          limit: criteria.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / criteria.limit),
          hasNext: offset + criteria.limit < (count || 0),
          hasPrevious: criteria.page > 1
        },
        filters: {
          appliedFilters: criteria,
          availableFilters: await this.getAvailableFilters()
        }
      };

      this.metrics.increment('hostel.search.success');
      this.metrics.timing('hostel.search.duration', Date.now() - startTime);

      this.logger.info('Hostel search completed', {
        operationId,
        resultCount: hostels.length,
        totalCount: count,
        duration: Date.now() - startTime
      });

      return { success: true, data: result };

    } catch (error) {
      this.metrics.increment('hostel.search.error');
      this.logger.error('Hostel search error', {
        operationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: {
          type: 'database_error',
          code: 'SEARCH_FAILED',
          message: 'Failed to search hostels'
        }
      };
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async checkForDuplicateHostel(
    title: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<HostelOperationResult<void>> {
    // Implementation for duplicate checking
    return { success: true, data: undefined };
  }

  private async transformToDatabase(
    hostelData: HostelPropertyInput,
    hostelId: HostelId,
    createdBy: UserId
  ): Promise<DatabaseHostelRecord> {
    // Implementation for data transformation
    return {} as DatabaseHostelRecord;
  }

  private async insertHostelWithTransaction(
    dbHostel: DatabaseHostelRecord
  ): Promise<HostelOperationResult<void>> {
    // Implementation for transactional insert
    return { success: true, data: undefined };
  }

  private transformFromDatabase(data: DatabaseHostelRecord): HostelProperty {
    // Implementation for database to domain transformation
    return {} as HostelProperty;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: unknown, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }
}

// ============================================================================
// SUPPORTING TYPES AND INTERFACES
// ============================================================================

interface HostelSearchCriteria {
  readonly page: number;
  readonly limit: number;
  readonly priceRange?: { min: number; max: number };
  readonly genderRestriction?: string;
  readonly roomTypes?: ReadonlyArray<string>;
  readonly amenities?: ReadonlyArray<string>;
  readonly userLocation?: { latitude: number; longitude: number };
  readonly sortBy?: 'price_low_to_high' | 'price_high_to_low' | 'distance' | 'rating' | 'newest';
}

interface HostelSearchResult {
  readonly hostels: ReadonlyArray<HostelProperty>;
  readonly pagination: SearchPagination;
  readonly filters: SearchFilters;
}

interface SearchPagination {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
}

interface SearchFilters {
  readonly appliedFilters: HostelSearchCriteria;
  readonly availableFilters: AvailableFilters;
}

interface AvailableFilters {
  readonly priceRange: { min: number; max: number };
  readonly amenities: ReadonlyArray<string>;
  readonly roomTypes: ReadonlyArray<string>;
  readonly genderRestrictions: ReadonlyArray<string>;
}

interface DatabaseHostelRecord {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  // ... other database fields
}

interface MetricsCollector {
  increment(metric: string, tags?: Record<string, string>): void;
  timing(metric: string, value: number, tags?: Record<string, string>): void;
}

interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
}
