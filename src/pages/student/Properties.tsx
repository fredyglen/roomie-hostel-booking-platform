
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/PropertyCard';
import Button from '@/components/common/Button';
import { Input } from '@/components/ui/input';

// Sample property data for demonstration
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
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
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Security']
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: 500,
    priceUnit: 'month' as const,
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.2,
    reviewCount: 17,
    verified: true,
    amenities: ['Wi-Fi', 'Shared Kitchen', 'Laundry', 'Water Supply']
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'semester' as const,
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 42,
    verified: false,
    amenities: ['Wi-Fi', 'Study Area', 'Cafeteria', '24/7 Security']
  }
];

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyType: '',
    amenities: [] as string[]
  });
  
  // Filter properties based on search query
  const filteredProperties = sampleProperties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Find Accommodation</h1>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search by property name or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="primary">Search</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={filters.propertyType}
                  onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Studio">Studio</option>
                  <option value="Shared">Shared</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <Input 
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <Input 
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => setFilters({
                  priceMin: '',
                  priceMax: '',
                  propertyType: '',
                  amenities: []
                })}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
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
              <Button variant="primary" onClick={() => setSearchQuery('')}>Reset Search</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Properties;
