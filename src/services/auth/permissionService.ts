/**
 * Permission Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive permission management and validation
 * for role-based access control throughout the ROOMi platform admin portal
 * with jurisdiction-aware permission checking
 * 
 * Technical Implementation: Implements hierarchical permission system with
 * resource-based access control, jurisdiction validation, and comprehensive
 * audit logging following BE CONSCIOUS standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { 
  AdminPermission, 
  AdminRoleType, 
  CampusJurisdiction, 
  CountryJurisdiction,
  AuthResult,
  AuthError,
  createAdminPermission
} from '@/types/auth';
import { 
  GhanaUniversityCode, 
  GhanaRegionCode,
  getRegionByUniversity,
  validateJurisdictionAssignment
} from '@/config/ghana-jurisdiction.config';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

/**
 * Comprehensive permission definitions organized by resource and scope
 */
export const ADMIN_PERMISSIONS = {
  // Global System Permissions (Supreme Admin Only)
  GLOBAL: {
    SYSTEM_CONFIGURE: createAdminPermission('global.system.configure'),
    COUNTRY_MANAGE: createAdminPermission('global.country.manage'),
    PLATFORM_SETTINGS: createAdminPermission('global.platform.settings'),
    AUDIT_ACCESS: createAdminPermission('global.audit.access'),
    REVENUE_GLOBAL: createAdminPermission('global.revenue.view'),
    ANALYTICS_GLOBAL: createAdminPermission('global.analytics.view'),
    BACKUP_RESTORE: createAdminPermission('global.backup.manage')
  },
  
  // User Management Permissions
  USERS: {
    CREATE: createAdminPermission('users.create'),
    READ: createAdminPermission('users.read'),
    UPDATE: createAdminPermission('users.update'),
    DELETE: createAdminPermission('users.delete'),
    MANAGE_ADMINS: createAdminPermission('users.admins.manage'),
    VERIFY_STUDENTS: createAdminPermission('users.students.verify'),
    SUSPEND_USERS: createAdminPermission('users.suspend'),
    VIEW_PROFILES: createAdminPermission('users.profiles.view')
  },
  
  // Property Management Permissions
  PROPERTIES: {
    CREATE: createAdminPermission('properties.create'),
    READ: createAdminPermission('properties.read'),
    UPDATE: createAdminPermission('properties.update'),
    DELETE: createAdminPermission('properties.delete'),
    APPROVE: createAdminPermission('properties.approve'),
    REJECT: createAdminPermission('properties.reject'),
    FEATURE: createAdminPermission('properties.feature'),
    MODERATE: createAdminPermission('properties.moderate')
  },
  
  // Booking Management Permissions
  BOOKINGS: {
    CREATE: createAdminPermission('bookings.create'),
    READ: createAdminPermission('bookings.read'),
    UPDATE: createAdminPermission('bookings.update'),
    DELETE: createAdminPermission('bookings.delete'),
    CANCEL: createAdminPermission('bookings.cancel'),
    REFUND: createAdminPermission('bookings.refund'),
    MODERATE: createAdminPermission('bookings.moderate')
  },
  
  // Analytics and Reporting Permissions
  ANALYTICS: {
    VIEW_GLOBAL: createAdminPermission('analytics.global.view'),
    VIEW_REGIONAL: createAdminPermission('analytics.regional.view'),
    VIEW_CAMPUS: createAdminPermission('analytics.campus.view'),
    EXPORT_DATA: createAdminPermission('analytics.export'),
    FINANCIAL_REPORTS: createAdminPermission('analytics.financial.view'),
    USER_INSIGHTS: createAdminPermission('analytics.users.view')
  },
  
  // Financial Management Permissions
  FINANCE: {
    VIEW_REVENUE: createAdminPermission('finance.revenue.view'),
    MANAGE_COMMISSIONS: createAdminPermission('finance.commissions.manage'),
    PROCESS_REFUNDS: createAdminPermission('finance.refunds.process'),
    VIEW_TRANSACTIONS: createAdminPermission('finance.transactions.view'),
    EXPORT_FINANCIAL: createAdminPermission('finance.export')
  },
  
  // Content Management Permissions
  CONTENT: {
    MANAGE_STORIES: createAdminPermission('content.stories.manage'),
    MODERATE_REVIEWS: createAdminPermission('content.reviews.moderate'),
    MANAGE_NOTIFICATIONS: createAdminPermission('content.notifications.manage'),
    FEATURE_CONTENT: createAdminPermission('content.feature')
  },
  
  // Support and Disputes Permissions
  SUPPORT: {
    VIEW_TICKETS: createAdminPermission('support.tickets.view'),
    RESOLVE_DISPUTES: createAdminPermission('support.disputes.resolve'),
    MANAGE_COMPLAINTS: createAdminPermission('support.complaints.manage'),
    ESCALATE_ISSUES: createAdminPermission('support.escalate')
  }
} as const;

