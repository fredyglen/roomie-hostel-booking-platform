
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PropertyAmenitiesTabProps {
  amenities: string[];
}

const PropertyAmenitiesTab: React.FC<PropertyAmenitiesTabProps> = ({ amenities }) => {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Amenities</h3>
      {amenities && amenities.length > 0 ? (
        <div className="grid grid-cols-2 gap-y-2">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No amenities listed yet.</p>
      )}
    </div>
  );
};

export default PropertyAmenitiesTab;
