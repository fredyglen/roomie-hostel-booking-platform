import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyList from './PropertyList';
import PropertiesFiltersPanel from './PropertiesFiltersPanel';
import { Property } from '@/types/property';
import { usePropertiesFilter } from '@/hooks/filters';
import { toast } from '@/components/ui/sonner';
import { navigateToProperty, navigateToStory } from '@/utils/navigation';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { logger } from '@/utils/logger';

interface PropertyListContainerProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({ 
  properties, 
  isLoading = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    logger.debug('Navigating to property detail', { id });
    navigateToProperty(navigate, id, { 
      from: location.pathname + location.search,
      preserveHistory: true 
    });
  };

  const handleViewStory = (id: string) => {
    logger.debug('Navigating to property story', { id });
    navigateToStory(navigate, id, { 
      from: location.pathname + location.search,
      preserveHistory: true 
    });
  };

  const handleError = (error: unknown) => {
    ErrorHandler.handle(error, 'Error in PropertyListContainer:');
    toast.error("Something went wrong", {
      description: "Please try again later"
    });
  };
  
  return (
    <div className="property-list-container">
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
    </div>
  );
};

export default PropertyListContainer;
