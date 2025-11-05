import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Info } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  isFavorite: isFavoriteProp,
  className,
}) => {
  const {
    id,
    name,
    price,
    currency = 'GHS',
    location,
    images,
    propertyType,
    bedrooms,
    bathrooms,
    isAvailable,
  } = property;

  const { user } = useAuth();
  const { data: isFavoriteFromDB, isLoading: isFavoriteLoading } = useIsFavorite(id, user?.id);
  const toggleFavorite = useToggleFavorite();

  // Use database value if available, otherwise fall back to prop
  const isFavorite = isFavoriteFromDB ?? isFavoriteProp ?? false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // TODO: Show login prompt
      return;
    }

    toggleFavorite.mutate(id, {
      onSuccess: (newStatus) => {
        // Call optional callback if provided
        onFavoriteToggle?.(id, newStatus);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={images?.[0] || '/placeholder-property.jpg'}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading || toggleFavorite.isPending}
          className={cn(
            "absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-all",
            isFavorite ? "text-red-500" : "text-gray-600 hover:bg-gray-50",
            (isFavoriteLoading || toggleFavorite.isPending) && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("w-5 h-5", isFavorite && "fill-current")}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{address}</p>
        <p className="text-xl font-bold text-blue-600">GH₵{rent}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">{bedrooms} bed • {bathrooms} bath</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'Available' : 'Occupied'}
          </span>
        </div>

        {/* Good to Know Preview */}
        {property.good_to_know && (
          <div className="flex items-center text-sm text-blue-600 mt-2">
            <Info className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {property.good_to_know.substring(0, 60)}
              {property.good_to_know.length > 60 && '...'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;