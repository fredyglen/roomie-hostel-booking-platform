import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  FilterIcon, 
  LocationIcon, 
  WifiIcon, 
  AirConditionIcon, 
  LaundryIcon, 
  StudyAreaIcon, 
  BedroomIcon,
  StarIcon,
  HeartIcon 
} from '@/components/ui/SolarIcons';

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
  const [properties, setProperties] = useState(mockProperties);
  const [favorites, setFavorites] = useState<number[]>([]);

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/student/property/${propertyId}/story`);
  };

  const toggleFavorite = (propertyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const renderAmenityIcon = (amenity: string) => {
    const iconProps = { size: 14, color: '#0f68fd' };
    switch (amenity) {
      case 'wifi': return <WifiIcon {...iconProps} />;
      case 'ac': return <AirConditionIcon {...iconProps} />;
      case 'laundry': return <LaundryIcon {...iconProps} />;
      case 'study': return <StudyAreaIcon {...iconProps} />;
      default: return null;
    }
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return 'Wifi';
      case 'ac': return 'Air Condition';
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
            <SearchIcon 
              size={18} 
              color="#666" 
              style={{
                position: 'absolute',
                left: '14px',
                zIndex: 2
              }}
            />
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

      {/* Property Grid */}
      <div style={{
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {properties.map((property) => (
          <div
            key={property.id}
            onClick={() => handlePropertyClick(property.id)}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* Property Image */}
            <div style={{
              position: 'relative',
              height: '180px',
              background: `url(${property.image}) center/cover`,
              borderRadius: '16px 16px 0 0'
            }}>
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(property.id, e)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <HeartIcon 
                  size={16} 
                  color="#0f68fd" 
                  filled={favorites.includes(property.id)} 
                />
              </button>

              {/* Room Type Badge */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15, 104, 253, 0.9)',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <BedroomIcon size={12} color="#ffffff" style={{ marginRight: '4px' }} />
                {property.roomType}
              </div>
            </div>

            {/* Property Details */}
            <div style={{ padding: '16px' }}>
              {/* Title */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#202124',
                margin: '0 0 4px 0',
                lineHeight: '1.3'
              }}>
                {property.title}
              </h3>

              {/* Location */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '12px'
              }}>
                <LocationIcon size={12} color="#666" />
                <span style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.2'
                }}>
                  {property.location}
                </span>
              </div>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '12px'
              }}>
                <StarIcon size={12} color="#FFD700" filled />
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#202124'
                }}>
                  {property.rating}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  ({property.reviewCount} reviews)
                </span>
              </div>

              {/* Amenities */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {property.amenities.slice(0, 4).map((amenity) => (
                  <div
                    key={amenity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#0f68fd',
                      fontWeight: '500'
                    }}
                  >
                    {renderAmenityIcon(amenity)}
                    {getAmenityLabel(amenity)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyListing;
