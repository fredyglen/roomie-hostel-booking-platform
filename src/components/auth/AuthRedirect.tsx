
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

const AuthRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasRedirectedRef = useRef(false);

  console.log('🔄 AuthRedirect rendered', { loading, user: !!user, userRole: user?.role, hasRedirected: hasRedirectedRef.current });
  logger.info('AuthRedirect rendered', { loading, user: !!user, userRole: user?.role });

  useEffect(() => {
    console.log('🔄 AuthRedirect useEffect running', { loading, user: !!user, userRole: user?.role });
    logger.info('AuthRedirect useEffect running', { loading, user: !!user, userRole: user?.role });

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set up timeout fallback to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      if (loading && !hasRedirectedRef.current) {
        console.warn('🚨 Auth loading timeout - forcing navigation to prevent infinite loading');
        logger.warn('Auth loading timeout - forcing navigation');
        hasRedirectedRef.current = true;
        
        if (user?.role) {
          // User exists but was stuck loading, navigate based on role
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
              navigate('/welcome', { replace: true });
          }
        } else {
          // No user or user without role, go to welcome
          navigate('/welcome', { replace: true });
        }
      }
    }, 5000); // 5 second timeout

    if (!loading && !hasRedirectedRef.current) {
      if (user && user.role) {
        console.log(`✅ AuthRedirect: User authenticated with role ${user.role}. Redirecting...`);
        logger.info(`AuthRedirect: User authenticated with role ${user.role}. Redirecting...`);
        hasRedirectedRef.current = true;
        
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
            console.warn('⚠️ AuthRedirect: Unknown user role, falling back to welcome.', { userRole: user.role });
            logger.warn('AuthRedirect: Unknown user role, falling back to welcome.', { userRole: user.role });
            navigate('/welcome', { replace: true });
        }
      } else if (!user) {
        console.log('🚫 AuthRedirect: User not authenticated. Redirecting to welcome.');
        logger.info('AuthRedirect: User not authenticated. Redirecting to welcome.');
        hasRedirectedRef.current = true;
        navigate('/welcome', { replace: true });
      } else {
        console.log('⏳ AuthRedirect: User exists but role not populated. Waiting...', { user: !!user, role: user?.role });
        logger.info('AuthRedirect: User object exists but role is not yet populated. Waiting...', { user });
      }
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [user, loading, navigate]);

  if (loading || !user || !user.role) {
    console.log('⏳ AuthRedirect: Showing loading spinner.', { loading, user: !!user, userRole: user?.role });
    logger.debug('AuthRedirect: Showing loading spinner.', { loading, user: !!user, userRole: user?.role });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Preparing your dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">This should only take a moment</p>
        </div>
      </div>
    );
  }

  console.log('✅ AuthRedirect: Rendering null (should have redirected).', { loading, user: !!user, userRole: user?.role });
  logger.debug('AuthRedirect: Rendering null (should have redirected).', { loading, user: !!user, userRole: user?.role });
  return null;
};

export default AuthRedirect;
