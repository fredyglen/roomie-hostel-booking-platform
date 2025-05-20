
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { Filter, Search } from 'lucide-react';

// Sample property data for demonstration
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Homestel',
    price: 850,
    priceUnit: 'month' as const,
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 23,
    verified: true,
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Security'],
    location: 'East Legon',
    roomTypes: [
      { name: '1 in a room', price: 1700, unit: 'month' },
      { name: '2 in a room', price: 1200, unit: 'month' }
    ],
    occupancy: '1-2 students'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Hostel',
    price: 4000,
    priceUnit: 'semester' as const,
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.2,
    reviewCount: 17,
    verified: true,
    amenities: ['Wi-Fi', 'Shared Kitchen', 'Laundry', 'Water Supply'],
    location: 'Legon',
    roomTypes: [
      { name: '2 in a room', price: 4000, unit: 'semester' },
      { name: '3 in a room', price: 3600, unit: 'semester' }
    ],
    occupancy: '2-3 students'
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Apartment',
    price: 2600,
    priceUnit: 'month' as const,
    address: '789 Campus Drive, Atomic, Accra',
    distanceToCampus: '2 min walk',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 42,
    verified: false,
    amenities: ['Wi-Fi', 'Study Area', 'Cafeteria', '24/7 Security'],
    location: 'Atomic',
    roomTypes: [
      { name: 'Entire apartment', price: 2600, unit: 'month' },
      { name: 'Shared apartment (per student)', price: 950, unit: 'month' }
    ],
    occupancy: '2-4 students'
  },
  {
    id: '4',
    title: '3 in a Room Hostel for Females',
    type: 'Hostel',
    price: 3600,
    priceUnit: 'semester' as const,
    address: '123 Rawlings Circle, Madina, Accra',
    distanceToCampus: '15 min walk',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
    ],
    rating: 4.0,
    reviewCount: 15,
    verified: true,
    amenities: ['Wi-Fi', 'Kitchen', 'Water Supply', 'Security'],
    location: 'Madina',
    roomTypes: [
      { name: '3 in a room', price: 3600, unit: 'semester' }
    ],
    occupancy: '3 students'
  },
  {
    id: '5',
    title: 'Chamber & Hall Self Contained',
    type: 'Homestel',
    price: 1700,
    priceUnit: 'month' as const,
    address: '456 Madina Estate, Madina, Accra',
    distanceToCampus: '20 min walk',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 9,
    verified: true,
    amenities: ['Wi-Fi', 'Kitchen', 'Inner Washroom', 'Water Supply'],
    location: 'Madina',
    roomTypes: [
      { name: 'Chamber & Hall', price: 1700, unit: 'month' }
    ],
    occupancy: '1-2 students'
  }
];

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    location: '',
    amenities: [] as string[]
  });
  
  const [filteredProperties, setFilteredProperties] = useState(sampleProperties);
  
  // Apply filters and search
  useEffect(() => {
    let result = sampleProperties;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.propertyType) {
      result = result.filter(property => property.type === filters.propertyType);
    }
    
    if (filters.location) {
      result = result.filter(property => property.location === filters.location);
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
      amenities: []
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Your Perfect Student Accommodation</h1>
          
          {/* Search and Filter Controls */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search by property name, address or type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={toggleFilters}
                className="flex items-center gap-2"
              >
                <Filter size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            
            {showFilters && (
              <PropertyFilters 
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                onApplyFilters={() => {}}
              />
            )}
          </div>
          
          {/* Results Section */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{filteredProperties.length} properties found</p>
          </div>
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard 
                  key={property.id}
                  property={{
                    ...property,
                    onViewStory: () => navigate(`/student/property/${property.id}/story`),
                    onViewDetails: () => navigate(`/student/property/${property.id}`)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No properties match your search criteria.</p>
              <Button variant="default" onClick={() => handleResetFilters()}>Reset Filters</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
