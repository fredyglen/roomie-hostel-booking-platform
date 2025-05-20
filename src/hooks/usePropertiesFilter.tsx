
import { useState, useEffect } from 'react';
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
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Apply filters when any filter changes
  useEffect(() => {
    setIsLoading(true);
    
    const filterTimer = setTimeout(() => {
      let results = properties;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          property => 
            property.title?.toLowerCase().includes(query) ||
            property.address?.toLowerCase().includes(query) ||
            (property.type && property.type.toLowerCase().includes(query)) ||
            (property.propertyCategory && property.propertyCategory.toLowerCase().includes(query))
        );
      }
      
      // Apply property type filter
      if (selectedPropertyType) {
        results = results.filter(property => 
          property.propertyCategory?.toLowerCase() === selectedPropertyType.toLowerCase()
        );
      }
      
      // Apply gender type filter
      if (selectedGenderType) {
        results = results.filter(property => 
          property.genderType?.toLowerCase() === selectedGenderType.toLowerCase()
        );
      }
      
      // Apply price range filter
      results = results.filter(
        property => (property.price || 0) >= priceRange[0] && (property.price || 0) <= priceRange[1]
      );
      
      // Apply distance filter - parse the string like "5 min walk" to get the number
      results = results.filter(property => {
        if (!property.distanceToCampus) return true;
        
        const distanceMatch = property.distanceToCampus.match(/(\d+)/);
        if (distanceMatch && distanceMatch[1]) {
          const distance = parseInt(distanceMatch[1]);
          return distance <= maxDistance;
        }
        return true;
      });
      
      setFilteredProperties(results);
      setIsLoading(false);
    }, 300); // Small delay to show loading state
    
    return () => clearTimeout(filterTimer);
  }, [searchQuery, selectedPropertyType, selectedGenderType, priceRange, maxDistance, properties]);
  
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
    
    // Results
    filteredProperties,
    isLoading,
    
    // Actions
    resetFilters
  };
};
