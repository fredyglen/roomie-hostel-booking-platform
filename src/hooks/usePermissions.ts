/**
 * Permission Hooks
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides React hooks for permission checking and
 * jurisdiction validation throughout the ROOMi platform admin portal
 * with comprehensive error handling and performance optimization
 * 
 * Technical Implementation: Uses React hooks with memoization for efficient
 * permission checking, integrates with permission service and admin auth context
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { useMemo, useCallback } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PropertyData, UserProfile } from '@/types/apple-grade-foundation';
import { 
  AdminPermission, 
  AdminRoleType, 
  CampusJurisdiction, 
  CountryJurisdiction,
  isAdminUser
} from '@/types/auth';
import { 
  GhanaUniversityCode, 
  GhanaRegionCode 
} from '@/config/ghana-jurisdiction.config';
import { 
  permissionService, 
  ADMIN_PERMISSIONS 
} from '@/services/auth/permissionService';
import { 
  dataFilterService, 
  DataFilterContext 
} from '@/services/auth/dataFilterService';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// PERMISSION HOOK TYPES
// ============================================================================

// Apple-Grade Filter Types
interface FilterOptions {
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
  readonly filters?: Record<string, unknown>;
}

interface BookingData {
  readonly id: string;
  readonly propertyId: string;
  readonly studentId: string;
  readonly status: string;
  readonly createdAt: string;
}

interface UserData {
  readonly id: string;
  readonly email: string;
  readonly role: string;
  readonly createdAt: string;
}

interface AnalyticsData {
  readonly total: number;
  readonly data: unknown[];
  readonly metadata: Record<string, unknown>;
}

export interface PermissionHookResult {
  readonly hasPermission: (permission: AdminPermission) => boolean;
  readonly hasRole: (role: AdminRoleType) => boolean;
  readonly hasAnyRole: (roles: readonly AdminRoleType[]) => boolean;
  readonly hasJurisdiction: (
    university?: GhanaUniversityCode,
    region?: GhanaRegionCode,
    country?: CountryJurisdiction
  ) => boolean;
  readonly canAccessUniversity: (university: GhanaUniversityCode) => boolean;
  readonly getAccessibleUniversities: () => readonly GhanaUniversityCode[];
  readonly validateResourceAccess: (
    permission: AdminPermission,
    university?: GhanaUniversityCode,
    region?: GhanaRegionCode
  ) => boolean;
  readonly isSupremeAdmin: boolean;
  readonly isCampusAdmin: boolean;
  readonly userRole: AdminRoleType | null;
  readonly userJurisdictions: {
    readonly campuses?: readonly CampusJurisdiction[];
    readonly countries?: readonly CountryJurisdiction[];
  };
}

export interface DataFilterHookResult {
  readonly getFilterContext: () => DataFilterContext | null;
  readonly filterProperties: (options?: FilterOptions) => PropertyData[];
  readonly filterBookings: (options?: FilterOptions) => BookingData[];
  readonly filterUsers: (options?: FilterOptions) => UserData[];
  readonly getFilteredAnalytics: (
    type: 'properties' | 'bookings' | 'users' | 'revenue',
    options?: FilterOptions
  ) => Promise<AnalyticsData>;
}

// ============================================================================
// PERMISSION HOOKS
// ============================================================================

/**
 * Main permission hook for role-based access control
 */
