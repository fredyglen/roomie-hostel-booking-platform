/**
 * Admin User Management Validation Schemas
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive validation schemas for admin user
 * creation, editing, and management with role-based validation and jurisdiction
 * assignment for Ghana universities
 * 
 * Technical Implementation: Uses Zod for type-safe validation with branded types
 * and comprehensive error handling following BE CONSCIOUS zero-tolerance standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { z } from 'zod';
import {
  AdminRoleType,
  createAdminPermission,
  createCampusJurisdiction,
  createCountryJurisdiction
} from '@/types/auth';
import {
  GHANA_UNIVERSITIES,
  getAllUniversityOptions
} from '@/config/ghana-jurisdiction.config';
import type { GhanaUniversityCode } from '@/config/ghana-jurisdiction.config';

// Re-export for components that need these types
export { GHANA_UNIVERSITIES, GhanaUniversityCode };

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

// Ghana-specific validation patterns
const ghanaPhoneRegex = /^(\+233|0)[2-9]\d{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Custom validation messages
const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Ghana phone number (+233XXXXXXXXX or 0XXXXXXXXX)',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  adminEmail: 'Admin email must be from an authorized domain',
  roleRequired: 'Please select an admin role',
  jurisdictionRequired: 'Campus admin must have at least one university assignment'
} as const;

// ============================================================================
// BASE VALIDATION SCHEMAS
// ============================================================================

export const adminEmailSchema = z
  .string({ required_error: messages.required })
  .min(1, messages.required)
  .regex(emailRegex, messages.email)
  .refine(
    (email) => {
      // Allow admin emails from roomi.com domain or university domains
      const allowedDomains = [
        'roomi.com',
        'upsa.edu.gh',
        'ug.edu.gh',
        'knust.edu.gh',
        'ucc.edu.gh'
      ];
      const domain = email.split('@')[1]?.toLowerCase();
      return allowedDomains.includes(domain);
    },
    { message: messages.adminEmail }
  )
  .transform(val => val.toLowerCase().trim());

export const adminPasswordSchema = z
  .string({ required_error: messages.required })
  .min(8, messages.minLength(8))
  .regex(passwordRegex, messages.password);

export const adminNameSchema = z
  .string({ required_error: messages.required })
  .min(2, messages.minLength(2))
  .max(50, messages.maxLength(50))
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(val => val.trim());

export const adminPhoneSchema = z
  .string({ required_error: messages.required })
  .min(1, messages.required)
  .regex(ghanaPhoneRegex, messages.phone)
  .transform(val => val.replace(/\s+/g, ''));

export const adminRoleSchema = z
  .enum(['supreme_admin', 'campus_admin'] as const, {
    required_error: messages.roleRequired,
    invalid_type_error: messages.roleRequired
  });

// ============================================================================
// JURISDICTION VALIDATION SCHEMAS
// ============================================================================

export const campusJurisdictionSchema = z
  .array(z.enum(Object.keys(GHANA_UNIVERSITIES) as [GhanaUniversityCode, ...GhanaUniversityCode[]]))
  .min(1, 'At least one university must be selected')
  .optional();

export const jurisdictionMetadataSchema = z.object({
  university_code: z.string().optional(),
  campus_location: z.string().optional(),
  access_level: z.enum(['global', 'country', 'campus']).optional(),
  setup_type: z.enum(['initial', 'development', 'production']).optional(),
  notes: z.string().max(500, messages.maxLength(500)).optional()
}).optional();

// ============================================================================
// ADMIN USER FORM SCHEMAS
// ============================================================================

/**
 * Admin user creation schema with comprehensive validation
 */
export const createAdminUserSchema = z.object({
  // Basic Information
  email: adminEmailSchema,
  password: adminPasswordSchema,
  confirmPassword: z.string({ required_error: messages.required }),
  firstName: adminNameSchema,
  lastName: adminNameSchema,
  phone: adminPhoneSchema,
  
  // Role and Permissions
  role: adminRoleSchema,
  
  // Jurisdiction Assignment (for Campus Admins)
  campusJurisdictions: campusJurisdictionSchema,
  
  // Additional Metadata
  metadata: jurisdictionMetadataSchema,
  
  // Administrative Notes
  notes: z.string().max(1000, messages.maxLength(1000)).optional()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
).refine(
  (data) => {
    // Campus admins must have at least one jurisdiction
    if (data.role === 'campus_admin') {
      return data.campusJurisdictions && data.campusJurisdictions.length > 0;
    }
    return true;
  },
  {
    message: messages.jurisdictionRequired,
    path: ['campusJurisdictions']
  }
);

/**
 * Admin user editing schema (without password fields)
 */
export const editAdminUserSchema = z.object({
  // Basic Information
  email: adminEmailSchema,
  firstName: adminNameSchema,
  lastName: adminNameSchema,
  phone: adminPhoneSchema,
  
  // Role and Permissions
  role: adminRoleSchema,
  
  // Jurisdiction Assignment
  campusJurisdictions: campusJurisdictionSchema,
  
  // Additional Metadata
  metadata: jurisdictionMetadataSchema,
  
  // Administrative Notes
  notes: z.string().max(1000, messages.maxLength(1000)).optional(),
  
  // Status Management
  isActive: z.boolean().default(true)
}).refine(
  (data) => {
    // Campus admins must have at least one jurisdiction
    if (data.role === 'campus_admin') {
      return data.campusJurisdictions && data.campusJurisdictions.length > 0;
    }
    return true;
  },
  {
    message: messages.jurisdictionRequired,
    path: ['campusJurisdictions']
  }
);

/**
 * Password reset schema for admin users
 */
export const adminPasswordResetSchema = z.object({
  newPassword: adminPasswordSchema,
  confirmPassword: z.string({ required_error: messages.required })
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

/**
 * Admin user search and filter schema
 */
export const adminUserFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['all', 'supreme_admin', 'campus_admin']).default('all'),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  university: z.enum(['all', ...Object.keys(GHANA_UNIVERSITIES)] as const).default('all'),
  sortBy: z.enum(['name', 'email', 'role', 'created_at', 'last_sign_in']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateAdminUserFormValues = z.infer<typeof createAdminUserSchema>;
export type EditAdminUserFormValues = z.infer<typeof editAdminUserSchema>;
export type AdminPasswordResetFormValues = z.infer<typeof adminPasswordResetSchema>;
export type AdminUserFilterValues = z.infer<typeof adminUserFilterSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get university display name from code
 */
export const getUniversityDisplayName = (code: GhanaUniversityCode): string => {
  return GHANA_UNIVERSITIES[code]?.name || code;
};

/**
 * Get university options for select components
 */
export const getUniversityOptions = getAllUniversityOptions;

/**
 * Validate admin role permissions
 */
export const validateAdminRolePermissions = (
  role: AdminRoleType,
  requestedPermissions: string[]
): boolean => {
  // Define role-based permission validation
  const rolePermissions = {
    supreme_admin: [
      'global.read', 'global.write', 'global.delete',
      'countries.manage', 'campuses.manage', 'users.manage',
      'settings.global', 'analytics.global', 'audit.access',
      'revenue.global', 'system.configure'
    ],
    campus_admin: [
      'campus.read', 'campus.write', 'properties.approve',
      'students.verify', 'analytics.campus', 'disputes.resolve',
      'bookings.manage', 'revenue.campus'
    ]
  };
  
  const allowedPermissions = rolePermissions[role];
  return requestedPermissions.every(permission => 
    allowedPermissions.includes(permission)
  );
};
