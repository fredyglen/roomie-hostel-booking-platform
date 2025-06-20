
/**
 * Property Booking Card Component for ROOMi Platform
 * Displays booking information and actions with proper type safety
 *
 * @fileoverview Apple-Level Property Booking Card Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/lib/utils';
import { Property } from '@/types/property';

interface PropertyBookingCardProps {
  property: Property;
  onBook?: () => void;
}

/**
 * Property Booking Card Component
 * Displays pricing and booking actions using correct Property interface
 */
const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  property, onBook
}) => {
  // Extract data using the correct Property interface
  const { price, verificationStatus, features, status } = property;

  // Calculate available units (placeholder - would come from booking system)
  const availableUnits = features.bedrooms; // Simplified calculation

  // Check if property is verified
  const isVerified = verificationStatus === 'verified';

  // Check if property is available for booking
  const isAvailable = status === 'active';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(price.amount)}
          </span>
          <span className="text-gray-600">/{price.period}</span>
        </div>
        {isVerified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Icon icon="solar:check-circle-bold" className="mr-1" width={14} height={14} />
            Verified
          </span>
        )}
      </div>

      {availableUnits > 0 && (
        <p className="mb-4 text-sm text-gray-600">
          {availableUnits} {availableUnits === 1 ? 'unit' : 'units'} available
        </p>
      )}

      {/* Pricing breakdown */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Base price</span>
          <span>{formatCurrency(price.amount)}</span>
        </div>
        {price.isNegotiable && (
          <div className="text-xs text-green-600 mt-1">
            💬 Price negotiable
          </div>
        )}
      </div>

      <Button
        variant="default"
        className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onBook}
        disabled={!isAvailable}
      >
        {isAvailable ? 'Book Now' : 'Not Available'}
      </Button>

      <Button
        variant="outline"
        className="w-full text-gray-400 border-gray-300 cursor-not-allowed"
        disabled
      >
        Request a Tour (Coming Soon)
      </Button>
    </div>
  );
};

export default PropertyBookingCard;
