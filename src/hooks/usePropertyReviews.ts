/**
 * React Query hooks for property reviews functionality
 * Wraps PropertyReviewService with React Query for caching, optimistic updates, and real-time sync
 * 
 * Phase 5 of REVISED_FIX_PLAN_2025-11-05.md
 * Created: 2025-11-05
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyReviewService } from '@/services/reviewService';
import { useAuth } from '@/context/EnhancedAuthContext';
import { logger } from '@/utils/enhanced-logger';
import { toast } from '@/components/ui/use-toast';
import type {
  PropertyReviewInsert,
  BookingEligibility,
  ReviewAnalytics
} from '@/types/reviews';

/**
 * Query key factory for reviews
 */
const reviewsKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsKeys.all, 'list'] as const,
  list: (propertyId: string) => [...reviewsKeys.lists(), propertyId] as const,
  detail: (reviewId: string) => [...reviewsKeys.all, 'detail', reviewId] as const,
  eligibility: (studentId: string, propertyId: string) => [...reviewsKeys.all, 'eligibility', studentId, propertyId] as const,
  analytics: (propertyId: string) => [...reviewsKeys.all, 'analytics', propertyId] as const,
  studentReviews: (studentId: string) => [...reviewsKeys.all, 'student', studentId] as const,
};

/**
 * Hook to get all reviews for a property
 */
export const usePropertyReviews = (propertyId: string) => {
  return useQuery({
    queryKey: reviewsKeys.list(propertyId),
    queryFn: async () => {
      const result = await PropertyReviewService.getPropertyReviews(propertyId);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch reviews');
      }
      return result.data;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to check if student can review a property
 */
export const useCheckReviewEligibility = (propertyId: string, studentId?: string) => {
  return useQuery({
    queryKey: reviewsKeys.eligibility(studentId || '', propertyId),
    queryFn: async (): Promise<BookingEligibility> => {
      if (!studentId) {
        return {
          canReview: false,
          hasCompletedBooking: false,
          hasExistingReview: false,
          reason: 'You must be logged in to review properties'
        };
      }
      return await PropertyReviewService.checkBookingEligibility(studentId, propertyId);
    },
    enabled: !!propertyId && !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get review analytics for a property
 */
export const useReviewAnalytics = (propertyId: string) => {
  return useQuery({
    queryKey: reviewsKeys.analytics(propertyId),
    queryFn: async (): Promise<ReviewAnalytics | null> => {
      const result = await PropertyReviewService.getReviewAnalytics(propertyId);
      return result; // Service returns ReviewAnalytics | null directly
    },
    enabled: !!propertyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to get all reviews by a student
 */
export const useStudentReviews = (studentId?: string) => {
  return useQuery({
    queryKey: reviewsKeys.studentReviews(studentId || ''),
    queryFn: async () => {
      if (!studentId) {
        return [];
      }
      const result = await PropertyReviewService.getStudentReviews(studentId);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch student reviews');
      }
      return result.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to submit a new review
 * Includes automatic property rating update
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (reviewData: Omit<PropertyReviewInsert, 'student_id'>) => {
      if (!user?.id) {
        throw new Error('You must be logged in to submit a review');
      }

      const fullReviewData: PropertyReviewInsert = {
        ...reviewData,
        student_id: user.id,
      };

      const result = await PropertyReviewService.createPropertyReview(fullReviewData);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to submit review');
      }

      return result.data;
    },
    onSuccess: (newReview, variables) => {
      const propertyId = variables.property_id;

      // Invalidate property reviews list
      queryClient.invalidateQueries({ queryKey: reviewsKeys.list(propertyId) });
      
      // Invalidate review analytics
      queryClient.invalidateQueries({ queryKey: reviewsKeys.analytics(propertyId) });
      
      // Invalidate eligibility check
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: reviewsKeys.eligibility(user.id, propertyId) });
      }

      // Invalidate student reviews
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: reviewsKeys.studentReviews(user.id) });
      }

      toast({
        title: 'Review submitted successfully',
        description: 'Thank you for sharing your experience!',
      });

      logger.info('Review submitted successfully', {
        reviewId: newReview.id,
        propertyId,
        studentId: user?.id
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to submit review',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });

      logger.error('Failed to submit review', { error: error.message });
    },
  });
};

// TODO: Implement these hooks when PropertyReviewService adds update/delete/helpful methods
// For now, PropertyReviewService only supports:
// - createPropertyReview
// - getPropertyReviews
// - getStudentReviews
// - getReviewAnalytics
// - checkBookingEligibility
// - getOwnerReviewSummary
