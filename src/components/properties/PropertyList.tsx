
import React from 'react';
import PropertyCard from './PropertyCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PropertyListProps {
  properties: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  isLoading = false, 
  emptyMessage = "No properties match your search criteria.", 
  onResetFilters 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          <Button variant="default" onClick={onResetFilters}>Reset Filters</Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-1">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={{
            ...property,
            onViewStory: () => navigate(`/student/property/${property.id}/story`),
            onViewDetails: () => navigate(`/student/property/${property.id}`)
          }}
        />
      ))}
    </div>
  );
};

export default PropertyList;
