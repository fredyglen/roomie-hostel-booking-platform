
import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

interface PropertyHeaderProps {
  id: string;
  title: string;
  address: string;
  distanceToCampus?: string;
  rating?: number;
  reviewCount?: number;
  onViewStory?: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  id, title, address, distanceToCampus, rating, reviewCount, onViewStory
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <div className="flex space-x-2">
          {onViewStory && (
            <Button 
              onClick={onViewStory} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Icon icon="solar:video-frame-play-linear" className="text-blue-500" width={16} height={16} />
              View Story
            </Button>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-2">{address}</p>
      <div className="flex items-center text-sm text-gray-500">
        {distanceToCampus && (
          <span className="mr-4 flex items-center">
            <Icon icon="solar:map-point-linear" className="mr-1 text-blue-500" width={16} height={16} />
            {distanceToCampus} to campus
          </span>
        )}
        {rating && reviewCount && (
          <span className="flex items-center">
            <Icon icon="solar:star-bold" className="mr-1 text-yellow-400" width={16} height={16} />
            {rating} ({reviewCount} reviews)
          </span>
        )}
      </div>
    </div>
  );
};

export default PropertyHeader;
