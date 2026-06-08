
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';
import { useDynamicProperties } from '@/hooks/property/useDynamicProperties';
import { useGeolocation } from '@/hooks/useGeolocation';
import { rankByProximity } from '@/utils/proximityRanking';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PremiumPropertyCard from '@/components/properties/PremiumPropertyCard';
import { createPropertyLimit } from '@/services/enhanced-property.service';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';







const getPropertyCoverImages = (property: any): string[] => {
	  const coverImage = deriveCoverImageFromProperty(property);
	  return coverImage ? [coverImage] : [];
	};

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q) {
      navigate(`/student/properties?search=${encodeURIComponent(q)}`);
      setRecentSearches((prev) => {
        const next = [q, ...prev.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, 6);
        localStorage.setItem('recent_searches', JSON.stringify(next));
        return next;
      });

    }
  };


  const handleRecentSearch = (search: string) => {
    navigate(`/student/properties?search=${encodeURIComponent(search)}`);
  };

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });


  const { coords, permissionStatus, isLoading: isLocLoading, requestLocation } = useGeolocation();

  const {
    properties = [],
    isLoading: isPropsLoading,
    isError,
  } = useDynamicProperties(
    { filters: { isAvailable: true, verified: true, minPrice: 0, maxPrice: 50000 }, limit: createPropertyLimit(24) }
  );

  const userRegion = useMemo(() => {
    if (!coords) return null as null | { city: string; state?: string };
    const { latitude: lat, longitude: lng } = coords;
    // Heuristic-only mapping for Phase A; Phase B uses DB-backed coordinates.
    if (lat >= 5 && lat <= 6.2 && lng >= -1 && lng <= 0.5) {
      return { city: 'Accra', state: 'Greater Accra' };
    }
    return null;
  }, [coords]);

  const nearestProperties = useMemo(
    () => rankByProximity(properties, { userCity: userRegion?.city, userState: userRegion?.state }).slice(0, 8),
    [properties, userRegion]
  );

  const femaleOnlyProperties = useMemo(
    () => properties.filter((p: any) => (p.gender_restriction || p.gender_type) === 'female').slice(0, 8),
    [properties]
  );

  const nearUPSAProperties = useMemo(
    () => properties.filter((p: any) => String(p.city || '').toLowerCase().includes('accra')).slice(0, 8),
    [properties]
  );

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Explore</h1>

          {/* Search Box */}
          <div className="relative mb-8">
            <Icon
              icon="solar:search-linear"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
              width={20}
              height={20}
            />
            <Input
              type="text"
              placeholder="Search by location, university or property type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="rounded-full flex items-center"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <Icon icon="solar:clock-circle-linear" className="mr-1 text-blue-500" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Location access and status - minimal UI */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Find homes near you</h2>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    {permissionStatus === 'granted' && coords ? (
                      <>
                        <Icon icon="solar:check-circle-linear" className="text-green-600" />
                        <span>Location enabled{userRegion?.city ? ` • ${userRegion.city}` : ''}</span>
                      </>
                    ) : permissionStatus === 'denied' ? (
                      <>
                        <Icon icon="solar:map-point-cross-linear" className="text-gray-500" />
                        <span>Location access denied. Enable in browser settings to see nearby homes.</span>
                      </>
                    ) : permissionStatus === 'unavailable' ? (
                      <>
                        <Icon icon="solar:danger-triangle-linear" className="text-gray-500" />
                        <span>Geolocation not available in this browser.</span>
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:map-point-linear" className="text-blue-500" />
                        <span>Enable location to see homes near you.</span>
                      </>
                    )}
                  </div>
                </div>
                {/* Subtle control — only show when not granted */}
                {permissionStatus !== 'granted' && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{permissionStatus}</Badge>
                    <Button
                      onClick={requestLocation}
                      disabled={isLocLoading}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600"
                    >
                      {isLocLoading ? 'Detecting…' : 'Enable'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Nearest to You */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Nearest to You</h2>
              <Button
                variant="link"
                onClick={() => navigate('/student/properties')}
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            {isPropsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border p-2">
                    <Skeleton className="h-32 w-full mb-2" />
                    <Skeleton className="h-4 w-3/5 mb-1" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="text-sm text-red-600">Failed to load properties.</div>
            ) : nearestProperties.length === 0 ? (
              <div className="text-sm text-gray-600">No nearby properties found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {nearestProperties.map((property: any) => (
                  <PremiumPropertyCard
                    key={String(property.id)}
                    id={property.id}
                    title={property.title || property.name}
                    rent={property.price || property.rent || 0}
                    location={
                      property.address
                        ? `${property.address}, ${property.city || ''}`.trim()
                        : `${property.city || ''}, ${property.state || ''}`.trim()
                    }
                    bedrooms={property.bedrooms || 1}
                    bathrooms={property.bathrooms || 1}
                    maxOccupants={property.max_occupants || property.maxOccupants || 1}
                    images={getPropertyCoverImages(property)}
                    media={property.media}
                    amenities={Array.isArray(property.amenities) ? property.amenities : []}
                    propertyType={property.property_category || property.propertyCategory || property.type || 'Hostel'}
                    genderRestriction={property.gender_restriction || property.gender_type}
                    isAvailable={property.is_available ?? property.status === 'active'}
                    onViewDetails={() => navigate(`/student/property/${String(property.id)}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Female-Only Properties */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Female-Only Properties</h2>
              <Button
                variant="link"
                onClick={() => navigate('/student/properties?gender=female')}
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            {isPropsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border p-2">
                    <Skeleton className="h-32 w-full mb-2" />
                    <Skeleton className="h-4 w-3/5 mb-1" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                ))}
              </div>
            ) : femaleOnlyProperties.length === 0 ? (
              <div className="text-sm text-gray-600">No female-only properties at the moment.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {femaleOnlyProperties.map((property: any) => (
                  <PremiumPropertyCard
                    key={String(property.id)}
                    id={property.id}
                    title={property.title || property.name}
                    rent={property.price || property.rent || 0}
                    location={
                      property.address
                        ? `${property.address}, ${property.city || ''}`.trim()
                        : `${property.city || ''}, ${property.state || ''}`.trim()
                    }
                    bedrooms={property.bedrooms || 1}
                    bathrooms={property.bathrooms || 1}
                    maxOccupants={property.max_occupants || property.maxOccupants || 1}
                    images={getPropertyCoverImages(property)}
                    media={property.media}
                    amenities={Array.isArray(property.amenities) ? property.amenities : []}
                    propertyType={property.property_category || property.propertyCategory || property.type || 'Hostel'}
                    genderRestriction={property.gender_restriction || property.gender_type}
                    isAvailable={property.is_available ?? property.status === 'active'}
                    onViewDetails={() => navigate(`/student/property/${String(property.id)}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Properties in Accra */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Properties in Accra</h2>
              <Button
                variant="link"
                onClick={() => navigate('/student/properties?city=Accra')}
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            {isPropsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border p-2">
                    <Skeleton className="h-32 w-full mb-2" />
                    <Skeleton className="h-4 w-3/5 mb-1" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                ))}
              </div>
            ) : nearUPSAProperties.length === 0 ? (
              <div className="text-sm text-gray-600">No Accra properties at the moment.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {nearUPSAProperties.map((property: any) => (
                  <PremiumPropertyCard
                    key={String(property.id)}
                    id={property.id}
                    title={property.title || property.name}
                    rent={property.price || property.rent || 0}
                    location={
                      property.address
                        ? `${property.address}, ${property.city || ''}`.trim()
                        : `${property.city || ''}, ${property.state || ''}`.trim()
                    }
                    bedrooms={property.bedrooms || 1}
                    bathrooms={property.bathrooms || 1}
                    maxOccupants={property.max_occupants || property.maxOccupants || 1}
                    images={getPropertyCoverImages(property)}
                    media={property.media}
                    amenities={Array.isArray(property.amenities) ? property.amenities : []}
                    propertyType={property.property_category || property.propertyCategory || property.type || 'Hostel'}
                    genderRestriction={property.gender_restriction || property.gender_type}
                    isAvailable={property.is_available ?? property.status === 'active'}
                    onViewDetails={() => navigate(`/student/property/${String(property.id)}`)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Explore;
