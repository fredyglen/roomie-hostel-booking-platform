/**
 * Property Card Component for ROOMi Platform
 * Displays property information in a card format with proper type safety
 *
 * @fileoverview Apple-Level Property Card Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { formatCurrency, cn } from '@/lib/utils';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  className?: string;
}

/**
 * Property Card Component
 * Displays property information with proper type safety and modern design
 */
const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  isFavorite = false,
  className,
}) => {
  // Extract property data using the correct Property interface
  const {
    id,
    name,
    type: propertyType,
    status,
    address,
    price,
    features,
    media,
    verificationStatus
  } = property;

  // Get the first image or use placeholder
  const primaryImage = media.length > 0 ? media[0].url : '/placeholder-property.jpg';

  // Format the location string
  const locationString = `${address.city}, ${address.state}`;

  // Check if property is available
  const isAvailable = status === 'active';

  /**
   * Handle favorite toggle with proper event handling
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onFavoriteToggle) {
      onFavoriteToggle(id, !isFavorite);
    }
  };

  return (
    <Link to={`/properties/${id}`} className={cn("block", className)}>
      <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <OptimizedImage
            src={primaryImage}
            alt={name}
            className="w-full h-48 object-cover"
            width={400}
            height={192}
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </button>

          {/* Verification badge */}
          {verificationStatus === 'verified' && (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white">
              Verified
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {name}
          </h3>

          <p className="text-gray-600 text-sm mb-2">
            {locationString}
          </p>

          <p className="text-xl font-bold text-blue-600 mb-2">
            {formatCurrency(price.amount)}
            <span className="text-sm font-normal text-gray-500 ml-1">
              /{price.period}
            </span>
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {features.bedrooms} bed • {features.bathrooms} bath
            </span>

            <Badge
              variant={isAvailable ? "default" : "secondary"}
              className={cn(
                "text-xs",
                isAvailable
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              )}
            >
              {isAvailable ? 'Available' : 'Occupied'}
            </Badge>
          </div>

          {/* Property type badge */}
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {propertyType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

/**
 * Memoized PropertyCard component for performance optimization
 * Only re-renders when props change
 */
export default memo(PropertyCard);