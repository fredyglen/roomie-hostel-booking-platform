
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

interface PropertyBookingCardProps {
  id: string;
  price: number;
  priceUnit: string;
  verified?: boolean;
  availableUnits?: number;
}

const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  id, price, priceUnit, verified, availableUnits
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold text-blue-600">₵{price}</span>
          <span className="text-gray-600">/{priceUnit}</span>
        </div>
        {verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Verified
          </span>
        )}
      </div>
      
      {availableUnits !== undefined && (
        <p className="mb-4 text-sm">{availableUnits} units available</p>
      )}
      
      <Link to={`/student/property/${id}/book`} className="block mb-4">
        <Button variant="primary" fullWidth>
          Book Now
        </Button>
      </Link>
      
      <Button variant="outline" fullWidth>
        Request a Tour
      </Button>
    </div>
  );
};

export default PropertyBookingCard;
