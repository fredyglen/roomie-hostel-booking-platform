import React from 'react';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';

interface PropertyDisplay {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  price_unit: string;
  status: string;
  occupancy: string;
  image_url: string;
  created_at: string;
  owner_id: string;
}

interface PropertiesGridProps {
  properties: PropertyDisplay[];
  isLoading: boolean;
  onDeleteProperty: (id: string) => void;
}

const PropertiesGrid: React.FC<PropertiesGridProps> = ({ 
  properties, 
  isLoading,
  onDeleteProperty 
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
        <img src="/empty-state.svg" alt="No properties" className="w-32 h-32 mb-4 opacity-80" />
        <p className="text-gray-500 text-lg mb-4">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id}
          property={property}
          onDelete={onDeleteProperty}
        />
      ))}
    </div>
  );
};

export default PropertiesGrid;
