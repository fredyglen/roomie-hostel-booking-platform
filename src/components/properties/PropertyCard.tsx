
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/common/Button';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    price: number;
    priceUnit: 'month' | 'semester' | 'year' | 'week';
    address: string;
    distanceToCampus: string;
    images: string[];
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    propertyCategory?: 'Hostel' | 'Homestel' | 'Apartment';
    genderType?: 'Girls' | 'Boys' | 'Mixed';
    onViewStory?: () => void;
    onViewDetails?: () => void;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const getCategoryIcon = () => {
    switch (property.propertyCategory) {
      case 'Apartment':
        return <Icon icon="solar:building-2-linear" className="h-4 w-4 mr-1 text-roomi-blue" />;
      case 'Homestel':
        return <Icon icon="solar:home-linear" className="h-4 w-4 mr-1 text-roomi-blue" />;
      default: // Hostel
        return <Icon icon="solar:building-linear" className="h-4 w-4 mr-1 text-roomi-blue" />;
    }
  };

  const getGenderBadgeColor = () => {
    switch (property.genderType) {
      case 'Girls':
        return "bg-pink-100 text-pink-800";
      case 'Boys':
        return "bg-blue-100 text-blue-800";
      default: // Mixed
        return "bg-purple-100 text-purple-800";
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col">
      {/* Property Image */}
      <div className="relative">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Story View Button */}
        <button 
          onClick={property.onViewStory}
          className="absolute top-3 left-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        >
          <Icon icon="solar:video-frame-play-linear" className="text-roomi-blue h-5 w-5" />
        </button>
        
        {/* Gender Type Badge */}
        <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full flex items-center ${getGenderBadgeColor()}`}>
          <span>{property.genderType || 'Mixed'}</span>
        </div>
        
        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-roomi-dark text-xs px-2 py-1 rounded flex items-center">
          {getCategoryIcon()}
          <span>{property.propertyCategory || 'Hostel'}</span>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold mb-1 truncate" title={property.title}>{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate" title={property.address}>{property.address}</p>
        
        <div className="flex items-center text-sm mb-3">
          <Icon icon="solar:map-point-linear" className="h-4 w-4 text-roomi-teal mr-1" />
          <span>{property.distanceToCampus} to campus</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-roomi-blue">₵{property.price}</span>
            <span className="text-gray-600">/{property.priceUnit}</span>
          </div>
          {property.rating && (
            <div className="flex items-center">
              <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
              <span className="text-sm ml-1">{property.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({property.reviewCount || 0})</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="primary" 
            size="sm" 
            fullWidth
            onClick={property.onViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
