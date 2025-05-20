
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    price: number;
    priceUnit: 'month' | 'semester' | 'year';
    address: string;
    distanceToCampus: string;
    images: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
    onViewStory?: () => void;
    onViewDetails?: () => void;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-roomi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        {/* Verified Badge */}
        {property.verified && (
          <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
        
        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-roomi-dark text-xs px-2 py-1 rounded">
          {property.type}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-semibold mb-1 truncate" title={property.title}>{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate" title={property.address}>{property.address}</p>
        
        <div className="flex items-center text-sm mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-roomi-teal mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.distanceToCampus} to campus</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-roomi-blue">${property.price}</span>
            <span className="text-gray-600">/{property.priceUnit}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm ml-1">{property.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({property.reviewCount})</span>
          </div>
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
