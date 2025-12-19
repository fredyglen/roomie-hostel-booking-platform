
import React from 'react';
import PremiumPropertyCard from './PremiumPropertyCard';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Property } from '@/types/property';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';

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
        const coverImage = deriveCoverImageFromProperty(property as any);
        const images = coverImage
          ? [coverImage]
          : Array.isArray(property.images)
            ? property.images
            : typeof (property as any).images === 'string' && (property as any).images.trim()
              ? [(property as any).images]
              : [];

        return (
          <PremiumPropertyCard
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
            images={images}
            amenities={Array.isArray(property.amenities) ? property.amenities : []}
            propertyType={property.property_category || property.propertyCategory || property.type || 'Hostel'}
            genderRestriction={property.gender_restriction}
            isAvailable={property.is_available ?? property.status === 'active'}
            onViewDetails={() => onViewProperty(String(property.id))}
            onViewStory={() => onViewStory(property.id)}
          />
        );
      })}
    </div>
  );
};

export default PropertyList;
