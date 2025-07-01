// Core type definitions for the application

// User related types
export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  university?: string;
  studentId?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export type UserRole = 'owner' | 'student' | 'admin';

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