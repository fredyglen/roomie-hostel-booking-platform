/**
 * Data Filter Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides jurisdiction-aware data filtering for admin users
 * ensuring Campus Admins only see data from their assigned universities while
 * Supreme Admins have global access to all data
 * 
 * Technical Implementation: Implements database query filtering based on user
 * jurisdiction assignments with comprehensive error handling and audit logging
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  AdminRoleType, 
  CampusJurisdiction, 
  CountryJurisdiction,
  AuthResult
} from '@/types/auth';
import { 
  GhanaUniversityCode, 
  GhanaRegionCode,
  getRegionByUniversity,
  getUniversitiesByRegion
} from '@/config/ghana-jurisdiction.config';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface DataFilterContext {
  readonly userRole: AdminRoleType;
  readonly userJurisdictions: {
    readonly campuses?: readonly CampusJurisdiction[];
    readonly countries?: readonly CountryJurisdiction[];
  };
}

export interface FilterOptions {
  readonly includeInactive?: boolean;
  readonly dateRange?: {
    readonly start: Date;
    readonly end: Date;
  };
  readonly additionalFilters?: Record<string, any>;
}

export interface FilteredQuery {
  readonly query: any; // Supabase query object
  readonly appliedFilters: readonly string[];
  readonly accessibleUniversities: readonly GhanaUniversityCode[];
}

// ============================================================================
// DATA FILTER SERVICE CLASS
// ============================================================================

/**
 * Data Filter Service - Apple-Grade Implementation
 * 
 * Provides jurisdiction-aware data filtering with:
 * - Role-based data access control
 * - University-level filtering for campus admins
 * - Regional and country-level aggregation
 * - Comprehensive audit logging
 */
class DataFilterService {
  
