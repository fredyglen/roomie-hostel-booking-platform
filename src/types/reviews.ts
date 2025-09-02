/**
 * Property Review Types
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Type-safe property review system for student feedback
 * with booking verification, detailed ratings, and owner analytics integration
 * 
 * Technical Implementation: Branded types for compile-time safety, comprehensive
 * validation, and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

// ============================================================================
// BRANDED TYPES FOR COMPILE-TIME SAFETY
// ============================================================================

export type PropertyReviewId = string & { readonly __brand: 'PropertyReviewId' };
export type ReviewRating = 1 | 2 | 3 | 4 | 5;
export type ReviewStatus = 'draft' | 'published' | 'hidden' | 'flagged';

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface PropertyReview {
  readonly id: PropertyReviewId;
  readonly student_id: string;
  readonly property_id: string;
  readonly booking_id: string | null;
  readonly rating: ReviewRating;
  readonly title: string | null;
  readonly review_text: string | null;
  readonly cleanliness_rating: ReviewRating | null;
  readonly location_rating: ReviewRating | null;
  readonly value_rating: ReviewRating | null;
  readonly communication_rating: ReviewRating | null;
  readonly amenities_rating: ReviewRating | null;
  readonly images: readonly string[];
  readonly is_verified: boolean;
  readonly is_anonymous: boolean;
  readonly helpful_count: number;
  readonly reported_count: number;
  readonly status: ReviewStatus;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface PropertyReviewInsert {
  readonly student_id: string;
  readonly property_id: string;
  readonly booking_id?: string;
  readonly rating: ReviewRating;
  readonly title?: string;
  readonly review_text?: string;
  readonly cleanliness_rating?: ReviewRating;
  readonly location_rating?: ReviewRating;
  readonly value_rating?: ReviewRating;
  readonly communication_rating?: ReviewRating;
  readonly amenities_rating?: ReviewRating;
  readonly images?: readonly string[];
  readonly is_anonymous?: boolean;
}

export interface PropertyReviewUpdate {
  readonly rating?: ReviewRating;
  readonly title?: string;
  readonly review_text?: string;
  readonly cleanliness_rating?: ReviewRating;
  readonly location_rating?: ReviewRating;
  readonly value_rating?: ReviewRating;
  readonly communication_rating?: ReviewRating;
  readonly amenities_rating?: ReviewRating;
  readonly images?: readonly string[];
  readonly is_anonymous?: boolean;
  readonly status?: ReviewStatus;
}

// ============================================================================
// FORM INTERFACES
// ============================================================================

export interface PropertyReviewFormData {
  readonly rating: ReviewRating;
  readonly title: string;
  readonly review_text: string;
  readonly cleanliness_rating: ReviewRating;
  readonly location_rating: ReviewRating;
  readonly value_rating: ReviewRating;
  readonly communication_rating: ReviewRating;
  readonly amenities_rating: ReviewRating;
  readonly images: readonly File[];
  readonly is_anonymous: boolean;
}

export interface PropertyReviewFormErrors {
  readonly rating?: string;
  readonly title?: string;
  readonly review_text?: string;
  readonly cleanliness_rating?: string;
  readonly location_rating?: string;
  readonly value_rating?: string;
  readonly communication_rating?: string;
  readonly amenities_rating?: string;
  readonly images?: string;
  readonly general?: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface PropertyReviewResponse {
  readonly success: boolean;
  readonly data?: PropertyReview;
  readonly error?: string;
}

export interface PropertyReviewListResponse {
  readonly success: boolean;
  readonly data?: readonly PropertyReview[];
  readonly error?: string;
  readonly pagination?: {
    readonly total: number;
    readonly page: number;
    readonly limit: number;
    readonly hasMore: boolean;
  };
}

// ============================================================================
// ANALYTICS INTERFACES
// ============================================================================

export interface ReviewAnalytics {
  readonly total_reviews: number;
  readonly average_rating: number;
  readonly rating_distribution: Record<ReviewRating, number>;
  readonly category_averages: {
    readonly cleanliness: number;
    readonly location: number;
    readonly value: number;
    readonly communication: number;
    readonly amenities: number;
  };
  readonly verified_reviews_count: number;
  readonly recent_reviews_count: number; // Last 30 days
}

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

export interface PropertyReviewValidation {
  readonly isValid: boolean;
  readonly errors: PropertyReviewFormErrors;
  readonly canReview: boolean;
  readonly reason?: string;
}

export interface BookingEligibility {
  readonly canReview: boolean;
  readonly hasCompletedBooking: boolean;
  readonly hasExistingReview: boolean;
  readonly bookingEndDate?: string;
  readonly reason?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PropertyReviewWithProperty = PropertyReview & {
  readonly property: {
    readonly id: string;
    readonly title: string;
    readonly address: string;
    readonly owner_id: string;
  };
};

export type PropertyReviewWithStudent = PropertyReview & {
  readonly student: {
    readonly id: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
  };
};

export type PropertyReviewSummary = {
  readonly property_id: string;
  readonly total_reviews: number;
  readonly average_rating: number;
  readonly latest_review_date: string;
  readonly verified_reviews_count: number;
};

// ============================================================================
// BRANDED TYPE CONSTRUCTORS
// ============================================================================

export const createPropertyReviewId = (id: string): PropertyReviewId => 
  id as PropertyReviewId;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isReviewRating = (value: number): value is ReviewRating => {
  return Number.isInteger(value) && value >= 1 && value <= 5;
};

export const isReviewStatus = (value: string): value is ReviewStatus => {
  return ['draft', 'published', 'hidden', 'flagged'].includes(value);
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const REVIEW_RATINGS: readonly ReviewRating[] = [1, 2, 3, 4, 5] as const;

export const REVIEW_STATUSES: readonly ReviewStatus[] = [
  'draft',
  'published', 
  'hidden',
  'flagged'
] as const;

export const RATING_CATEGORIES = {
  cleanliness: 'Cleanliness',
  location: 'Location',
  value: 'Value for Money',
  communication: 'Communication',
  amenities: 'Amenities'
} as const;

export const RATING_COLORS = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-blue-500',
  5: 'text-green-500'
} as const;

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  hidden: 'bg-yellow-100 text-yellow-800',
  flagged: 'bg-red-100 text-red-800'
} as const;
