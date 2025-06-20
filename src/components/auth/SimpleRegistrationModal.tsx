// Simple Registration Modal
// Shows after anonymous user time limit expires

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface SimpleRegistrationModalProps {
  isVisible: boolean;
  onClose?: () => void;
}

const SimpleRegistrationModal: React.FC<SimpleRegistrationModalProps> = ({
  isVisible,
  onClose
}) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleRegister = () => {
    navigate('/register');
    if (onClose) onClose();
  };

  const handleLogin = () => {
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="relative pb-4">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
          
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              Register to Continue
            </CardTitle>
            <p className="text-gray-600">
              Create a free account to continue browsing properties
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleRegister}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Create Free Account
          </Button>
          
          <div className="text-center">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <button
              onClick={handleLogin}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleRegistrationModal;
