import { useMemo } from 'react';
import { Property, Location } from '@/types/property';
import { PRICE_FILTER_DEFAULTS } from '@/config/constants';

interface PropertyFilters {
  gender: string;
  priceRange: { min: number; max: number };
  location: string;
  amenities: string[];
  propertyType: string;
}

export const useFilteredProperties = (properties: Property[], filters: PropertyFilters) => {
  return useMemo(() => {
    if (!properties) return [];

    return properties.filter(property => {
      // Gender filter
      if (filters.gender && filters.gender !== 'any') {
        const genderRestriction = property.genderType || property.gender_type || property.gender_restriction;
        if (genderRestriction && genderRestriction !== filters.gender && genderRestriction !== 'any') {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange.min > 0 || filters.priceRange.max < PRICE_FILTER_DEFAULTS.MAX) {
        const price = property.price || property.rent || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Location filter
      if (filters.location) {
        const locationStr = typeof property.location === 'string' 
          ? property.location 
          : `${(property.location as Location).city} ${(property.location as Location).state}`;
        
        if (!locationStr.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const propertyAmenities = property.amenities?.map(amenity => 
          typeof amenity === 'string' ? amenity.toLowerCase() : amenity.name.toLowerCase()
        ) || [];
        
        const hasAllAmenities = filters.amenities.every(filterAmenity =>
          propertyAmenities.some(propAmenity => propAmenity.includes(filterAmenity.toLowerCase()))
        );
        
        if (!hasAllAmenities) return false;
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.type !== filters.propertyType) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);
};
