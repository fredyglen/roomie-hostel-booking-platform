import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  FilterIcon
} from '@/components/ui/SolarIcons';
import PropertyCard from '@/components/properties/PropertyCard';
import LazyPropertyCard from '@/components/common/LazyPropertyCard';

// Mock property data - replace with real data from Supabase
const mockProperties = [
  {
    id: 1,
    title: "Heaven's Gate Hostel",
    location: "East Legon, 5 min walk to campus",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    reviewCount: 124,
    amenities: ['wifi', 'ac', 'laundry', 'study'],
    roomType: "4 in a Room",
    images: [
      "/api/placeholder/300/400",
      "/api/placeholder/300/400", 
      "/api/placeholder/300/400"
    ]
  },
  {
    id: 2,
    title: "Campus View Residence",
    location: "Madina, 3 min walk to campus",
    image: "/api/placeholder/300/200",
    rating: 4.6,
    reviewCount: 89,
    amenities: ['wifi', 'ac', 'study'],
    roomType: "2 in a Room",
    images: [
      "/api/placeholder/300/400",
      "/api/placeholder/300/400"
    ]
  },
  {
    id: 3,
    title: "Student Paradise Lodge",
    location: "Atomic, 7 min walk to campus",
    image: "/api/placeholder/300/200",
    rating: 4.9,
    reviewCount: 156,
    amenities: ['wifi', 'laundry', 'study'],
    roomType: "Single Room",
    images: [
      "/api/placeholder/300/400",
      "/api/placeholder/300/400",
      "/api/placeholder/300/400",
      "/api/placeholder/300/400"
    ]
  }
];

const PropertyListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const properties = mockProperties;

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/student/property/${propertyId}/story`);
  };

  const handleViewDetails = (propertyId: number) => {
    // Navigate directly to booking flow for faster access
    navigate(`/student/book/${propertyId}`);
  };

  const handleViewStory = (propertyId: number) => {
    navigate(`/student/property/${propertyId}/story`);
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return 'WiFi';
      case 'ac': return 'AC';
      case 'laundry': return 'Laundry';
      case 'study': return 'Study Area';
      default: return amenity;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      paddingBottom: '80px' // Space for bottom navigation
    }}>
      {/* Header with Search */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        zIndex: 10,
        padding: '16px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'absolute',
              left: '14px',
              zIndex: 2,
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <SearchIcon size={18} color="#666" />
            </div>
            <input
              type="text"
              placeholder="Search properties, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                border: '1px solid #e0e0e0',
                borderRadius: '22px',
                paddingLeft: '44px',
                paddingRight: '50px',
                fontSize: '16px',
                outline: 'none',
                background: '#f8f9fa'
              }}
            />
            <button style={{
              position: 'absolute',
              right: '8px',
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '16px',
              background: '#0f68fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <FilterIcon size={16} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {['All', 'Single Room', '2 in a Room', '4 in a Room', 'Near Campus'].map((filter) => (
            <button
              key={filter}
              style={{
                padding: '6px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                background: filter === 'All' ? '#0f68fd' : '#ffffff',
                color: filter === 'All' ? '#ffffff' : '#666',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid - Enhanced PropertyCard */}
      <div style={{
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}
      className="
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-4
      "
      >
        {properties.map((property) => (
          <LazyPropertyCard key={property.id}>
            <PropertyCard
              id={property.id.toString()}
              title={property.title}
              rent={2800} // Default semester price
              location={property.location}
              bedrooms={property.roomType === 'Single Room' ? 1 : property.roomType === '2 in a Room' ? 2 : 4}
              bathrooms={1}
              maxOccupants={property.roomType === 'Single Room' ? 1 : property.roomType === '2 in a Room' ? 2 : 4}
              images={property.images}
              amenities={property.amenities.map(getAmenityLabel)}
              propertyType="Hostel"
              genderRestriction="Mixed"
              isAvailable={true}
              distanceToCampus={property.location.includes('walk') ? property.location.split(',')[1]?.trim() : '5 min walk'}
              totalBedsAvailable={Math.floor(Math.random() * 8) + 1}
              totalBeds={property.roomType === 'Single Room' ? 1 : property.roomType === '2 in a Room' ? 2 : 4}
              priceUnit="semester"
              onViewDetails={() => handleViewDetails(property.id)}
              onViewStory={() => handleViewStory(property.id)}
            />
          </LazyPropertyCard>
        ))}
      </div>
    </div>
  );
};

export default PropertyListing;
