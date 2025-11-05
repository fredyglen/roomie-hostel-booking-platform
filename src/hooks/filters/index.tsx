
import { useState } from 'react';
import { useFilteredProperties } from './useFilteredProperties';
import { Property } from '@/types/property';
import { PRICE_FILTER_DEFAULTS } from '@/config/constants';

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
      min: filters.priceRange?.[0] || PRICE_FILTER_DEFAULTS.MIN,
      max: filters.priceRange?.[1] || PRICE_FILTER_DEFAULTS.MAX
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
