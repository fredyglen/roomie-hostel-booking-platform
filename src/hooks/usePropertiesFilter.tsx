
import { useMemo } from 'react';
import { Property } from '@/types/property';

interface FilterCriteria {
  searchQuery?: string;
  propertyType?: string;
  genderType?: string;
  priceRange?: [number, number];
  maxDistance?: number;
}

export const usePropertiesFilter = (properties: Property[], filters: FilterCriteria) => {
  return useMemo(() => {
    return properties.filter(property => {
      // Search query filter
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = property.name?.toLowerCase().includes(query);
        const matchesTitle = property.title?.toLowerCase().includes(query);
        const matchesDescription = property.description?.toLowerCase().includes(query);
        const matchesLocation = typeof property.location === 'string' 
          ? property.location.toLowerCase().includes(query)
          : `${property.city} ${property.state}`.toLowerCase().includes(query);
        
        if (!matchesName && !matchesTitle && !matchesDescription && !matchesLocation) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all' && property.type !== filters.propertyType) {
        return false;
      }

      // Gender type filter
      if (filters.genderType && filters.genderType !== 'all') {
        const genderRestriction = property.genderType || property.gender_type || property.gender_restriction;
        if (genderRestriction && genderRestriction !== filters.genderType && genderRestriction !== 'any') {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        const price = property.price || property.rent || 0;
        if (price < min || price > max) {
          return false;
        }
      }

      // Distance filter (if distance data is available)
      if (filters.maxDistance && property.distance_to_campus) {
        const distance = property.distance_to_campus;
        // Handle both string and number distance values
        let distanceValue: number;
        if (typeof distance === 'string') {
          // Extract numeric value from string like "5 min walk" or "2.5 km"
          const numericMatch = distance.match(/(\d+(?:\.\d+)?)/);
          distanceValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
        } else {
          distanceValue = Number(distance);
        }
        
        if (distanceValue > filters.maxDistance) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);
};
