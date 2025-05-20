
import React from 'react';
import Button from '@/components/common/Button';

interface StoryDetailsSheetEnhancedProps {
  showDetails: boolean;
  propertyDetails: {
    id: string;
    title: string;
    type: string;
    price: number;
    priceUnit: string;
    address: string;
    distanceToCampus: string;
    amenities: string[];
    description: string;
    rating?: number;
    reviewCount?: number;
  };
  onBookNow: () => void;
}

const StoryDetailsSheetEnhanced: React.FC<StoryDetailsSheetEnhancedProps> = ({
  showDetails,
  propertyDetails,
  onBookNow
}) => {
  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transition-transform duration-300 transform ${
        showDetails ? 'translate-y-0' : 'translate-y-full'
      } z-30 max-h-[75vh] overflow-y-auto`} // max-height set to 75vh as requested
    >
      <div className="w-16 h-1 bg-gray-300 rounded mx-auto my-3"></div>
      
      <div className="px-4 pb-8">
        <h2 className="text-xl font-bold mb-2">{propertyDetails.title}</h2>
        <p className="text-gray-500 mb-4">{propertyDetails.address}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="font-bold text-xl text-roomi-blue">₵{propertyDetails.price}</span>
            <span className="text-gray-500">/{propertyDetails.priceUnit}</span>
          </div>
          <div className="flex items-center">
            {propertyDetails.rating && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{propertyDetails.rating} 
                  {propertyDetails.reviewCount && <span> ({propertyDetails.reviewCount} reviews)</span>}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {propertyDetails.amenities.map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600">{propertyDetails.description}</p>
        </div>
        
        <Button variant="primary" fullWidth onClick={onBookNow}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default StoryDetailsSheetEnhanced;
