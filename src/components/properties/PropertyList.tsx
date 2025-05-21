
import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
  onViewProperty?: (id: string) => void;
  onViewStory?: (id: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  isLoading = false, 
  emptyMessage = "No properties match your search criteria.", 
  onResetFilters,
  onViewProperty,
  onViewStory
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 mx-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-80"></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        {onResetFilters && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded" onClick={onResetFilters}>
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 mx-0">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={{
            id: property.id,
            title: property.title,
            type: property.type || property.property_type || 'Hostel',
            price: property.price || property.rent || 0,
            priceUnit: (property.priceUnit || property.price_unit || 'semester') as 'month' | 'semester' | 'year' | 'week',
            address: property.address,
            distanceToCampus: property.distanceToCampus || property.distance_to_campus || '10 min walk',
            images: property.images || [],
            rating: property.rating,
            reviewCount: property.reviewCount,
            verified: property.verified,
            propertyCategory: property.propertyCategory || property.property_category,
            genderType: property.genderType || (property.gender_type as any),
            onViewStory: () => onViewStory && onViewStory(property.id),
            onViewDetails: () => onViewProperty && onViewProperty(property.id)
          }}
        />
      ))}
    </div>
  );
};

export default PropertyList;
