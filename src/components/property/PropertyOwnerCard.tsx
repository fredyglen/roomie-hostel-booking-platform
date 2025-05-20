
import React from 'react';
import { Home } from 'lucide-react';

interface PropertyOwnerProps {
  name: string;
  verified?: boolean;
  responseRate?: string;
}

const PropertyOwnerCard: React.FC<PropertyOwnerProps> = ({
  name, verified, responseRate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Hosted by {name}</h2>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
          <Home className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          {verified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Verified
            </span>
          )}
          {responseRate && <p className="mt-1">Response rate: {responseRate}</p>}
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerCard;
