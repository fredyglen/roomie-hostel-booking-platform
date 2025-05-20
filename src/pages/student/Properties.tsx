
import React from 'react';
import Header from '@/components/layout/Header';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import PropertyList from '@/components/properties/PropertyList';
import PropertiesFiltersPanel from '@/components/properties/PropertiesFiltersPanel';
import { Property } from '@/types/property';
import { usePropertiesFilter } from '@/hooks/usePropertiesFilter';

// Sample properties data (in a real app, this would come from an API)
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Kitatsu Hostel (All Girls Hostel)',
    type: 'Hostel',
    price: 8500,
    priceUnit: 'semester',
    address: 'Near UPSA, Madina, Accra',
    distanceToCampus: '5 min walk',
    images: ['/lovable-uploads/kitatsu_hostel.jpg', '/lovable-uploads/kitatsu_hostel_2.jpg'],
    rating: 4.5,
    reviewCount: 23,
    propertyCategory: 'Hostel',
    genderType: 'Girls'
  },
  {
    id: '2',
    title: 'Prestige Hostel',
    type: 'Hostel',
    price: 12000,
    priceUnit: 'semester',
    address: 'Opposite UPSA, East Legon, Accra',
    distanceToCampus: '2 min walk',
    images: ['/lovable-uploads/prestige_hostel.jpg', '/lovable-uploads/prestige_hostel_2.jpg'],
    rating: 4.7,
    reviewCount: 42,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '3',
    title: 'Makasella Hostel',
    type: 'Hostel',
    price: 7500,
    priceUnit: 'semester',
    address: 'Near UPSA, Accra',
    distanceToCampus: '5 min walk',
    images: ['/lovable-uploads/makasella_hostel.jpg', '/lovable-uploads/makasella_hostel_2.jpg'],
    rating: 4.2,
    reviewCount: 18,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '4',
    title: 'MB3 Hostel',
    type: 'Hostel',
    price: 9000,
    priceUnit: 'semester',
    address: 'Madina, Accra',
    distanceToCampus: '7 min walk',
    images: ['/lovable-uploads/mb3_hostel.jpg', '/lovable-uploads/mb3_hostel_2.jpg'],
    rating: 4.6,
    reviewCount: 31,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '5',
    title: 'Joy Hostel',
    type: 'Hostel',
    price: 7800,
    priceUnit: 'semester',
    address: 'East Legon, Accra',
    distanceToCampus: '10 min walk',
    images: ['/lovable-uploads/joy_hostel.jpg', '/lovable-uploads/joy_hostel_2.jpg'],
    rating: 4.0,
    reviewCount: 15,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '6',
    title: 'Heavens Gate Hostel',
    type: 'Hostel',
    price: 10500,
    priceUnit: 'semester',
    address: 'East Legon, Accra',
    distanceToCampus: '8 min walk',
    images: ['/lovable-uploads/heavens_gate_hostel.jpg', '/lovable-uploads/heavens_gate_hostel_2.jpg'],
    rating: 4.4,
    reviewCount: 27,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '7',
    title: 'Goodwill Hostel',
    type: 'Hostel',
    price: 9000,
    priceUnit: 'semester',
    address: 'Near UPSA, East Legon, Accra',
    distanceToCampus: '6 min walk',
    images: ['/lovable-uploads/goodwill_hostel.jpg', '/lovable-uploads/goodwill_hostel_2.jpg'],
    rating: 4.3,
    reviewCount: 19,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '8',
    title: 'Campus Annex Student Hostel',
    type: 'Hostel',
    price: 8500,
    priceUnit: 'semester',
    address: 'Madina, Accra',
    distanceToCampus: '10 min walk',
    images: ['/lovable-uploads/campus_annex_hostel.jpg', '/lovable-uploads/campus_annex_hostel_2.jpg'],
    rating: 4.1,
    reviewCount: 23,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '9',
    title: 'Green Hostel',
    type: 'Hostel',
    price: 8000,
    priceUnit: 'semester',
    address: 'Behind UPSA, East Legon, Accra',
    distanceToCampus: '3 min walk',
    images: ['/lovable-uploads/green_hostel.jpg', '/lovable-uploads/green_hostel_2.jpg'],
    rating: 4.2,
    reviewCount: 16,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  },
  {
    id: '10',
    title: 'Anodams Hostel',
    type: 'Hostel',
    price: 7800,
    priceUnit: 'semester',
    address: 'Madina, Accra',
    distanceToCampus: '9 min walk',
    images: ['/lovable-uploads/anodams_hostel.jpg', '/lovable-uploads/anodams_hostel_2.jpg'],
    rating: 4.0,
    reviewCount: 12,
    propertyCategory: 'Hostel',
    genderType: 'Mixed'
  }
];

const Properties: React.FC = () => {
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
    isLoading,
    resetFilters
  } = usePropertiesFilter({ properties: sampleProperties });
  
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-1 sm:px-2 md:px-4">
        <div className="container mx-auto max-w-[2000px]">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 px-1">Find Your Perfect Student Accommodation</h1>
          
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
          />
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Properties;
