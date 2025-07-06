/**
 * ROOMi Platform API Type Definitions
 * Apple-Grade TypeScript interfaces for API contracts and responses
 * 
 * This file defines all API-related types with complete type safety
 * for client-server communication in the ROOMi platform.
 * 
 * @version 1.0.0
 * @author ROOMi Platform Team
 */

import {
  User,
  Property,
  Booking,
  PaymentTransaction,
  PropertySearchFilters,
  BookingSearchFilters,
  UserInsert,
  UserUpdate,
  PropertyInsert,
  PropertyUpdate,
  BookingInsert,
  BookingUpdate
} from './platform-entities';

import {
  UserId,
  PropertyId,
  BookingId,
  PaymentId,
  UserRole,
  BookingStatus,
  PaymentStatus,
  Currency
} from './platform-core';

// =====================================================
// API RESPONSE WRAPPER TYPES
// =====================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly message?: string;
  readonly timestamp: string;
  readonly request_id: string;
}

/**
 * API error structure
 */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly field_errors?: Record<string, readonly string[]>;
  readonly stack_trace?: string; // Only in development
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: PaginationInfo;
  readonly total_count: number;
  readonly has_next_page: boolean;
  readonly has_previous_page: boolean;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  readonly page: number;
  readonly page_size: number;
  readonly total_pages: number;
  readonly total_count: number;
}

// =====================================================
// AUTHENTICATION API TYPES
// =====================================================

/**
 * Login request payload
 */
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
  readonly remember_me?: boolean;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly confirm_password: string;
  readonly role: UserRole;
  readonly first_name: string;
  readonly last_name: string;
  readonly phone?: string;
  readonly university?: string; // Required for students
  readonly student_id?: string; // Required for students
  readonly terms_accepted: boolean;
  readonly privacy_policy_accepted: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  readonly user: User;
  readonly access_token: string;
  readonly refresh_token: string;
  readonly expires_in: number;
  readonly token_type: 'Bearer';
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  readonly email: string;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  readonly token: string;
  readonly new_password: string;
  readonly confirm_password: string;
}

// =====================================================
// USER API TYPES
// =====================================================

/**
 * User profile update request
 */
export interface UserProfileUpdateRequest {
  readonly first_name?: string;
  readonly last_name?: string;
  readonly phone?: string;
  readonly bio?: string;
  readonly avatar_url?: string;
  readonly emergency_contact_name?: string;
  readonly emergency_contact_phone?: string;
}

/**
 * Student profile update request
 */
export interface StudentProfileUpdateRequest extends UserProfileUpdateRequest {
  readonly student_level?: string;
  readonly program_of_study?: string;
  readonly graduation_year?: number;
}

/**
 * User search filters
 */
export interface UserSearchFilters {
  readonly role?: UserRole;
  readonly verification_status?: string;
  readonly university?: string;
  readonly is_active?: boolean;
  readonly search_query?: string;
}

// =====================================================
// PROPERTY API TYPES
// =====================================================

/**
 * Property creation request
 */
export interface PropertyCreateRequest extends Omit<PropertyInsert, 'id' | 'owner_id'> {
  readonly rooms: readonly RoomCreateRequest[];
}

/**
 * Property update request
 */
export interface PropertyUpdateRequest extends PropertyUpdate {
  readonly rooms?: readonly RoomUpdateRequest[];
}

/**
 * Room creation request
 */
export interface RoomCreateRequest {
  readonly room_number: string;
  readonly room_type: string;
  readonly beds_count: number;
  readonly price_per_bed_per_semester: number;
  readonly has_ensuite: boolean;
  readonly has_ac: boolean;
  readonly has_wardrobe: boolean;
  readonly room_amenities: readonly string[];
  readonly room_images: readonly string[];
}

/**
 * Room update request
 */
export interface RoomUpdateRequest extends Partial<RoomCreateRequest> {
  readonly id?: string;
}

/**
 * Property search request
 */
export interface PropertySearchRequest extends PropertySearchFilters {
  readonly page?: number;
  readonly page_size?: number;
  readonly sort_by?: 'price' | 'rating' | 'distance' | 'created_at';
  readonly sort_order?: 'asc' | 'desc';
  readonly search_query?: string;
}

/**
 * Property availability check
 */
export interface PropertyAvailabilityRequest {
  readonly property_id: PropertyId;
  readonly check_in_date: string;
  readonly check_out_date: string;
  readonly room_type?: string;
  readonly gender_type?: string;
}

/**
 * Property availability response
 */
export interface PropertyAvailabilityResponse {
  readonly property_id: PropertyId;
  readonly is_available: boolean;
  readonly available_rooms: readonly AvailableRoom[];
  readonly total_available_beds: number;
  readonly price_range: {
    readonly min_price: number;
    readonly max_price: number;
  };
}

