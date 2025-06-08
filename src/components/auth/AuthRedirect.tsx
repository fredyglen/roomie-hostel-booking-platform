import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

const AuthRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  logger.info('AuthRedirect rendered', { loading, user: !!user, userRole: user?.role });

  useEffect(() => {
    logger.info('AuthRedirect useEffect running', { loading, user: !!user, userRole: user?.role });

    if (!loading && user && user.role) {
      logger.info(`AuthRedirect: User authenticated with role ${user.role}. Redirecting...`);
      switch (user.role) {
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'owner':
          navigate('/owner/dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          logger.warn('AuthRedirect: Unknown user role, falling back to welcome.', { userRole: user.role });
          navigate('/welcome', { replace: true });
      }
    } else if (!user) {
      logger.info('AuthRedirect: User not authenticated. Redirecting to welcome.');
      navigate('/welcome', { replace: true });
    } else {
      logger.info('AuthRedirect: User object exists but role is not yet populated. Waiting...', { user });
    }
  }, [user, loading, navigate]);

  if (loading || !user || !user.role) {
    logger.debug('AuthRedirect: Showing loading spinner.', { loading, user: !!user, userRole: user?.role });
    return <LoadingSpinner />;
  }

  logger.debug('AuthRedirect: Rendering null (should have redirected).', { loading, user: !!user, userRole: user?.role });
  return null;
};

export default AuthRedirect; 