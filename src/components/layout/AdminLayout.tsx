
/**
 * Enhanced Admin Layout with Authentication Integration
 * Apple-Grade implementation following BE CONSCIOUS standards
 *
 * Business Purpose: Provides secure layout wrapper for admin portal with role-based
 * access control, session management, and Ghana-specific admin features
 *
 * Technical Implementation: Integrates with AdminAuthContext for authentication,
 * provides loading states, error handling, and permission-based UI rendering
 *
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import AdminNavbar from './AdminNavbar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AdminPermission,
  AdminRoleType
} from '@/types/auth';
import {
  AlertTriangle,
  Shield,
  RefreshCw,
  Clock
} from 'lucide-react';

// ============================================================================
// ADMIN LAYOUT TYPES
// ============================================================================

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  requiredPermission?: AdminPermission;
  allowedRoles?: readonly AdminRoleType[];
  showRoleInfo?: boolean;
}

// ============================================================================
// ADMIN LAYOUT CONTENT COMPONENT
// ============================================================================

/**
 * Admin Layout Content - Handles authenticated admin layout
 */
const AdminLayoutContent: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  requiredPermission,
  allowedRoles,
  showRoleInfo = false
}) => {
  const {
    adminUser,
    loading,
    error,
    isAuthenticated,
    validateAccess,
    getAdminRole,
    refreshSession,
    clearError,
    getSessionTimeRemaining
  } = useAdminAuth();

  const navigate = useNavigate();

  // ============================================================================
  // AUTHENTICATION CHECKS
  // ============================================================================

  /**
   * Check if user has required permissions
   */
  const hasRequiredAccess = (): boolean => {
    if (!isAuthenticated || !adminUser) {
      return false;
    }

    // Check required permission
    if (requiredPermission && !validateAccess(requiredPermission)) {
      return false;
    }

    // Check allowed roles
    if (allowedRoles && allowedRoles.length > 0) {
      const currentRole = getAdminRole();
      if (!currentRole || !allowedRoles.includes(currentRole)) {
        return false;
      }
    }

    return true;
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
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Authenticating admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Admin Authentication Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please sign in with admin credentials to access this area.
          </p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!hasRequiredAccess()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have the required permissions to access this page.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Current Role: <Badge variant="outline">{getAdminRole()}</Badge>
            </p>
            {requiredPermission && (
              <p className="text-sm text-gray-500">
                Required Permission: <code className="text-xs bg-gray-100 px-1 rounded">{requiredPermission}</code>
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SESSION WARNING
  // ============================================================================

  const sessionTimeRemaining = getSessionTimeRemaining();
  const isSessionExpiringSoon = sessionTimeRemaining < 30 * 60 * 1000; // 30 minutes

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {/* Session Warning */}
      {isSessionExpiringSoon && (
        <Alert className="mx-4 mt-4 border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4" />
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
              Refresh Session
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

      <main className="container mx-auto px-4 py-4">
        {/* Page Header */}
        {pageTitle && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              {showRoleInfo && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {getAdminRole() === 'supreme_admin' ? 'Supreme Admin' : 'Campus Admin'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    🇬🇭 Ghana
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
};

// ============================================================================
// MAIN ADMIN LAYOUT COMPONENT
// ============================================================================

/**
 * Main Admin Layout Component with Authentication Provider
 */
const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent {...props} />
    </AdminAuthProvider>
  );
};

export default AdminLayout;