export const usePermissions = (): PermissionHookResult => {
  const { adminUser, adminSession } = useAdminAuth();

  // Memoized permission checking function
  const hasPermission = useCallback((permission: AdminPermission): boolean => {
    if (!adminUser || !adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    const result = permissionService.hasPermission(
      adminUser.role,
      permission,
      adminSession.jurisdiction
    );

    return result.success && result.data;
  }, [adminUser, adminSession]);

  // Memoized role checking function
  const hasRole = useCallback((role: AdminRoleType): boolean => {
    return adminUser?.role === role;
  }, [adminUser]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: readonly AdminRoleType[]): boolean => {
    return adminUser ? roles.includes(adminUser.role) : false;
  }, [adminUser]);

  // Memoized jurisdiction checking function
  const hasJurisdiction = useCallback((
    university?: GhanaUniversityCode,
    region?: GhanaRegionCode,
    country?: CountryJurisdiction
  ): boolean => {
    if (!adminUser || !adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    const result = permissionService.hasJurisdictionAccess(
      adminUser.role,
      adminSession.jurisdiction,
      { university, region, country }
    );

    return result.success && result.data;
  }, [adminUser, adminSession]);

  // Check if user can access specific university
  const canAccessUniversity = useCallback((university: GhanaUniversityCode): boolean => {
    if (!adminUser || !adminSession) return false;

    const filterContext: DataFilterContext = {
      userRole: adminUser.role,
      userJurisdictions: adminSession.jurisdiction
    };

    return dataFilterService.canAccessUniversity(filterContext, university);
  }, [adminUser, adminSession]);

  // Get all accessible universities for current user
  const getAccessibleUniversities = useCallback((): readonly GhanaUniversityCode[] => {
    if (!adminUser || !adminSession) return [];

    const filterContext: DataFilterContext = {
      userRole: adminUser.role,
      userJurisdictions: adminSession.jurisdiction
    };

    return dataFilterService.getAccessibleUniversities(filterContext);
  }, [adminUser, adminSession]);

  // Validate resource access with permission and jurisdiction
  const validateResourceAccess = useCallback((
    permission: AdminPermission,
    university?: GhanaUniversityCode,
    region?: GhanaRegionCode
  ): boolean => {
    if (!adminUser || !adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    const result = permissionService.validateResourceAccess(
      adminUser.role,
      adminSession.jurisdiction,
      permission,
      { university, region }
    );

    return result.success && result.data;
  }, [adminUser, adminSession]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    isSupremeAdmin: adminUser?.role === 'supreme_admin',
    isCampusAdmin: adminUser?.role === 'campus_admin',
    userRole: adminUser?.role || null,
    userJurisdictions: adminSession?.jurisdiction || {}
  }), [adminUser, adminSession]);

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasJurisdiction,
    canAccessUniversity,
    getAccessibleUniversities,
    validateResourceAccess,
    ...computedValues
  };
};

/**
 * Data filtering hook for jurisdiction-aware queries
 */
export const useDataFilter = (): DataFilterHookResult => {
  const { adminUser, adminSession } = useAdminAuth();

  // Get filter context for current user
  const getFilterContext = useCallback((): DataFilterContext | null => {
    if (!adminUser || !adminSession || !isAdminUser(adminUser)) {
      return null;
    }

    return {
      userRole: adminUser.role,
      userJurisdictions: adminSession.jurisdiction
    };
  }, [adminUser, adminSession]);

  // Filter properties based on jurisdiction
  const filterProperties = useCallback((options: FilterOptions = {}) => {
    const context = getFilterContext();
    if (!context) return null;

    const result = dataFilterService.filterProperties(context, options);
    return result.success ? result.data : null;
  }, [getFilterContext]);

  // Filter bookings based on jurisdiction
  const filterBookings = useCallback((options: FilterOptions = {}) => {
    const context = getFilterContext();
    if (!context) return null;

    const result = dataFilterService.filterBookings(context, options);
    return result.success ? result.data : null;
  }, [getFilterContext]);

  // Filter users based on jurisdiction
  const filterUsers = useCallback((options: FilterOptions = {}) => {
    const context = getFilterContext();
    if (!context) return null;

    const result = dataFilterService.filterUsers(context, options);
    return result.success ? result.data : null;
  }, [getFilterContext]);

  // Get filtered analytics data
  const getFilteredAnalytics = useCallback(async (
    type: 'properties' | 'bookings' | 'users' | 'revenue',
    options: FilterOptions = {}
  ) => {
    const context = getFilterContext();
    if (!context) return null;

    const result = await dataFilterService.getFilteredAnalytics(context, type, options);
    return result.success ? result.data : null;
  }, [getFilterContext]);

  return {
    getFilterContext,
    filterProperties,
    filterBookings,
    filterUsers,
    getFilteredAnalytics
  };
};

