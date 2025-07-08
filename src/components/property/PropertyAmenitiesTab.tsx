
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PropertyAmenitiesTabProps {
  amenities: string[];
}

const PropertyAmenitiesTab: React.FC<PropertyAmenitiesTabProps> = ({ amenities }) => {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Amenities</h3>
      <div className="grid grid-cols-2 gap-y-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenitiesTab;
