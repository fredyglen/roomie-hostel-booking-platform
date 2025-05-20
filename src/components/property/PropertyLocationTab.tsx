
import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyLocationTabProps {
  address: string;
  distanceToCampus?: string;
}

const PropertyLocationTab: React.FC<PropertyLocationTabProps> = ({
  address, distanceToCampus
}) => {
  return (
    <div>
      <div className="flex items-start mb-4">
        <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium mb-1">Address</h3>
          <p className="text-gray-700">{address}</p>
          {distanceToCampus && (
            <p className="text-gray-600 text-sm mt-1">{distanceToCampus} to campus</p>
          )}
        </div>
      </div>
      <div className="bg-gray-100 h-48 rounded-md flex items-center justify-center mt-4">
        <p className="text-gray-500">Map view coming soon</p>
      </div>
    </div>
  );
};

export default PropertyLocationTab;
