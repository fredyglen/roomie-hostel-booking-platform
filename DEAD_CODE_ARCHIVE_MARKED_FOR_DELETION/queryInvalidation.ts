/**
 * Cross-Portal Query Invalidation Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Ensures real-time data synchronization across all three
 * ROOMi portals (Student/Owner/Admin) when data changes occur
 * 
 * Technical Implementation: Centralized query invalidation with type-safe
 * query keys and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// QUERY KEY CONSTANTS
// ============================================================================

export const QUERY_KEYS = {
  // Student Portal Queries
  STUDENT_MAINTENANCE_REQUESTS: 'maintenance-requests',
  STUDENT_REVIEWS: 'student-reviews',
  STUDENT_BOOKINGS: 'student-bookings',
  STUDENT_ACTIVE_BOOKINGS: 'student-active-bookings',
  STUDENT_MAINTENANCE_STATS: 'student-maintenance-stats',
  
  // Owner Portal Queries
  OWNER_DASHBOARD_STATS: 'owner-dashboard-stats',
  OWNER_MAINTENANCE_REQUESTS: 'owner-maintenance-requests',
  OWNER_RECENT_BOOKINGS: 'owner-recent-bookings',
  OWNER_PROPERTY_PERFORMANCE: 'owner-property-performance',
  OWNER_TRANSACTION_HISTORY: 'owner-transaction-history',
  OWNER_REVIEW_SUMMARY: 'owner-review-summary',
  
  // Property Queries (Cross-Portal)
  PROPERTY_REVIEWS: 'property-reviews',
  PROPERTY_ANALYTICS: 'property-analytics',
  PROPERTIES: 'properties',
  
  // Admin Portal Queries
  ADMIN_PLATFORM_STATS: 'admin-platform-stats',
  ADMIN_ALL_MAINTENANCE: 'admin-all-maintenance',
  ADMIN_ALL_REVIEWS: 'admin-all-reviews',
  
  // Review Eligibility
  REVIEW_ELIGIBILITY: 'review-eligibility',
} as const;

// ============================================================================
// INVALIDATION EVENTS
// ============================================================================

export interface InvalidationEvent {
  readonly event: string;
  readonly studentId?: string;
  readonly ownerId?: string;
  readonly propertyId?: string;
  readonly maintenanceRequestId?: string;
  readonly reviewId?: string;
}

// ============================================================================
// CROSS-PORTAL INVALIDATION SERVICE
// ============================================================================

export class CrossPortalInvalidationService {
  
  // --------------------------------------------------------------------------
  // MAINTENANCE REQUEST INVALIDATIONS
  // --------------------------------------------------------------------------
  
  static async invalidateMaintenanceRequestCreated(
    queryClient: QueryClient,
    event: InvalidationEvent
  ): Promise<void> {
    try {
      logger.info('Invalidating queries for maintenance request created', event);

      const invalidations: Promise<void>[] = [];

      // Student Portal: Refresh student's maintenance requests and stats
      if (event.studentId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_REQUESTS, event.studentId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_STATS, event.studentId] 
          })
        );
      }

      // Owner Portal: Refresh owner's maintenance requests and dashboard stats
      if (event.ownerId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_MAINTENANCE_REQUESTS, event.ownerId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_DASHBOARD_STATS, event.ownerId] 
          })
        );
      }

      // Property-specific invalidations
      if (event.propertyId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.PROPERTY_ANALYTICS, event.propertyId] 
          })
        );
      }

      // Admin Portal: Refresh platform-wide maintenance data
      invalidations.push(
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_ALL_MAINTENANCE] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_PLATFORM_STATS] 
        })
      );

      await Promise.all(invalidations);
      logger.info('Successfully invalidated maintenance request queries');

    } catch (error) {
      logger.error('Failed to invalidate maintenance request queries', { error, event });
    }
  }

  // --------------------------------------------------------------------------
  // PROPERTY REVIEW INVALIDATIONS
  // --------------------------------------------------------------------------
  
  static async invalidatePropertyReviewCreated(
    queryClient: QueryClient,
    event: InvalidationEvent
  ): Promise<void> {
    try {
      logger.info('Invalidating queries for property review created', event);

      const invalidations: Promise<void>[] = [];

      // Student Portal: Refresh student's reviews
      if (event.studentId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_REVIEWS, event.studentId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.REVIEW_ELIGIBILITY, event.studentId, event.propertyId] 
          })
        );
      }

      // Owner Portal: Refresh owner's dashboard stats and review summary
      if (event.ownerId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_DASHBOARD_STATS, event.ownerId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_REVIEW_SUMMARY, event.ownerId] 
          })
        );
      }

      // Property-specific invalidations
      if (event.propertyId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.PROPERTY_REVIEWS, event.propertyId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.PROPERTY_ANALYTICS, event.propertyId] 
          })
        );
      }

      // Admin Portal: Refresh platform-wide review data
      invalidations.push(
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_ALL_REVIEWS] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_PLATFORM_STATS] 
        })
      );

      await Promise.all(invalidations);
      logger.info('Successfully invalidated property review queries');

    } catch (error) {
      logger.error('Failed to invalidate property review queries', { error, event });
    }
  }

  // --------------------------------------------------------------------------
  // MAINTENANCE REQUEST STATUS UPDATE INVALIDATIONS
  // --------------------------------------------------------------------------
  
  static async invalidateMaintenanceRequestUpdated(
    queryClient: QueryClient,
    event: InvalidationEvent
  ): Promise<void> {
    try {
      logger.info('Invalidating queries for maintenance request updated', event);

      const invalidations: Promise<void>[] = [];

      // Student Portal: Refresh student's maintenance requests and stats
      if (event.studentId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_REQUESTS, event.studentId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_STATS, event.studentId] 
          })
        );
      }

      // Owner Portal: Refresh owner's maintenance requests and dashboard stats
      if (event.ownerId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_MAINTENANCE_REQUESTS, event.ownerId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_DASHBOARD_STATS, event.ownerId] 
          })
        );
      }

      // Admin Portal: Refresh platform-wide maintenance data
      invalidations.push(
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_ALL_MAINTENANCE] 
        })
      );

      await Promise.all(invalidations);
      logger.info('Successfully invalidated maintenance request update queries');

    } catch (error) {
      logger.error('Failed to invalidate maintenance request update queries', { error, event });
    }
  }

  // --------------------------------------------------------------------------
  // BOOKING INVALIDATIONS
  // --------------------------------------------------------------------------
  
  static async invalidateBookingCreated(
    queryClient: QueryClient,
    event: InvalidationEvent
  ): Promise<void> {
    try {
      logger.info('Invalidating queries for booking created', event);

      const invalidations: Promise<void>[] = [];

      // Student Portal: Refresh student's bookings and active bookings
      if (event.studentId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_BOOKINGS, event.studentId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.STUDENT_ACTIVE_BOOKINGS, event.studentId] 
          })
        );
      }

      // Owner Portal: Refresh owner's dashboard stats and recent bookings
      if (event.ownerId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_DASHBOARD_STATS, event.ownerId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_RECENT_BOOKINGS, event.ownerId] 
          }),
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.OWNER_PROPERTY_PERFORMANCE, event.ownerId] 
          })
        );
      }

      // Property-specific invalidations
      if (event.propertyId) {
        invalidations.push(
          queryClient.invalidateQueries({ 
            queryKey: [QUERY_KEYS.PROPERTIES] 
          })
        );
      }

      // Admin Portal: Refresh platform-wide booking data
      invalidations.push(
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.ADMIN_PLATFORM_STATS] 
        })
      );

      await Promise.all(invalidations);
      logger.info('Successfully invalidated booking queries');

    } catch (error) {
      logger.error('Failed to invalidate booking queries', { error, event });
    }
  }

  // --------------------------------------------------------------------------
  // UTILITY METHODS
  // --------------------------------------------------------------------------
  
  static async invalidateOwnerDashboard(
    queryClient: QueryClient,
    ownerId: string
  ): Promise<void> {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.OWNER_DASHBOARD_STATS, ownerId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.OWNER_MAINTENANCE_REQUESTS, ownerId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.OWNER_RECENT_BOOKINGS, ownerId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.OWNER_PROPERTY_PERFORMANCE, ownerId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.OWNER_REVIEW_SUMMARY, ownerId] 
        })
      ]);
      
      logger.info('Successfully invalidated owner dashboard queries', { ownerId });
    } catch (error) {
      logger.error('Failed to invalidate owner dashboard queries', { error, ownerId });
    }
  }

  static async invalidateStudentDashboard(
    queryClient: QueryClient,
    studentId: string
  ): Promise<void> {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_REQUESTS, studentId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.STUDENT_REVIEWS, studentId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.STUDENT_BOOKINGS, studentId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.STUDENT_ACTIVE_BOOKINGS, studentId] 
        }),
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.STUDENT_MAINTENANCE_STATS, studentId] 
        })
      ]);
      
      logger.info('Successfully invalidated student dashboard queries', { studentId });
    } catch (error) {
      logger.error('Failed to invalidate student dashboard queries', { error, studentId });
    }
  }
}

export default CrossPortalInvalidationService;
