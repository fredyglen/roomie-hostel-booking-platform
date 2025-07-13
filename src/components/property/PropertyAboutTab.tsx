
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface PropertyAboutTabProps {
  description: string;
  type?: string;
  location?: string;
  availableUnits?: number;
  distanceToCampus?: string;
  goodToKnow?: string;
  roomTypes?: string[];
  nearestUniversity?: string;
}

const PropertyAboutTab: React.FC<PropertyAboutTabProps> = ({
  description, type, location, availableUnits, distanceToCampus, goodToKnow, roomTypes, nearestUniversity
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

        {nearestUniversity && (
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500">Nearest University</div>
            <div className="font-medium text-sm">{nearestUniversity}</div>
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

      {/* Room Types Section */}
      {roomTypes && roomTypes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Available Room Types</h3>
          <div className="flex flex-wrap gap-2">
            {roomTypes.map((roomType, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {roomType.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Good to Know Section */}
      {goodToKnow && (
        <Card className="border-blue-200 bg-blue-50 mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-800 text-base">
              <Info className="w-5 h-5 mr-2" />
              Good to Know
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 leading-relaxed text-sm">
              {goodToKnow}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyAboutTab;
