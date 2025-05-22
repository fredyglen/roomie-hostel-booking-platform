
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from './PropertyList';
import PropertiesFiltersPanel from './PropertiesFiltersPanel';
import { Property } from '@/types/property';
import { usePropertiesFilter } from '@/hooks/filters';
import { toast } from 'sonner';

interface PropertyListContainerProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({ 
  properties, 
  isLoading = false
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
  
  const handleViewProperty = (id: string) => {
    navigate(`/student/property/${id}`);
  };

  const handleViewStory = (id: string) => {
    // Use the enhanced story view
    navigate(`/student/property/${id}/enhanced-story`);
  };

  const handleError = (error: any) => {
    console.error('Error in PropertyListContainer:', error);
    toast.error("Something went wrong", {
      description: "Please try again later"
    });
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
