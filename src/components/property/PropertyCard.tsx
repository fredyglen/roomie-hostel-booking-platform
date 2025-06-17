import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavoriteToggle,
  isFavorite = false,
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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement favorite functionality
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
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <span className="text-gray-600">♡</span>
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
      </div>
    </div>
  );
};

export default PropertyCard;