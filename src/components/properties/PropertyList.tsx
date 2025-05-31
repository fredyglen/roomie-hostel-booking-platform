
import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPropertyClick }) => {
  const handleViewDetails = (property: Property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          type={property.type}
          price={property.price}
          priceUnit={property.priceUnit}
          address={property.address}
          distanceToCampus={property.distanceToCampus}
          images={property.images}
          rating={property.rating}
          reviewCount={property.reviewCount}
          verified={property.verified}
          onViewDetails={() => handleViewDetails(property)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
