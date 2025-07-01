// Property Detail Wrapper Component
// Handles responsive switching between mobile modal and desktop bento-box layouts

import React, { useEffect, useState } from 'react';
import { Property } from '@/types/property';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import PropertyDetailModal from './PropertyDetailModal';
import PropertyDetailDesktop from './PropertyDetailDesktop';

interface PropertyDetailWrapperProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  onViewStory?: () => void;
}

const PropertyDetailWrapper: React.FC<PropertyDetailWrapperProps> = ({
  property,
  isOpen,
  onClose,
  onBookNow,
  onViewStory
}) => {
  const { isMobile, isTablet, screenWidth } = useDeviceDetection();
  const [layoutType, setLayoutType] = useState<'mobile' | 'desktop'>('desktop');

  // Determine layout based on screen size and device type
  useEffect(() => {
    // Mobile layout for screens < 1024px (includes tablets)
    // Desktop layout for screens >= 1024px
    const shouldUseMobileLayout = screenWidth < 1024 || isMobile || isTablet;
    setLayoutType(shouldUseMobileLayout ? 'mobile' : 'desktop');
  }, [isMobile, isTablet, screenWidth]);

  // Debug logging (remove in production)
  useEffect(() => {
    if (isOpen) {
      console.log('PropertyDetailWrapper:', {
        screenWidth,
        isMobile,
        isTablet,
        layoutType,
        shouldUseMobileLayout: layoutType === 'mobile'
      });
    }
  }, [isOpen, screenWidth, isMobile, isTablet, layoutType]);

  if (layoutType === 'mobile') {
    return (
      <PropertyDetailModal
        property={property}
        isOpen={isOpen}
        onClose={onClose}
        onBookNow={onBookNow}
        onViewStory={onViewStory}
      />
    );
  }

  return (
    <PropertyDetailDesktop
      property={property}
      isOpen={isOpen}
      onClose={onClose}
      onBookNow={onBookNow}
      onViewStory={onViewStory}
    />
  );
};

export default PropertyDetailWrapper;
