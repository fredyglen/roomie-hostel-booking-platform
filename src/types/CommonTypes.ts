// Common utility types used across the application

// Base entity type for database models
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// API response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  details?: Record<string, unknown> | string | null;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form field types
export interface FormField<T = string> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date';
  placeholder?: string;
  value: T;
  options?: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange: (value: T) => void;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Component common props
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithId {
  id: string;
}

// Modal types
export interface ModalProps extends WithClassName, WithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends WithClassName, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Toast/notification types
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Log context type
export interface LogContext {
  [key: string]: unknown;
}

// Note: Paystack types are defined in src/types/paystack.d.ts
// This avoids duplicate Window interface declarations
