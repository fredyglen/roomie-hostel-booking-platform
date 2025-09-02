// Viewing Limit Overlay Component
// Displays blur overlay and registration prompt when viewing limits are reached

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Eye, Image, Video, Play, ArrowRight } from 'lucide-react';

interface ViewingLimitOverlayProps {
  isVisible: boolean;
  restrictionType: 'images' | 'videos' | 'stories' | 'properties';
  remainingViews: number;
  totalLimit: number;
  message: string;
  onRegisterClick: () => void;
  onLoginClick: () => void;
  className?: string;
}

const ViewingLimitOverlay: React.FC<ViewingLimitOverlayProps> = ({
  isVisible,
  restrictionType,
  remainingViews,
  totalLimit,
  message,
  onRegisterClick,
  onLoginClick,
  className = ''
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (restrictionType) {
      case 'images':
        return <Image size={24} className="text-white" />;
      case 'videos':
        return <Video size={24} className="text-white" />;
      case 'stories':
        return <Play size={24} className="text-white" />;
      case 'properties':
        return <Eye size={24} className="text-white" />;
      default:
        return <Lock size={24} className="text-white" />;
    }
  };

  const getTitle = () => {
    switch (restrictionType) {
      case 'images':
        return 'Image Viewing Limit Reached';
      case 'videos':
        return 'Video Viewing Limit Reached';
      case 'stories':
        return 'Story Viewing Limit Reached';
      case 'properties':
        return 'Property Viewing Limit Reached';
      default:
        return 'Viewing Limit Reached';
    }
  };

  const getDescription = () => {
    switch (restrictionType) {
      case 'images':
        return 'You\'ve reached your daily limit for viewing property images. Register for unlimited access to all property photos.';
      case 'videos':
        return 'You\'ve reached your daily limit for viewing property videos. Register for unlimited access to all property videos.';
      case 'stories':
        return 'You\'ve reached your daily limit for viewing property stories. Register for unlimited access to property story mode.';
      case 'properties':
        return 'You\'ve reached your daily limit for viewing properties. Register for unlimited access to browse all properties.';
      default:
        return 'Register to continue viewing properties and access all features.';
    }
  };

  const getBenefits = () => {
    const commonBenefits = [
      'Unlimited property browsing',
      'Access to all photos and videos',
      'Property story mode',
      'Detailed property information',
      'Contact property owners',
      'Save favorite properties'
    ];

    switch (restrictionType) {
      case 'images':
        return [
          'View unlimited property photos',
          'High-resolution image galleries',
          'Room and amenity photos',
          ...commonBenefits.slice(3)
        ];
      case 'videos':
        return [
          'Watch unlimited property videos',
          'Virtual property tours',
          'Neighborhood showcase videos',
          ...commonBenefits.slice(3)
        ];
      case 'stories':
        return [
          'Unlimited story mode access',
          'Interactive property exploration',
          'Immersive viewing experience',
          ...commonBenefits.slice(3)
        ];
      default:
        return commonBenefits;
    }
  };

  return (
    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-t-xl text-center">
          <div className="mb-3">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {getTitle()}
          </h3>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {totalLimit - remainingViews}/{totalLimit} views used today
          </Badge>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center leading-relaxed">
            {getDescription()}
          </p>

          {/* Benefits List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <ArrowRight size={14} className="text-primary" />
              What you'll get with registration:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {getBenefits().slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onRegisterClick}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Create Free Account
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <button
                onClick={onLoginClick}
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
                <Lock size={10} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={10} />
                <span>Student-Only</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewingLimitOverlay;
