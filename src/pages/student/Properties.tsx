
import React, { useState, useEffect } from 'react';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import PropertyListContainer from '@/components/properties/PropertyListContainer';
import { BaseLoading } from '@/components/ui/BaseLoading';
import { BaseError } from '@/components/ui/BaseError';
import { Property } from '@/types/property';

const Properties: React.FC = () => {
  const { getProperties, loading, error } = usePropertyData();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await getProperties();
        setProperties(result.properties);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      }
    };

    fetchProperties();
  }, [getProperties]);

  if (loading) {
    return <BaseLoading message="Loading properties..." />;
  }

  if (error) {
    return <BaseError message={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Available Properties</h1>
      <PropertyListContainer properties={properties} />
    </div>
  );
};

export default Properties;
