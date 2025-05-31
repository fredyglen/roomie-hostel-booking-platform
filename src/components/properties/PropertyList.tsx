
import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  isLoading?: boolean;
  onResetFilters?: () => void;
  onViewProperty?: (id: string) => void;
  onViewStory?: (id: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  onPropertyClick,
  isLoading = false,
  onResetFilters,
  onViewProperty,
  onViewStory
}) => {
  const handleViewDetails = (property: Property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    } else if (onViewProperty) {
      onViewProperty(property.id);
    }
  };

  const handleViewStory = (property: Property) => {
    if (onViewStory) {
      onViewStory(property.id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
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
          title={property.title}
          rent={property.price}
          location={property.address}
          bedrooms={property.bedrooms || 1}
          bathrooms={property.bathrooms || 1}
          maxOccupants={property.max_occupants || 1}
          images={property.images}
          amenities={property.amenities || []}
          propertyType={property.type || property.property_type || 'Hostel'}
          genderRestriction={property.genderType}
          isAvailable={property.status === 'Available'}
          onViewDetails={() => handleViewDetails(property)}
          onViewStory={() => handleViewStory(property)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
