/**
 * Mobile Property Card Component
 * 
 * PRODUCTION-GRADE mobile-optimized property card with advanced overlay system.
 * Designed specifically for mobile-first experience with Apple-level polish.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyCardOverlay from './PropertyCardOverlay';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Users, 
  Bed,
  Wifi,
  Car,
  Shield
} from 'lucide-react';

interface MobilePropertyCardProps {
  readonly id: string;
  readonly title: string;
  readonly price: number;
  readonly priceUnit?: 'semester' | 'month';
  readonly location: string;
  readonly images: string[];
  readonly bedrooms: number;
  readonly maxOccupants: number;
  readonly amenities: string[];
  readonly isVerified?: boolean;
  readonly distanceToCampus?: string;
  readonly onTap: () => void;
  readonly onFavorite?: () => void;
  readonly onShare?: () => void;
}

/**
 * ✅ PRODUCTION-GRADE: Mobile-First Property Card
 */
const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  id,
  title,
  price,
  priceUnit = 'semester',
  location,
  images,
  bedrooms,
  maxOccupants,
  amenities,
  isVerified = false,
  distanceToCampus,
  onTap,
  onFavorite,
  onShare
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get primary image with fallback
  const primaryImage = images && images.length > 0 && !imageError
    ? images[0]
    : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';

  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  // Handle share click
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-3 w-3" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-3 w-3" />;
    if (amenityLower.includes('security') || amenityLower.includes('guard')) return <Shield className="h-3 w-3" />;
    return null;
  };

  return (
    <Card 
      className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
      onClick={onTap}
    >
      {/* ✅ IMAGE SECTION with Advanced Overlay */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={primaryImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* ✅ PRODUCTION-GRADE: Real-Time Overlay System */}
        <PropertyCardOverlay
          propertyId={id}
          price={price}
          priceUnit={priceUnit}
          variant="default"
          isVerified={isVerified}
          isPopular={false} // You can determine this based on your logic
          viewCount={0} // Track if needed
          showLiveIndicator={true}
          showPrice={true}
        />

        {/* ✅ ACTION BUTTONS - Top Right */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            onClick={handleShareClick}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleFavoriteClick}
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* ✅ CONTENT SECTION */}
      <div className="p-4 space-y-3">
        {/* Title and Location */}
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{location}</span>
            {distanceToCampus && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {distanceToCampus}
              </span>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            <span>{bedrooms} rooms</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Up to {maxOccupants}</span>
          </div>
        </div>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              return (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5"
                >
                  {icon && <span className="mr-1">{icon}</span>}
                  {amenity}
                </Badge>
              );
            })}
            {amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                +{amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Bottom Action Area */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Tap to view details
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              GH₵{price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              per {priceUnit}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MobilePropertyCard;
