/**
 * Login Redirect Component
 * Handles post-login redirects based on user role
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { logger } from '@/utils/enhanced-logger';

export const LoginRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      logger.debug('Login redirect - user role detected', { 
        userId: user.id, 
        role: user.role,
        userObject: user 
      });

      // Redirect based on user role
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'owner':
        case 'agent':
          navigate('/owner/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          logger.warn('Unknown user role, redirecting to welcome', { role: user.role });
          navigate('/', { replace: true });
      }
    } else if (!loading && !user) {
      logger.debug('Redirecting unauthenticated user to welcome page');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default LoginRedirect;
