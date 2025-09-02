/**
 * Permission Guard Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides granular permission-based UI component visibility
 * control throughout the ROOMi platform admin portal with jurisdiction-aware
 * access control and comprehensive error handling
 * 
 * Technical Implementation: Uses React context and permission service to
 * conditionally render components based on user permissions and jurisdiction
 * assignments following BE CONSCIOUS standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
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
import { permissionService } from '@/services/auth/permissionService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff,
  Crown,
  School
} from 'lucide-react';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface PermissionGuardProps {
  readonly children: React.ReactNode;
  readonly requiredPermission?: AdminPermission;
  readonly requiredRole?: AdminRoleType;
  readonly allowedRoles?: readonly AdminRoleType[];
  readonly requiredUniversity?: GhanaUniversityCode;
  readonly requiredRegion?: GhanaRegionCode;
  readonly requiredCountry?: CountryJurisdiction;
  readonly fallbackComponent?: React.ComponentType<PermissionDeniedProps>;
  readonly showPermissionInfo?: boolean;
  readonly debugMode?: boolean;
  readonly onPermissionDenied?: (reason: string) => void;
}

interface PermissionDeniedProps {
  readonly reason: string;
  readonly requiredPermission?: AdminPermission;
  readonly userRole?: AdminRoleType;
  readonly showDetails?: boolean;
}

// ============================================================================
// PERMISSION DENIED COMPONENT
// ============================================================================

/**
 * Default Permission Denied Component
 */
