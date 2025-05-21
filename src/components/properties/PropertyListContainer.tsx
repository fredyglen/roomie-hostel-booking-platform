
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from './PropertyList';
import PropertiesFiltersPanel from './PropertiesFiltersPanel';
import { Property } from '@/types/property';
import { usePropertiesFilter } from '@/hooks/filters';
import { navigateToProperty, navigateToStory } from '@/utils/navigation';

interface PropertyListContainerProps {
  properties: Property[];
  isLoading?: boolean;
  onPropertySelect?: (property: Property) => void;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({ 
  properties, 
  isLoading = false,
  onPropertySelect
}) => {
  const navigate = useNavigate();
  
  // Use the custom hook for handling property filtering
  const {
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
  } = usePropertiesFilter({ properties });
  
  // Use the navigation utilities for standardized routing
  const handleViewProperty = (id: string) => {
    navigateToProperty(navigate, id);
  };

  const handleViewStory = (id: string) => {
    navigateToStory(navigate, id);
  };
  
  return (
    <>
      {/* Search and Filter Controls */}
      <PropertiesFiltersPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedGenderType={selectedGenderType}
        setSelectedGenderType={setSelectedGenderType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        resetFilters={resetFilters}
        filteredPropertiesCount={filteredProperties.length}
      />
      
      {/* Property List */}
      <PropertyList 
        properties={filteredProperties} 
        isLoading={isLoading}
        onResetFilters={resetFilters}
        onViewProperty={handleViewProperty}
        onViewStory={handleViewStory}
      />
    </>
  );
};

export default PropertyListContainer;
