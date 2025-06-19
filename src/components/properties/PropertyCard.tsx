
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import LazyImage from '@/components/common/LazyImage';
import {
  WifiIcon,
  AirConditionIcon,
  LaundryIcon,
  StudyAreaIcon,
  BedroomIcon,
  LocationIcon,
  SecurityIcon,
  KitchenIcon
} from '@/components/ui/SolarIcons';

export interface PropertyCardProps {
  id: string;
  title: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  images: string[];
  amenities: string[];
  propertyType: string;
  genderRestriction?: string;
  isAvailable: boolean;
  // ROOMi-specific properties
  roomTypes?: Array<{
    type: string; // "1 in a room", "2 in a room", etc.
    price: number;
    bedsAvailable: number;
    totalBeds: number;
  }>;
  distanceToCampus?: string;
  totalBedsAvailable?: number;
  totalBeds?: number;
  priceUnit?: 'semester' | 'month' | 'year';
  onViewDetails: () => void;
  onViewStory?: () => void;
  showActions?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  rent,
  location,
  bedrooms,
  bathrooms,
  maxOccupants,
  images,
  amenities,
  propertyType,
  genderRestriction,
  isAvailable,
  roomTypes,
  distanceToCampus,
  totalBedsAvailable = 0,
  totalBeds = 1,
  priceUnit = 'semester',
  onViewDetails,
  onViewStory,
  showActions = true
}) => {
  const primaryImage = images && images.length > 0 ? images[0] : undefined;

  // Calculate bed availability percentage for color coding
  const availabilityPercentage = totalBeds > 0 ? (totalBedsAvailable / totalBeds) * 100 : 0;

  // Get availability status and color
  const getAvailabilityStatus = () => {
    if (totalBedsAvailable === 0) return { status: 'FULL', color: 'bg-red-500', textColor: 'text-white' };
    if (availabilityPercentage <= 25) return { status: 'LIMITED', color: 'bg-orange-500', textColor: 'text-white' };
    return { status: 'AVAILABLE', color: 'bg-green-500', textColor: 'text-white' };
  };

  const availabilityInfo = getAvailabilityStatus();

  // Get room type display (most common or cheapest)
  const getRoomTypeDisplay = () => {
    if (!roomTypes || roomTypes.length === 0) {
      return `${maxOccupants} in a room`;
    }
    // Show the room type with most availability or lowest price
    const sortedByAvailability = roomTypes.sort((a, b) => b.bedsAvailable - a.bedsAvailable);
    return sortedByAvailability[0]?.type || `${maxOccupants} in a room`;
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'WiFi': <WifiIcon size={14} />,
      'AC': <AirConditionIcon size={14} />,
      'Air Condition': <AirConditionIcon size={14} />,
      'Laundry': <LaundryIcon size={14} />,
      'Study Area': <StudyAreaIcon size={14} />,
      'Kitchen': <KitchenIcon size={14} />,
      'Security': <SecurityIcon size={14} />
    };
    return iconMap[amenity] || null;
  };

  return (
    <Card className="overflow-hidden card-premium animate-fade-in-up h-[280px] flex flex-col">
      {/* Enhanced Image Section with Better Visibility */}
      <div className="relative h-[140px] flex-shrink-0">
        <LazyImage
          src={primaryImage || '/placeholder-property.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          width={400}
          height={140}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />

        {/* Bed Availability Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <Badge
            className={`${availabilityInfo.color} ${availabilityInfo.textColor} text-xs font-bold px-2 py-1`}
          >
            {availabilityInfo.status}
          </Badge>
        </div>

        {/* Gender Restriction - Top Right */}
        {genderRestriction && genderRestriction !== 'mixed' && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className="bg-white/90 text-gray-800 text-xs font-medium border-gray-300"
            >
              {genderRestriction === 'male' ? '♂ Male' : '♀ Female'}
            </Badge>
          </div>
        )}

        {/* Property Type Badge - Bottom Right */}
        <div className="absolute bottom-2 right-2">
          <Badge
            variant="secondary"
            className="bg-black/70 text-white text-xs font-medium"
          >
            {propertyType}
          </Badge>
        </div>

        {/* Story View Button - Bottom Left */}
        {onViewStory && (
          <button
            onClick={onViewStory}
            className="absolute bottom-2 left-2 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        {/* Header with Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 flex-1 mr-2">
            {title}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary">
              ¢{rent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">/{priceUnit}</div>
          </div>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <div className="flex items-center flex-1">
            <LocationIcon size={12} />
            <span className="ml-1 truncate">{location}</span>
          </div>
          {distanceToCampus && (
            <span className="text-primary font-medium ml-2 flex-shrink-0">
              {distanceToCampus}
            </span>
          )}
        </div>

        {/* Room Type and Bed Availability */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center">
            <BedroomIcon size={12} />
            <span className="ml-1 font-medium text-gray-700">
              {getRoomTypeDisplay()}
            </span>
          </div>
          <div className="text-right">
            <span className={`font-bold ${
              totalBedsAvailable > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalBedsAvailable} bed{totalBedsAvailable !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="flex items-center bg-blue-50 rounded-full px-2 py-1 text-xs text-primary">
              {getAmenityIcon(amenity)}
              <span className="ml-1 font-medium">{amenity}</span>
            </div>
          ))}
          {amenities.length > 4 && (
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600">
              +{amenities.length - 4}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col gap-2 mt-auto">
            {/* Primary Book Now Button */}
            <Button
              onClick={onViewDetails}
              className="w-full btn-premium bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5"
              size="sm"
            >
              Book Now
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              {onViewStory && (
                <Button
                  onClick={onViewStory}
                  variant="outline"
                  size="sm"
                  className="flex-1 btn-premium border-primary text-primary hover:bg-primary/5 text-xs py-2"
                >
                  View Story
                </Button>
              )}
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Navigate to property details page
                  try {
                    // Try React Router navigation first
                    if (window.history && window.history.pushState) {
                      window.history.pushState({}, '', `/student/property/${id}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                      // Fallback to direct navigation
                      window.location.href = `/student/property/${id}`;
                    }
                  } catch (error) {
                    // Final fallback
                    window.location.href = `/student/property/${id}`;
                  }
                }}
                variant="outline"
                size="sm"
                className="flex-1 btn-premium border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-2"
              >
                Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyCard;
