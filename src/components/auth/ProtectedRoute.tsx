import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Loader } from '@/components/ui/loader';
import { UserRole } from '@/types/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check for development bypass user
  const devBypassUser = process.env.NODE_ENV === 'development' ? (window as any).__DEV_BYPASS_USER__ : null;
  const effectiveUser = user || devBypassUser;

  // Show loading spinner while auth is being determined
  if (loading && !devBypassUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated (and no dev bypass)
  if (!effectiveUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role if specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(effectiveUser.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Log development bypass usage
  if (devBypassUser && process.env.NODE_ENV === 'development') {
    console.log('🚨 DEV BYPASS: Using development bypass user for protected route', {
      route: location.pathname,
      bypassUser: devBypassUser.email,
      role: devBypassUser.role
    });
  }

  return <>{children}</>;
}
