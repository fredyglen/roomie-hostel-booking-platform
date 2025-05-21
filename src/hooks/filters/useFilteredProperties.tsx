
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

interface FilterState {
  searchQuery: string;
  selectedPropertyType: string;
  selectedGenderType: string;
  priceRange: [number, number];
  maxDistance: number;
}

export const useFilteredProperties = (properties: Property[], filterState: FilterState) => {
  const { searchQuery, selectedPropertyType, selectedGenderType, priceRange, maxDistance } = filterState;
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isLoading, setIsLoading] = useState(false);
  
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
          property.propertyCategory?.toLowerCase() === selectedPropertyType.toLowerCase() ||
          property.property_category?.toLowerCase() === selectedPropertyType.toLowerCase()
        );
      }
      
      // Apply gender type filter
      if (selectedGenderType) {
        results = results.filter(property => 
          property.genderType?.toLowerCase() === selectedGenderType.toLowerCase() ||
          property.gender_type?.toLowerCase() === selectedGenderType.toLowerCase()
        );
      }
      
      // Apply price range filter
      results = results.filter(
        property => (property.price || property.rent || 0) >= priceRange[0] && 
                   (property.price || property.rent || 0) <= priceRange[1]
      );
      
      // Apply distance filter - parse the string like "5 min walk" to get the number
      results = results.filter(property => {
        if (!property.distanceToCampus && !property.distance_to_campus) return true;
        
        const distanceString = property.distanceToCampus || property.distance_to_campus || '';
        const distanceMatch = distanceString.match(/(\d+)/);
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

  return { filteredProperties, isLoading };
};
