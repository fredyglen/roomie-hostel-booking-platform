
import React from 'react';
import SearchBar from '@/components/properties/SearchBar';
import ResultsCount from '@/components/properties/ResultsCount';
import PropertyFilters from '@/components/properties/PropertyFilters';

interface PropertiesFiltersPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedPropertyType: string;
  setSelectedPropertyType: (type: string) => void;
  selectedGenderType: string;
  setSelectedGenderType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  resetFilters: () => void;
  filteredPropertiesCount: number;
}

const PropertiesFiltersPanel: React.FC<PropertiesFiltersPanelProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedGenderType,
  setSelectedGenderType,
  priceRange,
  setPriceRange,
  maxDistance,
  setMaxDistance,
  resetFilters,
  filteredPropertiesCount
}) => {
  return (
    <div className="mb-6 px-1">
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      
      {/* Filter Panel */}
      {showFilters && (
        <PropertyFilters 
          propertyType={selectedPropertyType}
          onPropertyTypeChange={setSelectedPropertyType}
          genderType={selectedGenderType}
          onGenderTypeChange={setSelectedGenderType}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          maxDistance={maxDistance}
          onMaxDistanceChange={setMaxDistance}
          onResetFilters={resetFilters}
        />
      )}
      
      <ResultsCount count={filteredPropertiesCount} />
    </div>
  );
};

export default PropertiesFiltersPanel;
