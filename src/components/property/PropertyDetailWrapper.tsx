// Property Detail Wrapper Component
// Handles responsive switching between mobile modal and desktop bento-box layouts

import React, { useEffect, useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import PropertyDetailModal from './PropertyDetailModal';
import PropertyDetailDesktop from './PropertyDetailDesktop';

// Property interface for detail components
interface PropertyDetailData {
  id: string | number;
  title: string;
  rent?: number;
  location?: string | { address?: string; city?: string };
  images?: string[];
  amenities?: string[] | Array<{ name: string }>;
  propertyType?: string;
  genderRestriction?: string;
  distanceToCampus?: string;
  distance_to_campus?: string;
  rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupants?: number;
  description?: string;
}

interface PropertyDetailWrapperProps {
  property: PropertyDetailData;
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
    // Mobile layout for screens < 768px (true mobile devices)
    // Desktop layout for screens >= 768px (tablets and desktop)
    // Following Apple-grade responsive design standards from BE CONSCIOUS
    const shouldUseMobileLayout = screenWidth < 768 || isMobile;
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
