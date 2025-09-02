/**
 * Maintenance Request Types
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Type-safe maintenance request system for student-owner communication
 * with proper validation, status tracking, and cross-portal synchronization
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

export type MaintenanceRequestId = string & { readonly __brand: 'MaintenanceRequestId' };
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'heating' | 'cleaning' | 'security' | 'appliances' | 'other';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface MaintenanceRequest {
  readonly id: MaintenanceRequestId;
  readonly student_id: string;
  readonly property_id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: MaintenancePriority;
  readonly status: MaintenanceStatus;
  readonly category: MaintenanceCategory;
  readonly images: readonly string[];
  readonly estimated_cost: number | null;
  readonly actual_cost: number | null;
  readonly assigned_to: string | null;
  readonly scheduled_date: string | null;
  readonly completed_date: string | null;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface MaintenanceRequestInsert {
  readonly student_id: string;
  readonly property_id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: MaintenancePriority;
  readonly category: MaintenanceCategory;
  readonly images?: readonly string[];
  readonly estimated_cost?: number;
}

export interface MaintenanceRequestUpdate {
  readonly title?: string;
  readonly description?: string;
  readonly priority?: MaintenancePriority;
  readonly status?: MaintenanceStatus;
  readonly estimated_cost?: number;
  readonly actual_cost?: number;
  readonly assigned_to?: string;
  readonly scheduled_date?: string;
  readonly completed_date?: string;
}

// ============================================================================
// FORM INTERFACES
// ============================================================================

export interface MaintenanceRequestFormData {
  readonly title: string;
  readonly description: string;
  readonly priority: MaintenancePriority;
  readonly category: MaintenanceCategory;
  readonly images: readonly File[];
  readonly estimated_cost: string; // String for form input, converted to number
}

export interface MaintenanceRequestFormErrors {
  readonly title?: string;
  readonly description?: string;
  readonly priority?: string;
  readonly category?: string;
  readonly images?: string;
  readonly estimated_cost?: string;
  readonly general?: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface MaintenanceRequestResponse {
  readonly success: boolean;
  readonly data?: MaintenanceRequest;
  readonly error?: string;
}

export interface MaintenanceRequestListResponse {
  readonly success: boolean;
  readonly data?: readonly MaintenanceRequest[];
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

export interface MaintenanceAnalytics {
  readonly total_requests: number;
  readonly pending_requests: number;
  readonly in_progress_requests: number;
  readonly completed_requests: number;
  readonly cancelled_requests: number;
  readonly average_completion_time: number; // in days
  readonly total_cost: number;
  readonly requests_by_category: Record<MaintenanceCategory, number>;
  readonly requests_by_priority: Record<MaintenancePriority, number>;
}

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

export interface MaintenanceRequestValidation {
  readonly isValid: boolean;
  readonly errors: MaintenanceRequestFormErrors;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type MaintenanceRequestWithProperty = MaintenanceRequest & {
  readonly property: {
    readonly id: string;
    readonly title: string;
    readonly address: string;
    readonly owner_id: string;
  };
};

export type MaintenanceRequestWithStudent = MaintenanceRequest & {
  readonly student: {
    readonly id: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
  };
};

// ============================================================================
// BRANDED TYPE CONSTRUCTORS
// ============================================================================

export const createMaintenanceRequestId = (id: string): MaintenanceRequestId => 
  id as MaintenanceRequestId;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isMaintenanceCategory = (value: string): value is MaintenanceCategory => {
  return ['plumbing', 'electrical', 'heating', 'cleaning', 'security', 'appliances', 'other'].includes(value);
};

export const isMaintenancePriority = (value: string): value is MaintenancePriority => {
  return ['low', 'medium', 'high', 'urgent'].includes(value);
};

export const isMaintenanceStatus = (value: string): value is MaintenanceStatus => {
  return ['pending', 'in_progress', 'completed', 'cancelled'].includes(value);
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const MAINTENANCE_CATEGORIES: readonly MaintenanceCategory[] = [
  'plumbing',
  'electrical', 
  'heating',
  'cleaning',
  'security',
  'appliances',
  'other'
] as const;

export const MAINTENANCE_PRIORITIES: readonly MaintenancePriority[] = [
  'low',
  'medium',
  'high', 
  'urgent'
] as const;

export const MAINTENANCE_STATUSES: readonly MaintenanceStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled'
] as const;

export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800', 
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
} as const;

export const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
} as const;
