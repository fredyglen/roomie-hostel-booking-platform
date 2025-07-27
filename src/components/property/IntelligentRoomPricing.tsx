/**
 * Intelligent Room Pricing Component
 * 
 * PRODUCTION-GRADE room pricing display that intelligently shows
 * room types and pricing in a compact, scannable format.
 * Replaces giant cards with smart, mobile-optimized design.
 */

import React from 'react';
import { usePropertyRoomTypes } from '@/hooks/usePropertyRoomTypes';
import { Badge } from '@/components/ui/badge';
import { Bed, Users } from 'lucide-react';

interface IntelligentRoomPricingProps {
  readonly propertyId: string;
  readonly className?: string;
}

/**
 * ✅ PRODUCTION-GRADE: Intelligent Room Pricing Display
 */
const IntelligentRoomPricing: React.FC<IntelligentRoomPricingProps> = ({
  propertyId,
  className = ''
}) => {
  const { roomTypes, isLoading, error } = usePropertyRoomTypes(propertyId);

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error or no data state
  if (error || !roomTypes || roomTypes.length === 0) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-gray-500 text-sm">Room pricing information unavailable</p>
      </div>
    );
  }

  // Generate smart room display text
  const getSmartRoomDisplay = () => {
    const occupancyNumbers = roomTypes
      .map(room => {
        const match = room.label.match(/(\d+)\s+in\s+a\s+room/i);
        return match ? parseInt(match[1]) : 1;
      })
      .sort((a, b) => a - b);

    if (occupancyNumbers.length === 0) return "Room options available";

    // Check if it's sequential (1,2,3,4,5,6)
    const isSequential = occupancyNumbers.every((num, index) => 
      index === 0 || num === occupancyNumbers[index - 1] + 1
    );

    if (isSequential && occupancyNumbers.length > 2) {
      return `${occupancyNumbers[0]}-${occupancyNumbers[occupancyNumbers.length - 1]} person rooms available`;
    } else {
      return `${occupancyNumbers.join(', ')} in a room available`;
    }
  };

  // Format price display
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get room type icon
  const getRoomTypeIcon = (occupants: number) => {
    if (occupants === 1) return '🏠';
    if (occupants === 2) return '👥';
    if (occupants === 3) return '👨‍👩‍👧';
    if (occupants >= 4) return '👨‍👩‍👧‍👦';
    return '🏠';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Smart Room Display Header */}
      <div className="flex items-center gap-2">
        <Bed className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {getSmartRoomDisplay()}
        </span>
      </div>

      {/* Compact Pricing Grid */}
      <div className="space-y-2">
        {roomTypes.map((room, index) => {
          const occupants = (() => {
            const match = room.label.match(/(\d+)\s+in\s+a\s+room/i);
            return match ? parseInt(match[1]) : 1;
          })();

          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Left side: Room info */}
              <div className="flex items-center gap-3">
                {/* Room type icon */}
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm">
                    {getRoomTypeIcon(occupants)}
                  </span>
                </div>

                {/* Room details */}
                <div>
                  <span className="font-medium text-gray-900 text-sm">
                    {room.label}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>{room.bedsAvailable} beds available</span>
                  </div>
                </div>
              </div>

              {/* Right side: Price */}
              <div className="text-right">
                <div className="font-bold text-primary text-sm">
                  {formatPrice(room.price)}
                </div>
                <div className="text-xs text-gray-500">
                  per semester
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 text-center">
        Prices shown are per student per semester
      </div>
    </div>
  );
};

export default IntelligentRoomPricing;
