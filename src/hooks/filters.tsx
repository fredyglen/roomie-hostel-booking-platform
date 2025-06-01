
import { useState, useMemo } from 'react';
import { Property } from '@/types/property';

interface UsePropertiesFilterProps {
  properties: Property[];
}

export const usePropertiesFilter = ({ properties }: UsePropertiesFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedGenderType, setSelectedGenderType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesAddress = property.address?.toLowerCase().includes(query);
        const matchesCity = property.city?.toLowerCase().includes(query);
        const matchesAmenities = property.amenities?.some(amenity => 
          amenity.toLowerCase().includes(query)
        );
        
        if (!matchesTitle && !matchesAddress && !matchesCity && !matchesAmenities) {
          return false;
        }
      }

      // Property type filter
      if (selectedPropertyType && selectedPropertyType !== 'all') {
        const propertyCategory = property.property_category || property.propertyCategory;
        if (propertyCategory?.toLowerCase() !== selectedPropertyType.toLowerCase()) {
          return false;
        }
      }

      // Gender type filter
      if (selectedGenderType && selectedGenderType !== 'all') {
        const genderRestriction = property.gender_restriction || property.genderType;
        if (genderRestriction?.toLowerCase() !== selectedGenderType.toLowerCase()) {
          return false;
        }
      }

      // Price range filter
      const price = property.rent || property.price || 0;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [properties, searchQuery, selectedPropertyType, selectedGenderType, priceRange, maxDistance]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPropertyType('');
    setSelectedGenderType('');
    setPriceRange([0, 5000]);
    setMaxDistance(10);
  };

  return {
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
    filteredProperties,
    resetFilters
  };
};
