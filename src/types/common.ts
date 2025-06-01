
// Enhanced type definitions to fix TypeScript issues
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Enhanced property types to fix existing issues
export interface RoomType {
  id: string;
  name: string;
  price: number;
  unit: 'week' | 'month' | 'year' | 'semester';
  capacity: number;
  description?: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// User and authentication types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'student' | 'owner' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Booking related types
export interface BookingFormData {
  roomType: string;
  duration: string;
  durationType: 'semester' | 'month' | 'year';
  checkInDate: string;
  fullName: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  idType: 'studentId' | 'nationalId' | 'passport';
  studentId: string;
  university: string;
  program: string;
  idImage: File | null;
  termsAgreed: boolean;
}

export interface RoommateInfo {
  name: string;
  email: string;
  phone: string;
}

// Payment types
export interface PaymentData {
  amount: number;
  currency: string;
  reference: string;
  email: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  success: boolean;
  data?: unknown;
  amount?: number;
  reference?: string;
  customer?: unknown;
  message?: string;
  error?: string;
}
