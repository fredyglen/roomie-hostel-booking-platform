/**
 * Property Detail Cover Overlay Component
 * 
 * PRODUCTION-GRADE cover image overlay for property detail pages.
 * Implements native mobile app design patterns with real-time information.
 * Designed for both mobile and desktop with Apple-level polish.
 */

import React from 'react';
import { useRealTimeBedAvailability } from '@/hooks/useRealTimeBedAvailability';
import { Bed } from 'lucide-react';

interface PropertyDetailCoverOverlayProps {
  readonly propertyId: string;
  readonly className?: string;
}

/**
 * ✅ PRODUCTION-GRADE: Cover Image Overlay for Property Detail Pages
 */
const PropertyDetailCoverOverlay: React.FC<PropertyDetailCoverOverlayProps> = ({
  propertyId,
  className = ''
}) => {
  const { availability, isLoading, error } = useRealTimeBedAvailability({
    propertyId,
    enableRealTimeUpdates: true,
    refreshInterval: 30000
  });

  // Don't render anything if loading or error
  if (isLoading || error || !availability) {
    return null;
  }

  const { overall } = availability;
  const occupancyPercentage = Math.round(overall.occupancyRate * 100);

  // Get availability status color for percentage background
  const getAvailabilityColor = () => {
    if (overall.availableBeds === 0) return 'bg-red-500';
    if (occupancyPercentage > 80) return 'bg-orange-500';
    if (occupancyPercentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* ✅ DEEP GRADIENT FROM BOTTOM - Your Vision */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* ✅ TOP-RIGHT: Green Live Dot ALONE - No Component */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
      </div>

      {/* ✅ VERY BOTTOM: All Text on Dark Gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="flex items-end justify-between">
          {/* ✅ BOTTOM-LEFT: Bed Availability Text */}
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 md:h-5 md:w-5 text-white drop-shadow-lg" />
            <span className="text-white font-medium text-sm md:text-base drop-shadow-lg">
              {overall.availableBeds} of {overall.totalBeds} beds available
            </span>
          </div>

          {/* ✅ BOTTOM-RIGHT: Percentage with Real-time Availability Color */}
          <div className={`w-12 h-12 md:w-14 md:h-14 ${getAvailabilityColor()} rounded-full flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
              {occupancyPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailCoverOverlay;