/**
 * Specific permission hooks for common use cases
 */

// User management permissions
export const useUserManagementPermissions = () => {
  const { hasPermission } = usePermissions();
  
  return useMemo(() => ({
    canCreateUsers: hasPermission(ADMIN_PERMISSIONS.USERS.CREATE),
    canUpdateUsers: hasPermission(ADMIN_PERMISSIONS.USERS.UPDATE),
    canDeleteUsers: hasPermission(ADMIN_PERMISSIONS.USERS.DELETE),
    canManageAdmins: hasPermission(ADMIN_PERMISSIONS.USERS.MANAGE_ADMINS),
    canVerifyStudents: hasPermission(ADMIN_PERMISSIONS.USERS.VERIFY_STUDENTS),
    canSuspendUsers: hasPermission(ADMIN_PERMISSIONS.USERS.SUSPEND_USERS)
  }), [hasPermission]);
};

// Property management permissions
export const usePropertyManagementPermissions = () => {
  const { hasPermission } = usePermissions();
  
  return useMemo(() => ({
    canCreateProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.CREATE),
    canUpdateProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.UPDATE),
    canDeleteProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.DELETE),
    canApproveProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.APPROVE),
    canRejectProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.REJECT),
    canFeatureProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.FEATURE),
    canModerateProperties: hasPermission(ADMIN_PERMISSIONS.PROPERTIES.MODERATE)
  }), [hasPermission]);
};

// Analytics permissions
export const useAnalyticsPermissions = () => {
  const { hasPermission } = usePermissions();
  
  return useMemo(() => ({
    canViewGlobalAnalytics: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.VIEW_GLOBAL),
    canViewRegionalAnalytics: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.VIEW_REGIONAL),
    canViewCampusAnalytics: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.VIEW_CAMPUS),
    canExportData: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.EXPORT_DATA),
    canViewFinancialReports: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.FINANCIAL_REPORTS),
    canViewUserInsights: hasPermission(ADMIN_PERMISSIONS.ANALYTICS.USER_INSIGHTS)
  }), [hasPermission]);
};

// Financial management permissions
export const useFinancialPermissions = () => {
  const { hasPermission } = usePermissions();
  
  return useMemo(() => ({
    canViewRevenue: hasPermission(ADMIN_PERMISSIONS.FINANCE.VIEW_REVENUE),
    canManageCommissions: hasPermission(ADMIN_PERMISSIONS.FINANCE.MANAGE_COMMISSIONS),
    canProcessRefunds: hasPermission(ADMIN_PERMISSIONS.FINANCE.PROCESS_REFUNDS),
    canViewTransactions: hasPermission(ADMIN_PERMISSIONS.FINANCE.VIEW_TRANSACTIONS),
    canExportFinancial: hasPermission(ADMIN_PERMISSIONS.FINANCE.EXPORT_FINANCIAL)
  }), [hasPermission]);
};

/**
 * University-specific permission hook
 */
export const useUniversityPermissions = (university: GhanaUniversityCode) => {
  const { canAccessUniversity, validateResourceAccess } = usePermissions();
  
  return useMemo(() => ({
    canAccess: canAccessUniversity(university),
    canManageProperties: validateResourceAccess(
      ADMIN_PERMISSIONS.PROPERTIES.APPROVE, 
      university
    ),
    canVerifyStudents: validateResourceAccess(
      ADMIN_PERMISSIONS.USERS.VERIFY_STUDENTS, 
      university
    ),
    canViewAnalytics: validateResourceAccess(
      ADMIN_PERMISSIONS.ANALYTICS.VIEW_CAMPUS, 
      university
    )
  }), [university, canAccessUniversity, validateResourceAccess]);
};
