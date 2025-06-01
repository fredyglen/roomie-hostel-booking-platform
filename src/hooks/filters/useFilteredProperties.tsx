
import { useMemo } from 'react';
import { Property } from '@/types/property';

interface FilterOptions {
  search?: string;
  priceRange?: [number, number];
  propertyType?: string;
  genderType?: string;
  location?: string;
  amenities?: string[];
}

export const useFilteredProperties = (properties: Property[], filters: FilterOptions) => {
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter(property => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = property.price || property.rent || 0;
        const [minPrice, maxPrice] = filters.priceRange;
        if (price < minPrice || price > maxPrice) return false;
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        const propertyType = property.type || property.property_type || '';
        if (!propertyType.toLowerCase().includes(filters.propertyType.toLowerCase())) {
          return false;
        }
      }

      // Gender type filter
      if (filters.genderType && filters.genderType !== 'all') {
        const genderType = property.genderType || property.gender_type || property.gender_restriction || '';
        if (genderType.toLowerCase() !== filters.genderType.toLowerCase()) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location !== 'all') {
        const location = property.location || property.address || property.city || '';
        if (!location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const propertyAmenities = property.amenities || [];
        const hasAllAmenities = filters.amenities.every(amenity =>
          propertyAmenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [properties, filters]);

  return filteredProperties;
};
