import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  FilterIcon
} from '@/components/ui/SolarIcons';
import PropertyCard from '@/components/properties/PropertyCard';
import LazyPropertyCard from '@/components/common/LazyPropertyCard';
import ViewingProgressIndicator from '@/components/properties/ViewingProgressIndicator';
import SimpleRegistrationModal from '@/components/auth/SimpleRegistrationModal';
import PropertyDetailWrapper from '@/components/property/PropertyDetailWrapper';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { usePropertyViewingTracker } from '@/hooks/usePropertyViewingTracker';
import { useAnonymousTimeLimit } from '@/hooks/useAnonymousTimeLimit';
import { useDynamicProperties } from '@/hooks/property/useDynamicProperties';
import { Property } from '@/types/property';


const PropertyListing: React.FC = () => {
  const navigate = useNavigate();
  const { getViewingProgress, isAnonymous } = usePropertyViewingTracker();
  const { shouldBlockAction } = useAnonymousTimeLimit();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [occupants, setOccupants] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [useAppleGradeDisplay, setUseAppleGradeDisplay] = useState(true); // Apple-grade display toggle
  const containerRef = useRef<HTMLDivElement>(null);

  // Use ONLY real database properties - NO FALLBACK TO MOCK DATA
  const {
    properties,
    isLoading,
    isError,
    error,
    totalCount,
    refetch
  } = useDynamicProperties({
    filters: {
      isAvailable: true
    },
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Check time limit before allowing actions
  const checkTimeLimitAndProceed = (action: 'navigation' | 'property_view' | 'search' | 'filter', callback: () => void) => {
    if (shouldBlockAction(action)) {
      setShowRegistrationModal(true);
      return;
    }
    callback();
  };



  const handleCloseModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleBookNow = () => {
    if (selectedProperty) {
      handleCloseModal();
      navigate(`/student/book/${selectedProperty.id}`);
    }
  };

  // Apple-grade hostel selection handler
  const handleAppleGradeHostelSelect = (hostel: HostelProperty) => {
    checkTimeLimitAndProceed('property_view', () => {
      setSelectedProperty(hostel);
      setShowPropertyModal(true);
    });
  };

  // Apple-grade error handler
  const handleAppleGradeError = (error: unknown) => {
    console.error('Apple-grade hostel display error:', error);
    // Fallback to traditional display on error
    setUseAppleGradeDisplay(false);
  };

  const handleModalViewStory = () => {
    if (selectedProperty) {
      handleCloseModal();
      navigate(`/student/property/${selectedProperty.id}/story`);
    }
  };

  const handleViewDetails = (propertyId: string | number) => {
    checkTimeLimitAndProceed('property_view', () => {
      console.log('Navigating to property details page for property:', propertyId);
      // Navigate to dedicated property details page instead of modal
      navigate(`/student/property/${propertyId}`);
    });
  };

  const handleViewStory = (propertyId: number) => {
    checkTimeLimitAndProceed('property_view', () => {
      console.log('View story clicked for property:', propertyId);
      navigate(`/student/property/${propertyId}/story`);
    });
  };

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return 'WiFi';
      case 'ac': return 'AC';
      case 'laundry': return 'Laundry';
      case 'study': return 'Study Area';
      case 'water': return 'Water Supply';
      case 'shared_bathroom': return 'Shared Washroom';
      case 'private_bathroom': return 'Private Washroom';
      case 'study_area': return 'Study Area';
      case 'kitchen': return 'Kitchen';
      case 'security': return 'Security';
      case 'recreation': return 'Recreation';
      case 'shopping': return 'Shopping';
      case 'dining': return 'Dining';
      case 'parking': return 'Parking';
      case 'transport': return 'Transport';
      case 'maintenance': return 'Well-maintained';
      case 'ventilation': return 'Ventilated';
      case 'space_efficient': return 'Compact';
      case 'proximity': return 'Close to Campus';
      case 'basic_amenities': return 'Basic Facilities';
      case 'multiple_blocks': return 'Multiple Buildings';
      case 'comfort': return 'Comfortable';
      case 'full_amenities': return 'All Facilities';
      case 'gender_specific': return 'Gender Specific';
      case 'popular': return 'Popular Choice';
      case 'flexible_terms': return 'Flexible Terms';
      case 'open_policy': return 'Open Access';
      case 'modern': return 'Modern';
      case 'cleanliness': return 'Clean';
      case 'peaceful': return 'Peaceful';
      case 'spacious': return 'Spacious';
      default: return amenity.charAt(0).toUpperCase() + amenity.slice(1);
    }
  };

  // Filter properties based on selected filter and search query
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' ||
                         property.roomType === selectedFilter ||
                         (selectedFilter === 'Near Campus' && property.location.includes('walk'));

    return matchesSearch && matchesFilter;
  });

  const handleFilterClick = (filter: string) => {
    checkTimeLimitAndProceed('filter', () => {
      setSelectedFilter(filter);
      console.log('Filter selected:', filter);
    });
  };

  const handleFilterToggle = () => {
    checkTimeLimitAndProceed('filter', () => {
      setShowFilters(!showFilters);
      console.log('Filter panel toggled:', !showFilters);
    });
  };

  const handleSearchChange = (value: string) => {
    checkTimeLimitAndProceed('search', () => {
      setSearchQuery(value);
    });
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      console.log('Swipe up detected - could open filters or property details');
      setShowFilters(true);
    }

    if (isDownSwipe) {
      console.log('Swipe down detected - could close filters');
      setShowFilters(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-600">Loading properties...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full px-4">
            <ErrorDisplay
              title="Unable to load properties"
              error={error || 'An unexpected error occurred while loading properties.'}
              onRetry={refetch}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        paddingBottom: '80px' // Space for bottom navigation
      }}
    >
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
              left: '10px',
              zIndex: 2,
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <SearchIcon size={14} color="#666" />
            </div>
            <input
              type="text"
              placeholder="Search properties, locations..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                paddingLeft: '32px',
                paddingRight: '36px',
                fontSize: '14px',
                outline: 'none',
                background: '#f8f9fa'
              }}
            />
            <button
              onClick={handleFilterToggle}
              style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                border: 'none',
                borderRadius: '12px',
                background: showFilters ? '#0d5bdd' : '#0f68fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <FilterIcon size={12} color="#ffffff" />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter button clicked:', filter);
                handleFilterClick(filter);
              }}
              style={{
                padding: '4px 8px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                background: filter === selectedFilter ? '#0f68fd' : '#ffffff',
                color: filter === selectedFilter ? '#ffffff' : '#666',
                fontSize: '11px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Occupancy Selector - Compact */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px',
          padding: '6px 8px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
            Occupants:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Decrease occupants clicked');
                setOccupants(Math.max(1, occupants - 1));
              }}
              style={{
                width: '24px',
                height: '24px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#666',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              -
            </button>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#0f68fd',
              minWidth: '16px',
              textAlign: 'center'
            }}>
              {occupants}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Increase occupants clicked');
                setOccupants(Math.min(4, occupants + 1));
              }}
              style={{
                width: '24px',
                height: '24px',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#666',
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>



      {/* Viewing Progress Indicator for Anonymous Users */}
      {isAnonymous && (
        <div className="px-4 pb-2">
          <ViewingProgressIndicator
            progress={getViewingProgress()}
            isVisible={true}
          />
        </div>
      )}

      {/* Results Counter */}
      <div style={{
        padding: '8px 8px 4px 8px',
        fontSize: '12px',
        color: '#666',
        fontWeight: '500'
      }}>
        {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'} found
        {selectedFilter !== 'All' && ` • Filtered by: ${selectedFilter}`}
        {occupants > 1 && ` • ${occupants} occupants`}
      </div>

      {/* ✅ REMOVED: Display mode toggle - should not be visible to end users */}
      {/* Apple-Grade is now the default with automatic fallback to Traditional on errors */}
      {import.meta.env.DEV && (
        /* Developer-only toggle in development mode */
        <div className="px-4 mb-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-yellow-700">🧪 DEV MODE - Display:</span>
            <button
              onClick={() => setUseAppleGradeDisplay(!useAppleGradeDisplay)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                useAppleGradeDisplay
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {useAppleGradeDisplay ? '🍎 Apple-Grade' : '📱 Traditional'}
            </button>
          </div>
        </div>
      )}



      {/* Conditional Property Display */}
      {useAppleGradeDisplay ? (
        /* Apple-Grade Hostel Display Component */
        <div className="px-4">
          <AppleGradeHostelDisplay
            searchCriteria={{
              query: searchQuery,
              genderRestriction: selectedFilter !== 'All' ? selectedFilter : undefined,
              sortBy: 'newest'
            }}
            onHostelSelect={handleAppleGradeHostelSelect}
            onError={handleAppleGradeError}
            enableVirtualization={filteredProperties.length > 10}
            className="apple-grade-property-listing"
          />
        </div>
      ) : (
        /* Traditional Property Grid - Mobile-First Responsive */
        <div className="px-2 py-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <LazyPropertyCard key={property.id}>
                <PropertyCard
                  id={property.id.toString()}
                  title={property.title || property.name}
                  rent={property.rent || property.price || property.base_price_per_semester || 0}
                  location={property.address}
                  bedrooms={property.bedrooms || 1}
                  bathrooms={property.bathrooms || 1}
                  maxOccupants={property.max_occupants || 1}
                  images={property.images || []}
                  media={property.media}
                  amenities={property.amenities ? property.amenities.map(getAmenityLabel) : []}
                  propertyType={property.property_type || property.type || "hostel"}
                  genderRestriction={(property as any).gender_type || (property as any).gender_restriction}
                  isAvailable={property.is_available !== false}
                  distanceToCampus={(property as any).distance_to_campus || 'N/A'}
                  totalBedsAvailable={(property as any).beds_available || (property.max_occupants - ((property as any).current_occupancy || 0))}
                  totalBeds={property.max_occupants || 1}
                  priceUnit="semester"
                  onViewDetails={() => handleViewDetails(property.id)}
                  onViewStory={() => handleViewStory(property.id)}
                />
              </LazyPropertyCard>
            ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              No properties found
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('All');
                setOccupants(1);
              }}
              style={{
                padding: '8px 16px',
                background: '#0f68fd',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
        </div>
      )}

      {/* Simple Registration Modal */}
      <SimpleRegistrationModal
        isVisible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />

      {/* Property Detail Wrapper - Responsive */}
      {selectedProperty && (
        <PropertyDetailWrapper
          property={selectedProperty}
          isOpen={showPropertyModal}
          onClose={handleCloseModal}
          onBookNow={handleBookNow}
          onViewStory={handleModalViewStory}
        />
      )}
      <StudentNavBar />
    </div>
  );
};

export default PropertyListing;
