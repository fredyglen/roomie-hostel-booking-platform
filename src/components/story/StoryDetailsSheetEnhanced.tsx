
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PropertyTabs from '@/components/property/PropertyTabs';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';

interface StoryDetailsSheetEnhancedProps {
  property: Property;
  onClose: () => void;
  onBookNow?: () => void;
}

const StoryDetailsSheetEnhanced: React.FC<StoryDetailsSheetEnhancedProps> = ({ 
  property, 
  onClose,
  onBookNow 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      navigate(`/student/property/${property.id}/book`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content area with scrolling */}
      <div className="flex-grow overflow-auto px-4">
        <h2 className="text-xl font-bold mb-2">{property.title}</h2>
        <p className="text-gray-600 mb-4">{property.address}</p>
        
        {/* Property tabs */}
        <div className="bg-white rounded-lg mb-20">
          <PropertyTabs
            description={property.description || ''}
            address={property.address}
            distanceToCampus={property.distanceToCampus || property.distance_to_campus || ''}
            houseRules={property.house_rules || []}
            amenities={property.amenities || []}
            type={property.type || property.property_type || ''}
            location={property.location || ''}
            availableUnits={property.availableUnits}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
      
      {/* Fixed Book Now button */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-blue-600">₵{(property.price || property.rent || 0).toLocaleString()}</span>
            <span className="text-gray-600">/{property.priceUnit || property.price_unit || 'semester'}</span>
          </div>
          {property.rating && (
            <div className="flex items-center">
              <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
              <span className="text-sm ml-1">{property.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({property.reviewCount || 0})</span>
            </div>
          )}
        </div>
        <Button 
          variant="default" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleBookNow}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default StoryDetailsSheetEnhanced;