const DefaultPermissionDenied: React.FC<PermissionDeniedProps> = ({
  reason,
  requiredPermission,
  userRole,
  showDetails = false
}) => {
  if (!showDetails) {
    return null; // Silent failure - component simply doesn't render
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium text-amber-800">Access Restricted</p>
          <p className="text-sm text-amber-700">{reason}</p>
          {requiredPermission && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Required: {requiredPermission}
              </Badge>
              {userRole && (
                <Badge variant="outline" className="text-xs">
                  Your Role: {userRole}
                </Badge>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// ============================================================================
// PERMISSION GUARD COMPONENT
// ============================================================================

/**
 * Permission Guard Component
 * Conditionally renders children based on user permissions and jurisdiction
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  allowedRoles,
  requiredUniversity,
  requiredRegion,
  requiredCountry,
  fallbackComponent: FallbackComponent = DefaultPermissionDenied,
  showPermissionInfo = false,
  debugMode = false,
  onPermissionDenied
}) => {
  const { adminUser, adminSession } = useAdminAuth();

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  const permissionCheck = useMemo(() => {
    // Check if user is authenticated and is admin
    if (!adminUser || !adminSession || !isAdminUser(adminUser)) {
      const reason = 'User not authenticated or not an admin';
      if (debugMode) {
        logger.debug('PermissionGuard: Authentication check failed', { reason });
      }
      return { hasAccess: false, reason };
    }

    // Check required role
    if (requiredRole && adminUser.role !== requiredRole) {
      const reason = `Required role: ${requiredRole}, user role: ${adminUser.role}`;
      if (debugMode) {
        logger.debug('PermissionGuard: Role check failed', { reason });
      }
      return { hasAccess: false, reason };
    }

    // Check allowed roles
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(adminUser.role)) {
      const reason = `User role ${adminUser.role} not in allowed roles: ${allowedRoles.join(', ')}`;
      if (debugMode) {
        logger.debug('PermissionGuard: Allowed roles check failed', { reason });
      }
      return { hasAccess: false, reason };
    }

    // Check required permission
    if (requiredPermission) {
      const permissionResult = permissionService.hasPermission(
        adminUser.role,
        requiredPermission,
        adminSession.jurisdiction
      );

      if (!permissionResult.success || !permissionResult.data) {
        const reason = `Missing required permission: ${requiredPermission}`;
        if (debugMode) {
          logger.debug('PermissionGuard: Permission check failed', { 
            reason, 
            error: permissionResult.error 
          });
        }
        return { hasAccess: false, reason };
      }
    }

    // Check jurisdiction requirements
    const resourceJurisdiction = {
      university: requiredUniversity,
      region: requiredRegion,
      country: requiredCountry
    };

    if (requiredUniversity || requiredRegion || requiredCountry) {
      const jurisdictionResult = permissionService.hasJurisdictionAccess(
        adminUser.role,
        adminSession.jurisdiction,
        resourceJurisdiction
      );

      if (!jurisdictionResult.success || !jurisdictionResult.data) {
        const reason = `Insufficient jurisdiction access for ${
          requiredUniversity ? `university: ${requiredUniversity}` :
          requiredRegion ? `region: ${requiredRegion}` :
          requiredCountry ? `country: ${requiredCountry}` : 'resource'
        }`;
        if (debugMode) {
          logger.debug('PermissionGuard: Jurisdiction check failed', { 
            reason, 
            error: jurisdictionResult.error 
          });
        }
        return { hasAccess: false, reason };
      }
    }

    // All checks passed
    if (debugMode) {
      logger.debug('PermissionGuard: All checks passed', {
        userRole: adminUser.role,
        requiredPermission,
        resourceJurisdiction
      });
    }
    return { hasAccess: true };

  }, [
    adminUser,
    adminSession,
    requiredPermission,
    requiredRole,
    allowedRoles,
    requiredUniversity,
    requiredRegion,
    requiredCountry,
    debugMode
  ]);

  // ============================================================================
  // PERMISSION DENIED HANDLING
  // ============================================================================

  if (!permissionCheck.hasAccess) {
    // Call permission denied callback if provided
    if (onPermissionDenied && permissionCheck.reason) {
      onPermissionDenied(permissionCheck.reason);
    }

    // Log permission denial for audit purposes
    logger.warn('Permission denied', {
      userId: adminUser?.id,
      userRole: adminUser?.role,
      requiredPermission,
      requiredRole,
      allowedRoles,
      requiredUniversity,
      requiredRegion,
      requiredCountry,
      reason: permissionCheck.reason
    });

    // Render fallback component if permission info should be shown
    if (showPermissionInfo) {
      return (
        <FallbackComponent
          reason={permissionCheck.reason || 'Access denied'}
          requiredPermission={requiredPermission}
          userRole={adminUser?.role}
          showDetails={showPermissionInfo}
        />
      );
    }

    // Silent failure - don't render anything
    return null;
  }

  // ============================================================================
  // PERMISSION INFO DISPLAY (DEBUG MODE)
  // ============================================================================

  const renderPermissionInfo = () => {
    if (!debugMode || !showPermissionInfo) return null;

    return (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Permission Granted</span>
        </div>
        <div className="space-y-1 text-xs text-green-700">
          <div className="flex items-center space-x-2">
            {adminUser?.role === 'supreme_admin' ? (
              <Crown className="h-3 w-3" />
            ) : (
              <School className="h-3 w-3" />
            )}
            <span>Role: {adminUser?.role}</span>
          </div>
          {requiredPermission && (
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3" />
              <span>Permission: {requiredPermission}</span>
            </div>
          )}
          {(requiredUniversity || requiredRegion || requiredCountry) && (
            <div className="flex items-center space-x-2">
              <Lock className="h-3 w-3" />
              <span>
                Jurisdiction: {
                  requiredUniversity || requiredRegion || requiredCountry
                }
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <>
      {renderPermissionInfo()}
      {children}
    </>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * Supreme Admin Only Guard
 */
export const SupremeAdminOnly: React.FC<{
  children: React.ReactNode;
  showPermissionInfo?: boolean;
}> = ({ children, showPermissionInfo = false }) => (
  <PermissionGuard 
    requiredRole="supreme_admin" 
    showPermissionInfo={showPermissionInfo}
  >
    {children}
  </PermissionGuard>
);

/**
 * Campus Admin Guard (includes Supreme Admin)
 */
export const CampusAdminGuard: React.FC<{
  children: React.ReactNode;
  requiredUniversity?: GhanaUniversityCode;
  showPermissionInfo?: boolean;
}> = ({ children, requiredUniversity, showPermissionInfo = false }) => (
  <PermissionGuard 
    allowedRoles={['supreme_admin', 'campus_admin']}
    requiredUniversity={requiredUniversity}
    showPermissionInfo={showPermissionInfo}
  >
    {children}
  </PermissionGuard>
);

/**
 * Permission-based feature guard
 */
export const FeatureGuard: React.FC<{
  children: React.ReactNode;
  permission: AdminPermission;
  university?: GhanaUniversityCode;
  region?: GhanaRegionCode;
  showPermissionInfo?: boolean;
}> = ({ children, permission, university, region, showPermissionInfo = false }) => (
  <PermissionGuard 
    requiredPermission={permission}
    requiredUniversity={university}
    requiredRegion={region}
    showPermissionInfo={showPermissionInfo}
  >
    {children}
  </PermissionGuard>
);

/**
 * University-specific guard
 */
export const UniversityGuard: React.FC<{
  children: React.ReactNode;
  university: GhanaUniversityCode;
  showPermissionInfo?: boolean;
}> = ({ children, university, showPermissionInfo = false }) => (
  <PermissionGuard 
    requiredUniversity={university}
    showPermissionInfo={showPermissionInfo}
  >
    {children}
  </PermissionGuard>
);

export default PermissionGuard;
