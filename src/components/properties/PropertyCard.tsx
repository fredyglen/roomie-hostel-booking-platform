
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Car, Zap } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    price: number;
    priceUnit: string;
    address: string;
    distanceToCampus: string;
    images: string[];
    rating?: number;
    reviewCount?: number;
    verified?: boolean;
    propertyCategory?: string;
    genderType?: string;
    onViewStory?: () => void;
    onViewDetails?: () => void;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const {
    title,
    type,
    price,
    priceUnit,
    address,
    distanceToCampus,
    images,
    rating,
    reviewCount,
    verified,
    propertyCategory,
    genderType,
    onViewStory,
    onViewDetails
  } = property;

  const primaryImage = images && images.length > 0 ? images[0] : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        <ImageWithFallback
          src={primaryImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          {onViewStory && (
            <button
              onClick={onViewStory}
              className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              View Story
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          )}
        </div>

        {/* Verification Badge */}
        {verified && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-white text-xs">
              Verified
            </Badge>
          </div>
        )}

        {/* Property Category Badge */}
        {propertyCategory && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {propertyCategory}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          {rating && (
            <div className="flex items-center text-yellow-500 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1">{rating}</span>
              {reviewCount && (
                <span className="text-gray-500 ml-1">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Type and Gender */}
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
          {genderType && (
            <Badge variant="outline" className="text-xs capitalize">
              {genderType}
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Distance to Campus */}
        <div className="text-gray-600 text-sm mb-3">
          📍 {distanceToCampus} to campus
        </div>

        {/* Basic Amenities Icons */}
        <div className="flex items-center space-x-3 mb-3 text-gray-600">
          <Wifi className="w-4 h-4" />
          <Zap className="w-4 h-4" />
          <Car className="w-4 h-4" />
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(price)}
            </span>
            <span className="text-gray-600 text-sm">/{priceUnit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