  /**
   * Apply jurisdiction filters to properties query
   */
  public filterProperties(
    context: DataFilterContext,
    options: FilterOptions = {}
  ): AuthResult<FilteredQuery> {
    try {
      let query = supabase
        .from('properties')
        .select('*');
      
      const appliedFilters: string[] = [];
      let accessibleUniversities: GhanaUniversityCode[] = [];
      
      // Apply role-based filtering
      if (context.userRole === 'supreme_admin') {
        // Supreme admin sees all properties
        accessibleUniversities = Object.keys(GHANA_UNIVERSITIES) as GhanaUniversityCode[];
        appliedFilters.push('global_access');
      } else if (context.userRole === 'campus_admin') {
        // Campus admin sees only properties from assigned universities
        const assignedUniversities = (context.userJurisdictions.campuses || []) as GhanaUniversityCode[];
        
        if (assignedUniversities.length === 0) {
          // No jurisdiction assigned - no access
          query = query.eq('id', 'no-access'); // This will return no results
          appliedFilters.push('no_jurisdiction');
        } else {
          // Filter by assigned universities
          const universityNames = assignedUniversities.map(code => 
            GHANA_UNIVERSITIES[code]?.name
          ).filter(Boolean);
          
          if (universityNames.length > 0) {
            query = query.in('campus_name', universityNames);
            appliedFilters.push(`campus_filter:${universityNames.join(',')}`);
          }
          
          accessibleUniversities = assignedUniversities;
        }
      }
      
      // Apply additional filters
      if (!options.includeInactive) {
        query = query.eq('is_active', true);
        appliedFilters.push('active_only');
      }
      
      if (options.dateRange) {
        query = query
          .gte('created_at', options.dateRange.start.toISOString())
          .lte('created_at', options.dateRange.end.toISOString());
        appliedFilters.push('date_range');
      }
      
      // Apply any additional custom filters
      if (options.additionalFilters) {
        Object.entries(options.additionalFilters).forEach(([key, value]) => {
          query = query.eq(key, value);
          appliedFilters.push(`custom:${key}=${value}`);
        });
      }
      
      logger.debug('Applied property filters', {
        userRole: context.userRole,
        appliedFilters,
        accessibleUniversities: accessibleUniversities.length
      });
      
      return {
        success: true,
        data: {
          query,
          appliedFilters,
          accessibleUniversities
        }
      };
      
    } catch (error) {
      logger.error('Error filtering properties', { context, options, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to apply property filters',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Apply jurisdiction filters to bookings query
   */
  public filterBookings(
    context: DataFilterContext,
    options: FilterOptions = {}
  ): AuthResult<FilteredQuery> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            name,
            campus_name,
            city,
            state
          ),
          profiles (
            id,
            first_name,
            last_name,
            email
          )
        `);
      
      const appliedFilters: string[] = [];
      let accessibleUniversities: GhanaUniversityCode[] = [];
      
      // Apply role-based filtering
      if (context.userRole === 'supreme_admin') {
        // Supreme admin sees all bookings
        accessibleUniversities = Object.keys(GHANA_UNIVERSITIES) as GhanaUniversityCode[];
        appliedFilters.push('global_access');
      } else if (context.userRole === 'campus_admin') {
        // Campus admin sees only bookings for properties from assigned universities
        const assignedUniversities = (context.userJurisdictions.campuses || []) as GhanaUniversityCode[];
        
        if (assignedUniversities.length === 0) {
          // No jurisdiction assigned - no access
          query = query.eq('id', 'no-access');
          appliedFilters.push('no_jurisdiction');
        } else {
          // Filter by properties from assigned universities
          const universityNames = assignedUniversities.map(code => 
            GHANA_UNIVERSITIES[code]?.name
          ).filter(Boolean);
          
          if (universityNames.length > 0) {
            query = query.in('properties.campus_name', universityNames);
            appliedFilters.push(`campus_filter:${universityNames.join(',')}`);
          }
          
          accessibleUniversities = assignedUniversities;
        }
      }
      
      // Apply additional filters
      if (options.dateRange) {
        query = query
          .gte('created_at', options.dateRange.start.toISOString())
          .lte('created_at', options.dateRange.end.toISOString());
        appliedFilters.push('date_range');
      }
      
      // Apply custom filters
      if (options.additionalFilters) {
        Object.entries(options.additionalFilters).forEach(([key, value]) => {
          query = query.eq(key, value);
          appliedFilters.push(`custom:${key}=${value}`);
        });
      }
      
      logger.debug('Applied booking filters', {
        userRole: context.userRole,
        appliedFilters,
        accessibleUniversities: accessibleUniversities.length
      });
      
      return {
        success: true,
        data: {
          query,
          appliedFilters,
          accessibleUniversities
        }
      };
      
    } catch (error) {
      logger.error('Error filtering bookings', { context, options, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to apply booking filters',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Apply jurisdiction filters to users query
   */
  public filterUsers(
    context: DataFilterContext,
    options: FilterOptions = {}
  ): AuthResult<FilteredQuery> {
    try {
      let query = supabase
        .from('profiles')
        .select('*');
      
      const appliedFilters: string[] = [];
      let accessibleUniversities: GhanaUniversityCode[] = [];
      
      // Apply role-based filtering
      if (context.userRole === 'supreme_admin') {
        // Supreme admin sees all users
        accessibleUniversities = Object.keys(GHANA_UNIVERSITIES) as GhanaUniversityCode[];
        appliedFilters.push('global_access');
      } else if (context.userRole === 'campus_admin') {
        // Campus admin sees only users from assigned universities
        const assignedUniversities = (context.userJurisdictions.campuses || []) as GhanaUniversityCode[];
        
        if (assignedUniversities.length === 0) {
          // No jurisdiction assigned - no access
          query = query.eq('id', 'no-access');
          appliedFilters.push('no_jurisdiction');
        } else {
          // Filter by university assignments (would need university field in profiles)
          const universityNames = assignedUniversities.map(code => 
            GHANA_UNIVERSITIES[code]?.name
          ).filter(Boolean);
          
          if (universityNames.length > 0) {
            query = query.in('university', universityNames);
            appliedFilters.push(`campus_filter:${universityNames.join(',')}`);
          }
          
          accessibleUniversities = assignedUniversities;
        }
      }
      
      // Apply additional filters
      if (!options.includeInactive) {
        query = query.neq('role', 'inactive');
        appliedFilters.push('active_only');
      }
      
      if (options.additionalFilters) {
        Object.entries(options.additionalFilters).forEach(([key, value]) => {
          query = query.eq(key, value);
          appliedFilters.push(`custom:${key}=${value}`);
        });
      }
      
      logger.debug('Applied user filters', {
        userRole: context.userRole,
        appliedFilters,
        accessibleUniversities: accessibleUniversities.length
      });
      
      return {
        success: true,
        data: {
          query,
          appliedFilters,
          accessibleUniversities
        }
      };
      
    } catch (error) {
      logger.error('Error filtering users', { context, options, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to apply user filters',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Get analytics data with jurisdiction filtering
   */
  public async getFilteredAnalytics(
    context: DataFilterContext,
    analyticsType: 'properties' | 'bookings' | 'users' | 'revenue',
    options: FilterOptions = {}
  ): Promise<AuthResult<any>> {
    try {
      let query;
      let appliedFilters: string[] = [];
      
      // Apply appropriate filtering based on analytics type
      switch (analyticsType) {
        case 'properties':
          const propertyResult = this.filterProperties(context, options);
          if (!propertyResult.success) return propertyResult;
          query = propertyResult.data.query;
          appliedFilters = [...propertyResult.data.appliedFilters];
          break;
          
        case 'bookings':
          const bookingResult = this.filterBookings(context, options);
          if (!bookingResult.success) return bookingResult;
          query = bookingResult.data.query;
          appliedFilters = [...bookingResult.data.appliedFilters];
          break;
          
        case 'users':
          const userResult = this.filterUsers(context, options);
          if (!userResult.success) return userResult;
          query = userResult.data.query;
          appliedFilters = [...userResult.data.appliedFilters];
          break;
          
        case 'revenue':
          // Revenue analytics would combine booking and property data
          const revenueResult = this.filterBookings(context, options);
          if (!revenueResult.success) return revenueResult;
          query = revenueResult.data.query;
          appliedFilters = [...revenueResult.data.appliedFilters, 'revenue_calculation'];
          break;
          
        default:
          return {
            success: false,
            error: {
              type: 'validation',
              message: `Invalid analytics type: ${analyticsType}`,
              timestamp: new Date()
            }
          };
      }
      
      // Execute the filtered query
      const { data, error } = await query;
      
      if (error) {
        logger.error('Error executing filtered analytics query', { 
          analyticsType, 
          context, 
          error 
        });
        return {
          success: false,
          error: {
            type: 'database',
            message: 'Failed to fetch analytics data',
            details: error,
            timestamp: new Date()
          }
        };
      }
      
      logger.info('Filtered analytics data retrieved', {
        analyticsType,
        userRole: context.userRole,
        recordCount: data?.length || 0,
        appliedFilters
      });
      
      return {
        success: true,
        data: {
          records: data,
          appliedFilters,
          metadata: {
            recordCount: data?.length || 0,
            analyticsType,
            userRole: context.userRole,
            timestamp: new Date()
          }
        }
      };
      
    } catch (error) {
      logger.error('Error getting filtered analytics', { 
        analyticsType, 
        context, 
        options, 
        error 
      });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to get filtered analytics',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Get accessible universities for current user
   */
  public getAccessibleUniversities(context: DataFilterContext): GhanaUniversityCode[] {
    if (context.userRole === 'supreme_admin') {
      return Object.keys(GHANA_UNIVERSITIES) as GhanaUniversityCode[];
    }
    
    if (context.userRole === 'campus_admin') {
      return (context.userJurisdictions.campuses || []) as GhanaUniversityCode[];
    }
    
    return [];
  }
  
  /**
   * Check if user can access specific university data
   */
  public canAccessUniversity(
    context: DataFilterContext,
    university: GhanaUniversityCode
  ): boolean {
    const accessibleUniversities = this.getAccessibleUniversities(context);
    return accessibleUniversities.includes(university);
  }
}

// ============================================================================
// SERVICE INSTANCE
// ============================================================================

export const dataFilterService = new DataFilterService();
export default dataFilterService;
