// Time Limit Overlay Component
// Displays when anonymous users reach the 30-second time limit

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, Users, CheckCircle, ArrowRight, Timer } from 'lucide-react';

interface TimeLimitOverlayProps {
  isVisible: boolean;
  timeRemaining: number;
  isExpired: boolean;
  restrictionMessage: string;
  onClose?: () => void;
}

const TimeLimitOverlay: React.FC<TimeLimitOverlayProps> = ({
  isVisible,
  timeRemaining,
  isExpired,
  restrictionMessage,
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

  const getFormattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl border-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-4">
            {isExpired ? (
              <Clock size={32} className="text-red-600" />
            ) : (
              <Timer size={32} className="text-orange-600" />
            )}
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-900 mb-2">
            {isExpired ? 'Time Limit Reached' : 'Preview Time Remaining'}
          </CardTitle>
          
          {!isExpired && (
            <Badge variant="outline" className="text-lg font-mono bg-orange-50 text-orange-700 border-orange-200">
              {getFormattedTime()}
            </Badge>
          )}
          
          {isExpired && (
            <Badge variant="destructive" className="text-sm">
              30-second preview expired
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Message */}
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed">
              {isExpired 
                ? restrictionMessage
                : "You're browsing ROOMi as a guest. Register now to unlock unlimited access to all properties and features."
              }
            </p>
          </div>

          {/* Benefits List */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <ArrowRight size={14} className="text-primary" />
              Unlock with free registration:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Unlimited property browsing',
                'Advanced search and filters',
                'Save favorite properties',
                'Contact property owners',
                'Book accommodations',
                'Access to all photos and videos'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Message for Expired */}
          {isExpired && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <Shield size={14} />
                <span className="font-medium">
                  Registration required to continue browsing
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
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
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield size={10} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={10} />
                <span>Student-Only</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={10} />
                <span>Free Forever</span>
              </div>
            </div>
          </div>

          {/* Time Limit Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {isExpired 
                ? 'Preview time resets after registration'
                : 'This preview helps you experience ROOMi before registering'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeLimitOverlay;
