// Registration Prompt Modal
// Displays when anonymous users hit viewing limits or try to access restricted features

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle, Users, MapPin, Heart, Shield } from 'lucide-react';

interface RegistrationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText: string;
  trigger?: 'image_limit' | 'video_limit' | 'booking_attempt' | 'location_access';
}

const RegistrationPromptModal: React.FC<RegistrationPromptModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actionText,
  trigger = 'image_limit'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRegister = () => {
    navigate('/register');
    onClose();
  };

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const getTriggerIcon = () => {
    switch (trigger) {
      case 'image_limit':
        return '📸';
      case 'video_limit':
        return '🎥';
      case 'booking_attempt':
        return '🏠';
      case 'location_access':
        return '📍';
      default:
        return '🔐';
    }
  };

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'image_limit':
        return 'You\'ve reached the limit for viewing property images';
      case 'video_limit':
        return 'You\'ve reached the limit for viewing property videos';
      case 'booking_attempt':
        return 'Booking requires a registered account';
      case 'location_access':
        return 'Exact locations require student verification';
      default:
        return 'This feature requires registration';
    }
  };



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="relative pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          
          <div className="text-center">
            <div className="text-4xl mb-3">{getTriggerIcon()}</div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </CardTitle>
            <Badge variant="outline" className="text-sm text-gray-600 bg-gray-50">
              {getTriggerMessage()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Message */}
          <p className="text-gray-600 text-center leading-relaxed">
            {message}
          </p>



          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleRegister}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {actionText}
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
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>Student-Only</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={12} />
                <span>Free</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPromptModal;
