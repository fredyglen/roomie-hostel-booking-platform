
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

interface FilterOptions {
  searchQuery?: string;
  propertyType?: string;
  genderType?: string;
  priceRange?: [number, number];
  maxDistance?: number;
}

export const usePropertyFilters = (properties: Property[], initialFilters: FilterOptions = {}) => {
  // Extract initial values with defaults
  const {
    searchQuery: initialSearchQuery = '',
    propertyType: initialPropertyType = '',
    genderType: initialGenderType = '',
    priceRange: initialPriceRange = [0, 20000],
    maxDistance: initialMaxDistance = 15
  } = initialFilters;
  
  // States for filters
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialPropertyType);
  const [selectedGenderType, setSelectedGenderType] = useState(initialGenderType);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance);
  const [showFilters, setShowFilters] = useState(false);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPropertyType('');
    setSelectedGenderType('');
    setPriceRange([0, 20000]);
    setMaxDistance(15);
    setShowFilters(false);
  };
  
  return {
    // Filter states
    searchQuery,
    setSearchQuery,
    selectedPropertyType,
    setSelectedPropertyType,
    selectedGenderType,
    setSelectedGenderType,
    priceRange,
    setPriceRange,
    maxDistance,
    setMaxDistance,
    showFilters,
    setShowFilters,
    
    // Actions
    resetFilters
  };
};