// ============================================================================
// ROLE PERMISSION MAPPINGS
// ============================================================================

/**
 * Role-based permission mappings with jurisdiction scope
 */
export const ROLE_PERMISSIONS: Record<AdminRoleType, {
  permissions: readonly AdminPermission[];
  jurisdictionScope: 'global' | 'regional' | 'campus';
  description: string;
}> = {
  supreme_admin: {
    permissions: [
      // Global permissions
      ...Object.values(ADMIN_PERMISSIONS.GLOBAL),
      // All user management
      ...Object.values(ADMIN_PERMISSIONS.USERS),
      // All property management
      ...Object.values(ADMIN_PERMISSIONS.PROPERTIES),
      // All booking management
      ...Object.values(ADMIN_PERMISSIONS.BOOKINGS),
      // Global analytics
      ADMIN_PERMISSIONS.ANALYTICS.VIEW_GLOBAL,
      ADMIN_PERMISSIONS.ANALYTICS.VIEW_REGIONAL,
      ADMIN_PERMISSIONS.ANALYTICS.VIEW_CAMPUS,
      ADMIN_PERMISSIONS.ANALYTICS.EXPORT_DATA,
      ADMIN_PERMISSIONS.ANALYTICS.FINANCIAL_REPORTS,
      ADMIN_PERMISSIONS.ANALYTICS.USER_INSIGHTS,
      // All financial management
      ...Object.values(ADMIN_PERMISSIONS.FINANCE),
      // All content management
      ...Object.values(ADMIN_PERMISSIONS.CONTENT),
      // All support management
      ...Object.values(ADMIN_PERMISSIONS.SUPPORT)
    ],
    jurisdictionScope: 'global',
    description: 'Global platform administrator with full access to all features and data'
  },
  
  campus_admin: {
    permissions: [
      // Limited user management
      ADMIN_PERMISSIONS.USERS.READ,
      ADMIN_PERMISSIONS.USERS.VERIFY_STUDENTS,
      ADMIN_PERMISSIONS.USERS.VIEW_PROFILES,
      // Property management for assigned campuses
      ADMIN_PERMISSIONS.PROPERTIES.READ,
      ADMIN_PERMISSIONS.PROPERTIES.APPROVE,
      ADMIN_PERMISSIONS.PROPERTIES.REJECT,
      ADMIN_PERMISSIONS.PROPERTIES.MODERATE,
      // Booking management for assigned campuses
      ADMIN_PERMISSIONS.BOOKINGS.READ,
      ADMIN_PERMISSIONS.BOOKINGS.MODERATE,
      ADMIN_PERMISSIONS.BOOKINGS.CANCEL,
      // Campus-level analytics
      ADMIN_PERMISSIONS.ANALYTICS.VIEW_CAMPUS,
      ADMIN_PERMISSIONS.ANALYTICS.USER_INSIGHTS,
      // Limited financial access
      ADMIN_PERMISSIONS.FINANCE.VIEW_REVENUE,
      ADMIN_PERMISSIONS.FINANCE.VIEW_TRANSACTIONS,
      // Content moderation
      ADMIN_PERMISSIONS.CONTENT.MODERATE_REVIEWS,
      ADMIN_PERMISSIONS.CONTENT.MANAGE_NOTIFICATIONS,
      // Support for assigned campuses
      ADMIN_PERMISSIONS.SUPPORT.VIEW_TICKETS,
      ADMIN_PERMISSIONS.SUPPORT.RESOLVE_DISPUTES,
      ADMIN_PERMISSIONS.SUPPORT.MANAGE_COMPLAINTS
    ],
    jurisdictionScope: 'campus',
    description: 'Campus-specific administrator for property approval and student verification'
  }
};

// ============================================================================
// PERMISSION SERVICE CLASS
// ============================================================================

/**
 * Permission Service - Apple-Grade Implementation
 * 
 * Provides comprehensive permission management with:
 * - Role-based permission checking
 * - Jurisdiction-aware access control
 * - Resource-level permission validation
 * - Comprehensive audit logging
 */
class PermissionService {
  
