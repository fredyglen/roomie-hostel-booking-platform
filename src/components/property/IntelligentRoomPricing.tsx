/**
 * Intelligent Room Pricing Component
 *
 * PRODUCTION-GRADE room pricing display that intelligently shows
 * room types and pricing in a compact, scannable format.
 * Replaces giant cards with smart, mobile-optimized design.
 */

import React from 'react';
import { usePropertyRoomTypes, useRoomTypeSelection } from '@/hooks/usePropertyRoomTypes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { type RoomTypeOption } from '@/services/roomTypesService';

interface IntelligentRoomPricingProps {
  readonly propertyId: string;
  readonly propertyCategory?: string;
  readonly className?: string;
  readonly onRoomTypeSelect?: (roomType: RoomTypeOption) => void;
}

/**
 * ✅ PRODUCTION-GRADE: Intelligent Room Pricing Display
 */
const IntelligentRoomPricing: React.FC<IntelligentRoomPricingProps> = ({
  propertyId,
  propertyCategory,
  className = '',
  onRoomTypeSelect
}) => {
  const { roomTypes, isLoading, error } = usePropertyRoomTypes({ propertyId, propertyCategory, enableFallback: true });
  const { selectedRoomType, selectedRoomTypeData, handleRoomTypeChange } = useRoomTypeSelection(roomTypes);

  // Emit selected room type to parent when it changes (initial and subsequent)
  React.useEffect(() => {
    if (selectedRoomTypeData && onRoomTypeSelect) {
      onRoomTypeSelect(selectedRoomTypeData);
    }
  }, [selectedRoomTypeData, onRoomTypeSelect]);

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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select room type</label>
        <Select
          value={selectedRoomType}
          onValueChange={(value) => {
            handleRoomTypeChange(value);
            const selected = roomTypes.find((rt) => rt.value === value);
            if (selected && onRoomTypeSelect) onRoomTypeSelect(selected);
          }}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Choose type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((rt) => (
              <SelectItem key={rt.value} value={rt.value}>
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IntelligentRoomPricing;
