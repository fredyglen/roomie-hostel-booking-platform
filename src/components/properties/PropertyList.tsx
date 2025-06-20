
/**
 * Property List Component for ROOMi Platform
 * Displays a grid of property cards with proper type safety
 *
 * @fileoverview Apple-Level Property List Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

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
      {properties.map((property) => {
        // Extract data using the correct Property interface
        const {
          id,
          name,
          address,
          price,
          features,
          media,
          type,
          status
        } = property;

        // Format location string
        const locationString = `${address.city}, ${address.state}`;

        // Get images array
        const imagesArray = media.map(m => m.url);

        // Check availability
        const isAvailable = status === 'active';

        return (
          <PropertyCard
            key={id}
            id={id}
            title={name}
            rent={price.amount}
            location={locationString}
            bedrooms={features.bedrooms}
            bathrooms={features.bathrooms}
            maxOccupants={features.bedrooms} // Simplified calculation
            images={imagesArray}
            amenities={features.amenities}
            propertyType={type}
            genderRestriction="mixed" // TODO: Add gender restriction to Property interface
            isAvailable={isAvailable}
            onViewDetails={() => onViewProperty(id)}
            onViewStory={() => onViewStory(id)}
          />
        );
      })}
    </div>
  );
};

export default PropertyList;
