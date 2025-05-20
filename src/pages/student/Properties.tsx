
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import PropertyList from '@/components/properties/PropertyList';
import PropertyFilters from '@/components/properties/PropertyFilters';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import SearchBar from '@/components/properties/SearchBar';
import ResultsCount from '@/components/properties/ResultsCount';
import { hostelsData, HostelData } from '@/data/hostels';

const Properties: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    location: '',
    amenities: [] as string[],
    genderType: ''
  });
  
  const [filteredProperties, setFilteredProperties] = useState<HostelData[]>(hostelsData);
  
  // Apply filters and search
  useEffect(() => {
    let result = hostelsData;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.propertyCategory.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.propertyType) {
      result = result.filter(property => property.propertyCategory === filters.propertyType);
    }
    
    if (filters.location) {
      result = result.filter(property => property.location === filters.location);
    }
    
    if (filters.genderType) {
      result = result.filter(property => property.genderType === filters.genderType);
    }
    
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      result = result.filter(property => property.price >= min);
    }
    
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      result = result.filter(property => property.price <= max);
    }
    
    if (filters.amenities.length > 0) {
      result = result.filter(property => 
        filters.amenities.every(amenity => 
          property.amenities?.includes(amenity)
        )
      );
    }
    
    setFilteredProperties(result);
  }, [searchQuery, filters]);
  
  const handleResetFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      propertyType: '',
      location: '',
      amenities: [],
      genderType: ''
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-2 sm:px-4">
        <div className="container mx-auto max-w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 px-2">Find Your Perfect Student Accommodation</h1>
          
          {/* Search and Filter Controls */}
          <div className="mb-6 px-2">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
            />
            
            {showFilters && (
              <PropertyFilters 
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                onApplyFilters={() => {}}
              />
            )}
          </div>
          
          {/* Results Count */}
          <ResultsCount count={filteredProperties.length} />
          
          {/* Property List */}
          <PropertyList 
            properties={filteredProperties} 
            emptyMessage="No properties match your search criteria."
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Properties;
