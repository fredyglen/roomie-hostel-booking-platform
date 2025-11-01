
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';
import { Property } from '@/types/property';

// Prefetch booking flow chunks to eliminate initial flicker on navigation
const prefetchBookingFlowChunks = () => {
  // Fire-and-forget dynamic imports; Vite will cache the chunks
  // These paths must match the lazy imports declared in App.tsx and components
  void import('@/components/booking/BookingStepsContainer');
  void import('@/components/booking/EnhancedBookingForm');
  void import('@/components/booking/steps/DateSelectionStep');
  void import('@/components/booking/steps/VerificationStep');
  void import('@/components/booking/PaymentStep');
};

interface PropertyBookingCardProps {
  property: Property;
  onBook?: () => void;
  onViewStory?: () => void;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  property, onBook, onViewStory
}) => {
  const price = property.price || property.rent;
  const priceUnit = property.priceUnit || property.price_unit || 'month';

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 sticky top-4 z-30 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-xl font-bold text-blue-600">{formatCurrency(price)}</span>
          <span className="text-gray-600">/{priceUnit}</span>
        </div>
        {property.verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Icon icon="solar:check-circle-bold" className="mr-1" width={14} height={14} />
            Verified
          </span>
        )}
      </div>

      {property.availableUnits !== undefined && (
        <p className="mb-3 text-sm">{property.availableUnits} units available</p>
      )}

      <Button
        variant="default"
        className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white"
        onMouseEnter={prefetchBookingFlowChunks}
        onFocus={prefetchBookingFlowChunks}
        onClick={(e) => { prefetchBookingFlowChunks(); onBook?.(); }}
      >
        Book Now
      </Button>

      {onViewStory && (
        <Button
          variant="outline"
          className="w-full mb-3 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={onViewStory}
        >
          <Icon icon="solar:play-circle-bold" className="mr-2" width={16} height={16} />
          View Story
        </Button>
      )}

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
