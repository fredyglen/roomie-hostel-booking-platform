
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';

interface PropertyBookingCardProps {
  id: string;
  price: number;
  priceUnit: string;
  verified?: boolean;
  availableUnits?: number;
  onBookNow?: () => void;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  id, price, priceUnit, verified, availableUnits, onBookNow
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(price)}</span>
          <span className="text-gray-600">/{priceUnit}</span>
        </div>
        {verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Icon icon="solar:check-circle-bold" className="mr-1" width={14} height={14} />
            Verified
          </span>
        )}
      </div>
      
      {availableUnits !== undefined && (
        <p className="mb-4 text-sm">{availableUnits} units available</p>
      )}
      
      <Button 
        variant="default" 
        className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onBookNow}
      >
        Book Now
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
