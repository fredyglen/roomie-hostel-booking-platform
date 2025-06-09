
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
          property={property}
          onViewProperty={onViewProperty}
          onViewStory={onViewStory}
        />
      ))}
    </div>
  );
};

export default PropertyList;
