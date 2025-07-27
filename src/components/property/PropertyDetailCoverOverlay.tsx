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

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* ✅ TOP-RIGHT: Live Indicator */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Live</span>
        </div>
      </div>

      {/* ✅ BOTTOM-LEFT: Bed Availability with Gradient */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10">
        <div className="relative">
          {/* Dark gradient background for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent rounded-lg blur-sm" />
          
          {/* Content */}
          <div className="relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5">
            <Bed className="h-4 w-4 md:h-5 md:w-5 text-white drop-shadow-lg" />
            <span className="text-white font-medium text-sm md:text-base drop-shadow-lg">
              {overall.availableBeds} of {overall.totalBeds} beds available
            </span>
          </div>
        </div>
      </div>

      {/* ✅ BOTTOM-RIGHT: Occupancy Percentage Badge */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
          <span className="text-white font-bold text-sm md:text-base">
            {occupancyPercentage}%
          </span>
        </div>
      </div>

      {/* ✅ SUBTLE GRADIENT OVERLAY for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export default PropertyDetailCoverOverlay;
