
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          location={typeof property.location === 'string' ? property.location : `${property.city}, ${property.state}`}
          price={property.price}
          images={property.images}
          onView={() => onViewProperty(property.id)}
          onViewStory={() => onViewStory(property.id)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
