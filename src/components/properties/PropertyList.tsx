
import React from 'react';
import PropertyCard from './PropertyCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  onResetFilters: () => void;
  onViewProperty: (id: string) => void;
  onViewStory: (id: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  isLoading = false,
  onResetFilters,
  onViewProperty,
  onViewStory 
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No Properties Found"
        description="No properties found matching your criteria"
        actionLabel="Reset Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {properties.map((property) => (
        <PropertyCard
          key={String(property.id)}
          id={property.id}
          title={property.title || property.name}
          rent={property.price || property.rent || 0}
          location={
            property.address ?
              `${property.address}, ${property.city || ''}`.trim() :
              `${property.city || ''}, ${property.state || ''}`.trim()
          }
          bedrooms={property.bedrooms || 1}
          bathrooms={property.bathrooms || 1}
          maxOccupants={property.max_occupants || property.maxOccupants || 1}
          images={Array.isArray(property.images) ? property.images : []}
          amenities={Array.isArray(property.amenities) ? property.amenities : []}
          propertyType={property.property_category || property.propertyCategory || property.type || 'Hostel'}
          genderRestriction={property.gender_restriction}
          isAvailable={property.is_available ?? property.status === 'active'}
          onViewDetails={() => onViewProperty(String(property.id))}
          onViewStory={() => onViewStory(property.id)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
