
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PropertyAmenitiesTabProps {
  amenities: string[];
}

const PropertyAmenitiesTab: React.FC<PropertyAmenitiesTabProps> = ({ amenities }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
      <div className="grid grid-cols-2 gap-y-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenitiesTab;
