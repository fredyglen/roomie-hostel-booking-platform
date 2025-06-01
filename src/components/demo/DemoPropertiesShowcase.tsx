
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDemoProperties } from '@/hooks/property/useDemoProperties';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import EmptyState from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { MapPin, Users, Bed, Bath, Shield, Wifi, Car } from 'lucide-react';

export const DemoPropertiesShowcase: React.FC = () => {
  const { data: properties, isLoading, error } = useDemoProperties();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load properties"
        description="There was an error loading the demo properties."
      />
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        description="No demo properties are currently available."
      />
    );
  }

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
                  alt={property.title}
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
                  variant={property.verification_status === 'verified' ? 'default' : 'secondary'}
                  className={property.verification_status === 'verified' ? 'bg-green-600' : ''}
                >
                  {property.verification_status === 'verified' ? (
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
                  {formatCurrency(property.rent || 0)}/month
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight">{property.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {property.city}, {property.state}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Property Details */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms} bed
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms} bath
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {property.max_occupants || 1} max
                </div>
              </div>

              {/* Property Type & Category */}
              <div className="flex gap-2">
                <Badge variant="outline">{property.property_category}</Badge>
                <Badge variant="outline">{property.type}</Badge>
              </div>

              {/* Key Amenities */}
              <div className="flex gap-2 flex-wrap">
                {property.amenities?.slice(0, 3).map((amenity) => (
                  <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
                    {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                    {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                    {amenity}
                  </span>
                ))}
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

              {/* Owner Info */}
              {property.owner && (
                <div className="text-xs text-gray-500 border-t pt-2">
                  Owner: {property.owner.name}
                </div>
              )}

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
                {properties.filter(p => p.verification_status === 'verified').length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {new Set(properties.map(p => p.city)).size}
              </div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                GH₵{Math.round(properties.reduce((sum, p) => sum + (p.rent || 0), 0) / properties.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. Rent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
