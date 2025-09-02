import React from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Navigate } from 'react-router-dom';
import { ErrorHandler } from '@/utils/ErrorHandler';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate profile based on user role
  const userRole = user.user_metadata?.role || 'student';
  
  ErrorHandler.log(`Redirecting user to ${userRole} profile`, { userId: user.id, role: userRole });

  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin/profile" replace />;
    case 'owner':
      return <Navigate to="/owner/profile" replace />;
    case 'agent':
      return <Navigate to="/agent/profile" replace />;
    case 'student':
    default:
      return <Navigate to="/student/profile" replace />;
  }
};

export default Profile;
