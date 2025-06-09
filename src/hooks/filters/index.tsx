
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
  
  // Transform FilterOptions to PropertyFilters for useFilteredProperties
  const propertyFilters = {
    gender: filters.genderType || 'any',
    priceRange: { 
      min: filters.priceRange?.[0] || 0, 
      max: filters.priceRange?.[1] || 10000 
    },
    location: filters.location || '',
    amenities: filters.amenities || [],
    propertyType: filters.propertyType || 'all'
  };
  
  const filteredProperties = useFilteredProperties(properties, propertyFilters);
  
  return {
    filteredProperties,
    isLoading: false,
    filters,
    setFilters,
    resetFilters: () => setFilters({})
  };
};
