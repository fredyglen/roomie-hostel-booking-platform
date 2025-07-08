/**
 * ROOMi Platform Core Type Definitions
 * Apple-Grade TypeScript interfaces with zero tolerance for 'any' types
 *
 * @version 2.0.0 - Technical Debt Elimination
 * @author ROOMi Platform Team
 */

// =====================================================
// USER TYPES - UNIFIED INTERFACE
// =====================================================

/**
 * Core User interface - unified from all legacy interfaces
 * Includes all properties needed across the platform
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;

  // Name fields - multiple formats for compatibility
  readonly name?: string; // Full name for legacy compatibility
  readonly firstName?: string;
  readonly lastName?: string;
  readonly first_name?: string; // Database compatibility
  readonly last_name?: string; // Database compatibility

  // Contact information
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly avatar_url?: string; // Database compatibility

  // Profile information
  readonly bio?: string;
  readonly university?: string;
  readonly student_id?: string;
  readonly graduation_year?: number;

  // Metadata
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly created_at?: string; // Database compatibility
  readonly updated_at?: string; // Database compatibility
  readonly last_login?: string;

  // Status and verification
  readonly status?: UserStatus;
  readonly verification_status?: VerificationStatus;
  readonly profile?: UserProfile; // For complex profile data
}

// DEPRECATED: Use UserRole from '@/types/roles' instead
export type UserRole = 'owner' | 'student' | 'admin' | 'agent';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * User profile interface for detailed user information
 */
export interface UserProfile {
  readonly first_name: string;
  readonly last_name: string;
  readonly phone?: string;
  readonly avatar_url?: string;
  readonly bio?: string;
  readonly university?: string;
  readonly student_id?: string;
  readonly graduation_year?: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: 'success' | 'error';
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Form state types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}