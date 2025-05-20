
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PropertyCard from '@/components/PropertyCard';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';

// Sample favorited properties for demonstration
const sampleFavorites = [
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
  }
];

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(sampleFavorites);

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>
          
          {favorites.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">{favorites.length} saved properties</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1">
                {favorites.map(property => (
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
            </>
          ) : (
            <div className="text-center py-12">
              <Icon icon="solar:heart-broken-linear" className="mx-auto text-gray-400" width={64} height={64} />
              <h2 className="text-xl font-semibold mt-4 mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                Save properties you like by tapping the heart icon on a property card
              </p>
              <button 
                onClick={() => navigate('/student/properties')}
                className="text-blue-500 font-medium flex items-center gap-1 mx-auto"
              >
                <Icon icon="solar:home-2-linear" width={16} height={16} />
                Browse properties
              </button>
            </div>
          )}
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Favorites;