  /**
   * Check if user has specific permission
   */
  public hasPermission(
    userRole: AdminRoleType,
    permission: AdminPermission,
    userJurisdictions?: {
      campuses?: readonly CampusJurisdiction[];
      countries?: readonly CountryJurisdiction[];
    }
  ): AuthResult<boolean> {
    try {
      const roleConfig = ROLE_PERMISSIONS[userRole];
      
      if (!roleConfig) {
        return {
          success: false,
          error: {
            type: 'validation',
            message: `Invalid role: ${userRole}`,
            timestamp: new Date()
          }
        };
      }
      
      const hasPermission = roleConfig.permissions.includes(permission);
      
      logger.debug('Permission check', {
        userRole,
        permission,
        hasPermission,
        jurisdictionScope: roleConfig.jurisdictionScope
      });
      
      return {
        success: true,
        data: hasPermission
      };
      
    } catch (error) {
      logger.error('Error checking permission', { userRole, permission, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to check permission',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Check if user has jurisdiction over specific resource
   */
  public hasJurisdictionAccess(
    userRole: AdminRoleType,
    userJurisdictions: {
      campuses?: readonly CampusJurisdiction[];
      countries?: readonly CountryJurisdiction[];
    },
    resourceJurisdiction: {
      university?: GhanaUniversityCode;
      region?: GhanaRegionCode;
      country?: CountryJurisdiction;
    }
  ): AuthResult<boolean> {
    try {
      // Supreme admin has global access
      if (userRole === 'supreme_admin') {
        return { success: true, data: true };
      }
      
      // Campus admin jurisdiction check
      if (userRole === 'campus_admin') {
        // Check university-level access
        if (resourceJurisdiction.university) {
          const hasUniversityAccess = userJurisdictions.campuses?.some(
            campus => campus === resourceJurisdiction.university
          ) || false;
          
          return { success: true, data: hasUniversityAccess };
        }
        
        // Check region-level access
        if (resourceJurisdiction.region) {
          const hasRegionalAccess = userJurisdictions.campuses?.some(campus => {
            const universityRegion = getRegionByUniversity(campus as GhanaUniversityCode);
            return universityRegion === resourceJurisdiction.region;
          }) || false;
          
          return { success: true, data: hasRegionalAccess };
        }
        
        // Check country-level access (campus admins have limited country access)
        if (resourceJurisdiction.country) {
          const hasCountryAccess = userJurisdictions.countries?.includes(
            resourceJurisdiction.country
          ) || false;
          
          return { success: true, data: hasCountryAccess };
        }
      }
      
      return { success: true, data: false };
      
    } catch (error) {
      logger.error('Error checking jurisdiction access', { 
        userRole, 
        userJurisdictions, 
        resourceJurisdiction, 
        error 
      });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to check jurisdiction access',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Get all permissions for a role
   */
  public getRolePermissions(role: AdminRoleType): AuthResult<readonly AdminPermission[]> {
    try {
      const roleConfig = ROLE_PERMISSIONS[role];
      
      if (!roleConfig) {
        return {
          success: false,
          error: {
            type: 'validation',
            message: `Invalid role: ${role}`,
            timestamp: new Date()
          }
        };
      }
      
      return {
        success: true,
        data: roleConfig.permissions
      };
      
    } catch (error) {
      logger.error('Error getting role permissions', { role, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to get role permissions',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Validate permission and jurisdiction for resource access
   */
  public validateResourceAccess(
    userRole: AdminRoleType,
    userJurisdictions: {
      campuses?: readonly CampusJurisdiction[];
      countries?: readonly CountryJurisdiction[];
    },
    requiredPermission: AdminPermission,
    resourceJurisdiction?: {
      university?: GhanaUniversityCode;
      region?: GhanaRegionCode;
      country?: CountryJurisdiction;
    }
  ): AuthResult<boolean> {
    try {
      // Check permission first
      const permissionResult = this.hasPermission(userRole, requiredPermission, userJurisdictions);
      
      if (!permissionResult.success || !permissionResult.data) {
        return permissionResult;
      }
      
      // If no resource jurisdiction specified, permission is sufficient
      if (!resourceJurisdiction) {
        return { success: true, data: true };
      }
      
      // Check jurisdiction access
      const jurisdictionResult = this.hasJurisdictionAccess(
        userRole,
        userJurisdictions,
        resourceJurisdiction
      );
      
      return jurisdictionResult;
      
    } catch (error) {
      logger.error('Error validating resource access', { 
        userRole, 
        userJurisdictions, 
        requiredPermission, 
        resourceJurisdiction, 
        error 
      });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to validate resource access',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
  
  /**
   * Get accessible universities for a campus admin
   */
  public getAccessibleUniversities(
    userRole: AdminRoleType,
    userJurisdictions: {
      campuses?: readonly CampusJurisdiction[];
      countries?: readonly CountryJurisdiction[];
    }
  ): AuthResult<readonly GhanaUniversityCode[]> {
    try {
      if (userRole === 'supreme_admin') {
        // Supreme admin can access all universities
        const allUniversities = Object.keys(GHANA_UNIVERSITIES) as GhanaUniversityCode[];
        return { success: true, data: allUniversities };
      }
      
      if (userRole === 'campus_admin') {
        // Campus admin can only access assigned universities
        const accessibleUniversities = (userJurisdictions.campuses || []) as GhanaUniversityCode[];
        return { success: true, data: accessibleUniversities };
      }
      
      return { success: true, data: [] };
      
    } catch (error) {
      logger.error('Error getting accessible universities', { 
        userRole, 
        userJurisdictions, 
        error 
      });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to get accessible universities',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }
}

// ============================================================================
// SERVICE INSTANCE
// ============================================================================

export const permissionService = new PermissionService();
export default permissionService;
