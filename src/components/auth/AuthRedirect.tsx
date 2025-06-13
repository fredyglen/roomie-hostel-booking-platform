
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
        const userRole = user.user_metadata?.role || 'student';
        let targetPath = '/dashboard';
        
        switch (userRole) {
          case 'admin':
            targetPath = '/admin/dashboard';
            break;
          case 'owner':
            targetPath = '/owner/dashboard';
            break;
          case 'agent':
            targetPath = '/agent/dashboard';
            break;
          default:
            targetPath = '/dashboard';
            break;
        }
        
        logger.debug('Redirecting authenticated user', { 
          userId: user.id,
          role: userRole,
          targetPath 
        });
        
        navigate(targetPath);
      } else {
        // User is not logged in, redirect to landing page
        logger.debug('Redirecting unauthenticated user to landing page');
        navigate('/landing');
      }
    }
  }, [user, isLoading, navigate]);

  return <LoadingSpinner />;
};

export default AuthRedirect;
