
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

const AuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect based on role
        const userRole = (user as any).role || 'student';
        let targetPath = '/student/dashboard';

        logger.debug('User role detected', {
          userId: user.id,
          role: userRole,
          userObject: user
        });

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
            targetPath = '/student/properties';
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
  }, [user, loading, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      padding: '20px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f0f0f0',
        borderTop: '3px solid #0f68fd',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }}></div>
      <p style={{
        color: '#666',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        {loading ? 'Loading your account...' : 'Redirecting...'}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthRedirect;
