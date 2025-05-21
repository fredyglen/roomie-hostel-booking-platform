
import { usePropertyFilters } from './usePropertyFilters';
import { useFilteredProperties } from './useFilteredProperties';
import { Property } from '@/types/property';

interface UsePropertiesFilterOptions {
  properties: Property[];
  initialFilters?: {
    searchQuery?: string;
    propertyType?: string;
    genderType?: string;
    priceRange?: [number, number];
    maxDistance?: number;
  };
}

export const usePropertiesFilter = ({ 
  properties, 
  initialFilters = {} 
}: UsePropertiesFilterOptions) => {
  // Get filter state and actions
  const filterState = usePropertyFilters(properties, initialFilters);
  
  // Get filtered properties based on filter state
  const { filteredProperties, isLoading } = useFilteredProperties(properties, {
    searchQuery: filterState.searchQuery,
    selectedPropertyType: filterState.selectedPropertyType,
    selectedGenderType: filterState.selectedGenderType,
    priceRange: filterState.priceRange,
    maxDistance: filterState.maxDistance
  });
  
  return {
    ...filterState,
    filteredProperties,
    isLoading
  };
};

export { usePropertyFilters, useFilteredProperties };
