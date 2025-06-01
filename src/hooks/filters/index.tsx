
import { useState } from 'react';
import { useFilteredProperties } from './useFilteredProperties';
import { Property } from '@/types/property';

interface FilterOptions {
  search?: string;
  priceRange?: [number, number];
  propertyType?: string;
  genderType?: string;
  location?: string;
  amenities?: string[];
}

export const useFilters = (properties: Property[]) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const filteredProperties = useFilteredProperties(properties, filters);
  
  return {
    filteredProperties,
    isLoading: false,
    filters,
    setFilters,
    resetFilters: () => setFilters({})
  };
};
