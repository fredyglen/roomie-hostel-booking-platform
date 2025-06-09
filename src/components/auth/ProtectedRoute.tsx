import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Loader } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  preserveLocation?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  redirectTo,
  preserveLocation = false
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    const state = preserveLocation ? { from: location.pathname + location.search } : undefined;
    return <Navigate to="/login" state={state} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Use custom redirect path if provided
    if (redirectTo) {
      return <Navigate to={redirectTo} />;
    }

    // Role-based redirects - more specific routing
    switch (user.role) {
      case 'student':
        return <Navigate to="/student/properties" />;
      case 'owner':
        return <Navigate to="/owner/dashboard" />;
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and has the correct role, render the children
  return <>{children}</>;
};
