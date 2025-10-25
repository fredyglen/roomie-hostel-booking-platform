
import React, { useState, useEffect } from 'react';
import { useDynamicProperties } from '@/hooks/property/useDynamicProperties';
import PropertyListContainer from '@/components/properties/PropertyListContainer';
import { BaseLoading } from '@/components/ui/BaseLoading';
import { BaseError } from '@/components/ui/BaseError';
import { Property } from '@/types/property';
import { logger } from '@/utils/enhanced-logger';

const Properties: React.FC = () => {
  // Use dynamic properties hook with available properties filter
  const {
    properties,
    isLoading,
    isError,
    error,
    totalCount,
    refetch
  } = useDynamicProperties({
    filters: {
      isAvailable: true
    },
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  useEffect(() => {
    logger.info('Properties page loaded', {
      propertiesCount: properties.length,
      totalCount
    });
  }, [properties.length, totalCount]);

  if (isLoading) {
    return <BaseLoading message="Loading available properties..." />;
  }

  if (isError) {
    logger.error('Failed to load properties', { error });
    return (
      <BaseError
        message={error?.message || 'Failed to load properties'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Properties</h1>
        <div className="text-sm text-gray-600">
          {totalCount} {totalCount === 1 ? 'property' : 'properties'} available
        </div>
      </div>
      <PropertyListContainer properties={properties} />
    </div>
  );
};

export default Properties;
