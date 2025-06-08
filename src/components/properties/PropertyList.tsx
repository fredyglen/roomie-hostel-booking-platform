import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';
import { logger } from '@/utils/logger';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onResetFilters?: () => void;
  onViewProperty?: (id: string) => void;
  onViewStory?: (id: string) => void;
  isLoading?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  onPropertyClick,
  onResetFilters,
  onViewProperty,
  onViewStory,
  isLoading = false
}) => {
  const handleViewDetails = (property: Property) => {
    logger.debug('Property card clicked', { propertyId: property.id });
    if (onPropertyClick) {
      onPropertyClick(property);
    } else if (onViewProperty) {
      onViewProperty(property.id);
    }
  };

  const handleViewStory = (property: Property) => {
    logger.debug('View story clicked', { propertyId: property.id });
    if (onViewStory) {
      onViewStory(property.id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-2 animate-pulse transition-all duration-500">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
        <img src="/empty-state.svg" alt="No properties" className="w-32 h-32 mb-4 opacity-80" />
        <p className="text-gray-500 text-lg mb-4">No properties found</p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.name}
          rent={property.price}
          location={property.location?.address || ''}
          bedrooms={property.features?.find(f => f === 'bedrooms') ? 1 : 0}
          bathrooms={property.features?.find(f => f === 'bathrooms') ? 1 : 0}
          maxOccupants={1}
          images={property.images}
          amenities={property.amenities?.map(a => typeof a === 'string' ? a : a.name) || []}
          propertyType={property.type}
          genderRestriction={undefined}
          isAvailable={property.status === 'available'}
          onViewDetails={() => handleViewDetails(property)}
          onViewStory={() => handleViewStory(property)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
