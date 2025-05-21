
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
