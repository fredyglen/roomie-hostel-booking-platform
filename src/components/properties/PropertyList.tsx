
import React from 'react';
import PropertyCard from './PropertyCard';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';

interface PropertyListProps {
  properties: Property[];
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

  const handleViewProperty = (id: string) => {
    if (!id) {
      console.error("Cannot navigate to property without ID");
      return;
    }
    
    console.log("Navigating to property:", id);
    navigate(`/student/property/${id}`);
  };

  const handleViewStory = (id: string) => {
    if (!id) {
      console.error("Cannot navigate to story without property ID");
      return;
    }
    
    console.log("Navigating to story:", id);
    navigate(`/student/property/${id}/story`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 mx-0">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={{
            ...property,
            onViewStory: () => handleViewStory(property.id),
            onViewDetails: () => handleViewProperty(property.id)
          }}
        />
      ))}
    </div>
  );
};

export default PropertyList;
