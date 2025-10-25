/**
 * Admin Authentication Guard Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides secure route protection for admin portal with
 * role-based access control, session validation, and comprehensive error handling
 * 
 * Technical Implementation: Integrates with AdminAuthContext for authentication,
 * validates permissions and jurisdiction, and provides fallback UI for unauthorized access
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AdminPermission, 
  AdminRoleType,
  CampusJurisdiction,
  CountryJurisdiction
} from '@/types/auth';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  RefreshCw,
  LogIn,
  Crown,
  School
} from 'lucide-react';

// ============================================================================
// ADMIN AUTH GUARD TYPES
// ============================================================================

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: AdminPermission;
  allowedRoles?: readonly AdminRoleType[];
  requiredCampus?: CampusJurisdiction;
  requiredCountry?: CountryJurisdiction;
  fallbackComponent?: React.ComponentType;
  redirectTo?: string;
}

// ============================================================================
// ADMIN AUTH GUARD COMPONENT
// ============================================================================

/**
 * Admin Authentication Guard
 * Protects routes with role-based access control and session validation
 */
const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  requiredPermission,
  allowedRoles,
  requiredCampus,
  requiredCountry,
  fallbackComponent: FallbackComponent,
  redirectTo = '/admin/login'
}) => {
  // Try to get admin auth context, handle case where provider is not available
  let adminAuthContext;
  try {
    adminAuthContext = useAdminAuth();
  } catch (error) {
    // If AdminAuthProvider is not available, show loading or redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing admin authentication...</p>
        </div>
      </div>
    );
  }

  const {
    adminUser,
    adminSession,
    loading,
    error,
    isAuthenticated,
    validateAccess,
    hasPermission,
    hasJurisdiction,
    getAdminRole,
    refreshSession,
    clearError,
    getSessionTimeRemaining
  } = adminAuthContext;

  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log('🔐 AdminAuthGuard Debug:', {
      loading,
      isAuthenticated,
      hasAdminUser: !!adminUser,
      adminUserRole: adminUser?.role,
      currentPath: location.pathname
    });
  }

  // ============================================================================
  // ACCESS VALIDATION
  // ============================================================================

  /**
   * Validate user access based on requirements
   */
  const validateUserAccess = (): { hasAccess: boolean; reason?: string } => {
    if (!isAuthenticated || !adminUser) {
      return { hasAccess: false, reason: 'Not authenticated' };
    }

    // Check required permission
    if (requiredPermission && !validateAccess(requiredPermission)) {
      return { 
        hasAccess: false, 
        reason: `Missing required permission: ${requiredPermission}` 
      };
    }

    // Check allowed roles
    if (allowedRoles && allowedRoles.length > 0) {
      const currentRole = getAdminRole();
      if (!currentRole || !allowedRoles.includes(currentRole)) {
        return { 
          hasAccess: false, 
          reason: `Role ${currentRole} not in allowed roles: ${allowedRoles.join(', ')}` 
        };
      }
    }

    // Check jurisdiction requirements
    if (requiredCampus && !hasJurisdiction(requiredCampus)) {
      return { 
        hasAccess: false, 
        reason: `No access to campus: ${requiredCampus}` 
      };
    }

    if (requiredCountry && !hasJurisdiction(undefined, requiredCountry)) {
      return { 
        hasAccess: false, 
        reason: `No access to country: ${requiredCountry}` 
      };
    }

    return { hasAccess: true };
  };

  /**
   * Handle session refresh
   */
  const handleRefreshSession = async (): Promise<void> => {
    try {
      await refreshSession();
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store current location for redirect after login
      const currentPath = location.pathname + location.search;
      navigate(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [loading, isAuthenticated, navigate, redirectTo, location]);

  // ============================================================================
  // RENDER STATES
  // ============================================================================

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Validating admin access...</p>
        </div>
      </div>
    );
  }



  // Not authenticated
  if (!isAuthenticated || !adminUser) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Admin Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please sign in with admin credentials to access this area.
            </p>
            <Button onClick={() => navigate(redirectTo)} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check access permissions
  const accessValidation = validateUserAccess();
  if (!accessValidation.hasAccess) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You don't have the required permissions to access this page.
            </p>
            
            {/* Access Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Current Role:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getAdminRole() === 'supreme_admin' ? (
                    <Crown className="h-3 w-3" />
                  ) : (
                    <School className="h-3 w-3" />
                  )}
                  {getAdminRole() === 'supreme_admin' ? 'Supreme Admin' : 'Campus Admin'}
                </Badge>
              </div>
              
              {accessValidation.reason && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {accessValidation.reason}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1"
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session expiring warning
  const sessionTimeRemaining = getSessionTimeRemaining();
  const isSessionExpiringSoon = sessionTimeRemaining < 30 * 60 * 1000; // 30 minutes

  return (
    <div className="min-h-screen">
      {/* Session Warning */}
      {isSessionExpiringSoon && (
        <Alert className="mx-4 mt-4 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Your admin session will expire in {Math.floor(sessionTimeRemaining / (1000 * 60))} minutes.
            </span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefreshSession}
              className="ml-4"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="mx-4 mt-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={clearError}
              className="ml-4"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Protected Content */}
      {children}
    </div>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * Supreme Admin Only Guard
 */
export const SupremeAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminAuthGuard allowedRoles={['supreme_admin']}>
    {children}
  </AdminAuthGuard>
);

/**
 * Campus Admin Guard
 */
export const CampusAdminGuard: React.FC<{ 
  children: React.ReactNode;
  requiredCampus?: CampusJurisdiction;
}> = ({ children, requiredCampus }) => (
  <AdminAuthGuard 
    allowedRoles={['campus_admin', 'supreme_admin']} 
    requiredCampus={requiredCampus}
  >
    {children}
  </AdminAuthGuard>
);

/**
 * Any Admin Guard
 */
export const AnyAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminAuthGuard allowedRoles={['supreme_admin', 'campus_admin']}>
    {children}
  </AdminAuthGuard>
);

export default AdminAuthGuard;
