
import React from 'react';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { formatCurrency } from '@/utils/currency';

interface StoryDetailsSheetEnhancedProps {
  property: Property;
  onClose: () => void;
  onBookNow: () => void;
}

const StoryDetailsSheetEnhanced: React.FC<StoryDetailsSheetEnhancedProps> = ({
  property,
  onClose,
  onBookNow,
}) => {
  // Helper functions to safely extract data
  const getLocationText = (location: string | { city: string; state: string; address: string }): string => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.address}, ${location.city}, ${location.state}`;
  };

  const getAmenityText = (amenity: string | { id: string; name: string }): string => {
    return typeof amenity === 'string' ? amenity : amenity.name;
  };

  const getAmenitiesArray = (amenities: (string | { id: string; name: string })[]): string[] => {
    return amenities.map(getAmenityText);
  };

  const getPriceText = (): string => {
    const price = property.price || property.rent;
    return typeof price === 'number' ? price.toString() : price.toString();
  };

  // Safe data extraction
  const safeData = {
    price: getPriceText(),
    amenities: property.amenities ? getAmenitiesArray(property.amenities) : [],
    location: getLocationText(property.location),
    priceUnit: property.priceUnit || property.price_unit || 'month'
  };

  return (
    <div className="h-full bg-white rounded-t-3xl p-6 overflow-y-auto">
      <div 
        className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6 cursor-pointer"
        onClick={onClose}
      ></div>
      
      <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
      <p className="text-gray-600 mb-2">{safeData.location}</p>
      <div className="flex items-center mb-4">
        <span className="text-xl font-bold text-blue-600 mr-1">{formatCurrency(Number(safeData.price))}</span>
        <span className="text-gray-600">/{safeData.priceUnit}</span>
      </div>
      
      {property.description && (
        <p className="text-gray-700 mb-6">{property.description}</p>
      )}
      
      {safeData.amenities && safeData.amenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {safeData.amenities.map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="sticky bottom-0 pt-4 bg-white">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default StoryDetailsSheetEnhanced;
