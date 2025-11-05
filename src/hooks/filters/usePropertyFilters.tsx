
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { PRICE_FILTER_DEFAULTS, DISTANCE_FILTER_DEFAULTS } from '@/config/constants';

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
    priceRange: initialPriceRange = [PRICE_FILTER_DEFAULTS.MIN, PRICE_FILTER_DEFAULTS.MAX],
    maxDistance: initialMaxDistance = DISTANCE_FILTER_DEFAULTS.DEFAULT
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
    setPriceRange([PRICE_FILTER_DEFAULTS.MIN, PRICE_FILTER_DEFAULTS.MAX]);
    setMaxDistance(DISTANCE_FILTER_DEFAULTS.DEFAULT);
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
