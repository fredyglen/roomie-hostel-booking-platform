
import React, { useState } from 'react';
import Button from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, MapPin, Star, CheckCircle } from 'lucide-react';

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
    location?: string;
  };
  onBookNow: () => void;
}

const StoryDetailsSheetEnhanced: React.FC<StoryDetailsSheetEnhancedProps> = ({
  showDetails,
  propertyDetails,
  onBookNow
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    // Implementation for smooth drag effect could be added here
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    // Implementation for smooth drag effect could be added here
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transition-transform duration-300 transform ${
        showDetails ? 'translate-y-0' : 'translate-y-[95%]'
      } z-30 max-h-[85vh] overflow-hidden shadow-lg`}
    >
      {/* Draggable handle with animated indicator */}
      <div 
        className="w-full h-10 flex justify-center items-center cursor-pointer touch-action-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mb-1"></div>
        <ArrowUp 
          className={`absolute text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          size={16}
        />
      </div>
      
      {/* Content with tabs */}
      <div className="overflow-y-auto max-h-[calc(85vh-40px)] pb-safe">
        <div className="px-4 pt-2 pb-4">
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
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1">{propertyDetails.rating} 
                    {propertyDetails.reviewCount && <span> ({propertyDetails.reviewCount} reviews)</span>}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="px-4 py-4">
            <p className="text-gray-600">{propertyDetails.description}</p>
          </TabsContent>
          
          <TabsContent value="location" className="px-4 py-4">
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-800">{propertyDetails.address}</p>
                <p className="text-gray-600 text-sm">{propertyDetails.distanceToCampus} to campus</p>
              </div>
            </div>
            <div className="bg-gray-100 h-40 rounded-md mt-4 flex items-center justify-center">
              <p className="text-gray-500">Map preview</p>
            </div>
          </TabsContent>
          
          <TabsContent value="amenities" className="px-4 py-4">
            <div className="grid grid-cols-2 gap-y-3">
              {propertyDetails.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="px-4 py-4">
            {propertyDetails.reviewCount ? (
              <div className="flex items-center justify-center flex-col">
                <div className="flex items-center mb-2">
                  <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl font-bold ml-2">{propertyDetails.rating}</span>
                </div>
                <p className="text-gray-500">{propertyDetails.reviewCount} reviews</p>
              </div>
            ) : (
              <p className="text-center text-gray-500">No reviews yet</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="px-4 py-4">
          <Button variant="primary" fullWidth onClick={onBookNow}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailsSheetEnhanced;
