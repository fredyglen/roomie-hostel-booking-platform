
import React from 'react';
import Button from '@/components/common/Button';
import { Property } from '@/types/property';

interface StoryDetailsSheetProps {
  property: Property;
  onSwipeDown: () => void;
  onBookNow: () => void;
}

const StoryDetailsSheet: React.FC<StoryDetailsSheetProps> = ({
  property,
  onSwipeDown,
  onBookNow,
}) => {
  // Helper functions to safely extract data
  const getAmenityText = (amenity: string | { id: string; name: string }): string => {
    return typeof amenity === 'string' ? amenity : amenity.name;
  };

  const getAmenitiesArray = (amenities: (string | { id: string; name: string })[]): string[] => {
    return amenities.map(getAmenityText);
  };

  const safeAmenities = property.amenities ? getAmenitiesArray(property.amenities) : [];
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up h-[70%] overflow-y-auto">
      <div 
        className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6 cursor-pointer"
        onClick={onSwipeDown}
      ></div>
      
      <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
      <p className="text-gray-600 mb-2">{property.address}</p>
      <div className="flex items-center mb-4">
        <span className="text-xl font-bold text-roomi-blue mr-1">${property.price}</span>
        <span className="text-gray-600">/{property.priceUnit}</span>
      </div>
      
      {property.description && (
        <p className="text-gray-700 mb-6">{property.description}</p>
      )}
      
      {safeAmenities && safeAmenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {safeAmenities.map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="sticky bottom-0 pt-4 bg-white">
        <Button 
          variant="primary" 
          fullWidth
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default StoryDetailsSheet;
