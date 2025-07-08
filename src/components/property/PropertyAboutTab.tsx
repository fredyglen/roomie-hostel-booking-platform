
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
    <div className="space-y-3">
      <h2 className="text-lg font-bold mb-2">About this property</h2>
      <p className="text-gray-700 text-sm">{description}</p>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {type && (
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">Type</div>
            <div className="font-medium text-sm">{type}</div>
          </div>
        )}

        {location && (
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">Location</div>
            <div className="font-medium text-sm">{location}</div>
          </div>
        )}

        {availableUnits !== undefined && (
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">Available Units</div>
            <div className="font-medium text-sm">{availableUnits}</div>
          </div>
        )}

        {distanceToCampus && (
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">Distance</div>
            <div className="font-medium text-sm">{distanceToCampus}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyAboutTab;
