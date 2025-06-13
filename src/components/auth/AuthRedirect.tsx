
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AuthRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is logged in, redirect based on role
        const userRole = user.user_metadata?.role || 'student';
        
        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'owner':
            navigate('/owner/dashboard');
            break;
          case 'agent':
            navigate('/agent/dashboard');
            break;
          default:
            navigate('/dashboard');
            break;
        }
      } else {
        // User is not logged in, redirect to landing page
        navigate('/landing');
      }
    }
  }, [user, isLoading, navigate]);

  return <LoadingSpinner />;
};

export default AuthRedirect;