/**
 * Available room information
 */
export interface AvailableRoom {
  readonly room_id: string;
  readonly room_number: string;
  readonly room_type: string;
  readonly available_beds: number;
  readonly price_per_bed: number;
  readonly amenities: readonly string[];
}

// =====================================================
// BOOKING API TYPES
// =====================================================

/**
 * Booking creation request
 */
export interface BookingCreateRequest {
  readonly property_id: PropertyId;
  readonly room_id: string;
  readonly bed_id?: string;
  readonly check_in_date: string;
  readonly semester_period: string;
  readonly academic_year: string;
  readonly emergency_contact: {
    readonly name: string;
    readonly phone: string;
    readonly relationship: string;
    readonly email?: string;
  };
  readonly roommate_preference?: {
    readonly preferred_roommate_id?: UserId;
    readonly allow_random_assignment: boolean;
  };
  readonly special_requests?: string;
  readonly verification_documents: {
    readonly student_id_document_url: string;
    readonly admission_letter_url?: string;
  };
}

/**
 * Booking search request
 */
export interface BookingSearchRequest extends BookingSearchFilters {
  readonly page?: number;
  readonly page_size?: number;
  readonly sort_by?: 'created_at' | 'check_in_date' | 'total_amount';
  readonly sort_order?: 'asc' | 'desc';
}

/**
 * Booking status update request
 */
export interface BookingStatusUpdateRequest {
  readonly booking_id: BookingId;
  readonly status: BookingStatus;
  readonly notes?: string;
  readonly reason?: string;
}

/**
 * Booking cancellation request
 */
export interface BookingCancellationRequest {
  readonly booking_id: BookingId;
  readonly reason: string;
  readonly refund_requested: boolean;
}

// =====================================================
// PAYMENT API TYPES
// =====================================================

/**
 * Payment initialization request
 */
export interface PaymentInitializationRequest {
  readonly booking_id: BookingId;
  readonly payment_method: string;
  readonly return_url: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Payment initialization response
 */
export interface PaymentInitializationResponse {
  readonly payment_id: PaymentId;
  readonly authorization_url: string;
  readonly access_code: string;
  readonly reference: string;
  readonly expires_at: string;
}

/**
 * Payment verification request
 */
export interface PaymentVerificationRequest {
  readonly reference: string;
  readonly booking_id: BookingId;
}

/**
 * Payment verification response
 */
export interface PaymentVerificationResponse {
  readonly payment_id: PaymentId;
  readonly status: PaymentStatus;
  readonly amount: number;
  readonly currency: Currency;
  readonly paid_at?: string;
  readonly authorization_code?: string;
  readonly transaction_id: string;
}

/**
 * Refund request
 */
export interface RefundRequest {
  readonly payment_id: PaymentId;
  readonly amount?: number; // Partial refund if specified
  readonly reason: string;
}

// =====================================================
// ANALYTICS API TYPES
// =====================================================

/**
 * Platform analytics request
 */
export interface AnalyticsRequest {
  readonly start_date: string;
  readonly end_date: string;
  readonly metrics: readonly string[];
  readonly group_by?: 'day' | 'week' | 'month';
  readonly filters?: Record<string, unknown>;
}

/**
 * Platform analytics response
 */
export interface AnalyticsResponse {
  readonly metrics: Record<string, AnalyticsMetric>;
  readonly period: {
    readonly start_date: string;
    readonly end_date: string;
  };
  readonly generated_at: string;
}

/**
 * Analytics metric data
 */
export interface AnalyticsMetric {
  readonly value: number;
  readonly previous_value?: number;
  readonly change_percentage?: number;
  readonly trend: 'up' | 'down' | 'stable';
  readonly data_points?: readonly AnalyticsDataPoint[];
}

/**
 * Analytics data point
 */
export interface AnalyticsDataPoint {
  readonly date: string;
  readonly value: number;
  readonly label?: string;
}

// =====================================================
// FILE UPLOAD API TYPES
// =====================================================

/**
 * File upload request
 */
export interface FileUploadRequest {
  readonly file: File;
  readonly category: 'property_image' | 'property_video' | 'document' | 'avatar';
  readonly property_id?: PropertyId;
  readonly user_id?: UserId;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  readonly file_id: string;
  readonly file_url: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly mime_type: string;
  readonly uploaded_at: string;
}

/**
 * Bulk file upload request
 */
export interface BulkFileUploadRequest {
  readonly files: readonly FileUploadRequest[];
  readonly batch_id?: string;
}

/**
 * Bulk file upload response
 */
export interface BulkFileUploadResponse {
  readonly batch_id: string;
  readonly uploaded_files: readonly FileUploadResponse[];
  readonly failed_uploads: readonly {
    readonly file_name: string;
    readonly error: string;
  }[];
  readonly total_uploaded: number;
  readonly total_failed: number;
}
