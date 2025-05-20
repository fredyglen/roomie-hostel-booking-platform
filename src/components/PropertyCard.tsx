
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    price: number;
    priceUnit: 'day' | 'week' | 'month' | 'semester' | 'year';
    address: string;
    distanceToCampus: string;
    images: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  variant?: 'default' | 'compact';
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  variant = 'default',
  className 
}) => {
  const isCompact = variant === 'compact';
  
  return (
    <Link 
      to={`/properties/${property.id}`} 
      className={cn(
        "group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="relative">
        <div className={`${isCompact ? 'h-36' : 'h-48'} overflow-hidden`}>
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {property.verified && (
          <div className="absolute top-2 right-2 bg-roomi-blue text-white text-xs px-2 py-1 rounded-full">
            Verified
          </div>
        )}
        
        <button 
          className="absolute top-2 left-2 bg-white/80 hover:bg-white p-1.5 rounded-full transition-colors"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.preventDefault();
            console.log('Add to favorites');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        <Link 
          to={`/properties/${property.id}/story`}
          className="absolute bottom-2 right-2 bg-roomi-orange text-white text-xs px-2 py-1 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            console.log('View story');
          }}
        >
          View Tour
        </Link>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold line-clamp-1`}>{property.title}</h3>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs ml-1">{property.rating} ({property.reviewCount})</span>
          </div>
        </div>
        
        <div className={`flex items-center ${isCompact ? 'mt-1' : 'mt-2'} text-gray-500`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs line-clamp-1">{property.address}</p>
        </div>
        
        <div className={`flex items-center ${isCompact ? 'mt-1' : 'mt-2'} text-gray-500`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">{property.distanceToCampus} to campus</p>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <span className="font-bold text-roomi-blue">₵{property.price}</span>
            <span className="text-gray-500 text-xs">/{property.priceUnit}</span>
          </div>
          <span className={`${isCompact ? 'text-xs' : 'text-sm'} px-2 py-0.5 bg-gray-100 rounded-full`}>
            {property.type}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
