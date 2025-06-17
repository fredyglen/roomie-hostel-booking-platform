
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath, Wifi, Car, Shield } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import ImageWithFallback from '@/components/common/ImageWithFallback';

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
  onViewDetails,
  onViewStory,
  showActions = true
}) => {
  const primaryImage = images && images.length > 0 ? images[0] : undefined;

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'WiFi': <Wifi className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
      'Security': <Shield className="h-4 w-4" />
    };
    return iconMap[amenity] || null;
  };

  return (
    <Card className="overflow-hidden card-premium animate-fade-in-up">
      <div className="relative">
        <ImageWithFallback
          src={primaryImage}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          priority={false}
        />
        
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? "Available" : "Occupied"}
          </Badge>
          {genderRestriction && (
            <Badge variant="outline">{genderRestriction}</Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{propertyType}</Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-gray-900">{title}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{maxOccupants} max</span>
          </div>
        </div>

        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-roomi-blue-600">
              {formatCurrency(rent)}
            </span>
            <span className="text-gray-500 text-sm font-medium">/semester</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onViewDetails}
              className="flex-1 btn-premium bg-roomi-blue-600 hover:bg-roomi-blue-700 text-white font-medium"
              size="sm"
            >
              View Details
            </Button>
            {onViewStory && (
              <Button
                onClick={onViewStory}
                variant="outline"
                size="sm"
                className="flex-1 btn-premium border-roomi-blue-600 text-roomi-blue-600 hover:bg-roomi-blue-50"
              >
                View Story
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyCard;
