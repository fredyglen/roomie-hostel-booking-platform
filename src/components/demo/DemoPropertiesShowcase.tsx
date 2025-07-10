import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFeaturedProperties } from '@/hooks/property/useDynamicProperties';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { MapPin, Users, Bed, Bath, Shield, Wifi, Car } from 'lucide-react';

export const DemoPropertiesShowcase: React.FC = () => {
  const {
    properties,
    isLoading,
    isError,
    error,
    refetch
  } = useFeaturedProperties(12); // Show 12 featured properties

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load properties"
        description={error?.message || "There was an error loading the featured properties."}
        action={
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        }
      />
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        description="No featured properties are currently available."
      />
    );
  }

  // Helper function to get amenity name
  const getAmenityName = (amenity: string | { id: string; name: string }): string => {
    return typeof amenity === 'string' ? amenity : amenity.name;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Property Listings</h2>
        <p className="text-gray-600">
          Browse our realistic Ghana university accommodation listings ({properties.length} properties available)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title || property.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Bed className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge 
                  variant={property.verified ? 'default' : 'secondary'}
                  className={property.verified ? 'bg-green-600' : ''}
                >
                  {property.verified ? (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </>
                  ) : (
                    'Pending'
                  )}
                </Badge>
              </div>

              {/* Price Badge */}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {formatCurrency(property.price || 0)}/month
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight">{property.title || property.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {typeof property.location === 'string' ? property.location : property.location.city}, {typeof property.location === 'string' ? '' : property.location.state}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Property Details */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms || 1} bed
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms || 1} bath
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {property.max_occupants || 1} max
                </div>
              </div>

              {/* Property Type & Category */}
              <div className="flex gap-2">
                <Badge variant="outline">{property.property_category || property.propertyCategory || 'Property'}</Badge>
                <Badge variant="outline">{property.type}</Badge>
              </div>

              {/* Key Amenities */}
              <div className="flex gap-2 flex-wrap">
                {property.amenities?.slice(0, 3).map((amenity, index) => {
                  const amenityName = getAmenityName(amenity);
                  return (
                    <span key={`${property.id}-amenity-${index}`} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
                      {amenityName === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                      {amenityName === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                      {amenityName}
                    </span>
                  );
                })}
                {property.amenities && property.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {property.description}
              </p>

              {/* Action Button */}
              <Button 
                className="w-full" 
                onClick={() => window.open(`/property/${property.id}`, '_blank')}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{properties.length}</div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {new Set(properties.map(p => typeof p.location === 'string' ? p.location : p.location.city)).size}
              </div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                GH₵{Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. Rent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
