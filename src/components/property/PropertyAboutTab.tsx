
import React from 'react';

interface PropertyAboutTabProps {
  description: string;
  type?: string;
  location?: string;
  availableUnits?: number;
  distanceToCampus?: string;
}

const PropertyAboutTab: React.FC<PropertyAboutTabProps> = ({
  description, type, location, availableUnits, distanceToCampus
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">About this property</h2>
      <p className="text-gray-700">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {type && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Type</div>
            <div className="font-medium">{type}</div>
          </div>
        )}
        
        {location && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Location</div>
            <div className="font-medium">{location}</div>
          </div>
        )}
        
        {availableUnits !== undefined && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Available Units</div>
            <div className="font-medium">{availableUnits}</div>
          </div>
        )}
        
        {distanceToCampus && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Distance</div>
            <div className="font-medium">{distanceToCampus}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAboutTab;
