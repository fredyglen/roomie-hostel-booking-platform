import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import MultiStepRegistration from '@/components/auth/MultiStepRegistration';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student/properties');
      } else if (user.role === 'owner' || user.role === 'admin') {
        navigate('/owner/dashboard');
      }
    }
  }, [user, navigate]);

  return <MultiStepRegistration />;
};

export default Register;
