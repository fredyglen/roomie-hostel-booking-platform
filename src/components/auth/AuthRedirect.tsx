
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

const AuthRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is logged in, redirect based on role
        // Check multiple possible locations for the role
        const userRole = (user as any).role || user.user_metadata?.role || 'student';
        let targetPath = '/student/dashboard';

        switch (userRole) {
          case 'admin':
            targetPath = '/admin/dashboard';
            break;
          case 'owner':
          case 'agent':
            targetPath = '/owner/dashboard';
            break;
          case 'student':
          default:
            targetPath = '/student/dashboard';
            break;
        }

        logger.debug('Redirecting authenticated user', {
          userId: user.id,
          role: userRole,
          targetPath
        });

        navigate(targetPath);
      } else {
        // User is not logged in, redirect to welcome page first
        logger.debug('Redirecting unauthenticated user to welcome page');
        navigate('/welcome');
      }
    }
  }, [user, isLoading, navigate]);

  return <LoadingSpinner />;
};

export default AuthRedirect;
