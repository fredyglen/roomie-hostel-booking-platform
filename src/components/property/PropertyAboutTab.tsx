
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
            {roomTypes.map((roomType, index) => {
              // Convert room type codes to Ghana hostel terminology
              const getDisplayName = (type: string) => {
                switch (type) {
                  case '1_in_a_room': return '1 in a room';
                  case '2_in_a_room': return '2 in a room';
                  case '3_in_a_room': return '3 in a room';
                  case '4_in_a_room': return '4 in a room';
                  case 'single_room': return 'Single room';
                  case 'shared_room': return 'Shared room';
                  case 'studio': return 'Studio';
                  case '1_bedroom': return '1 bedroom';
                  case '2_bedroom': return '2 bedroom';
                  case '3_bedroom': return '3 bedroom';
                  default: return type.replace(/_/g, ' ');
                }
              };

              return (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {getDisplayName(roomType)}
                </span>
              );
            })}
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
