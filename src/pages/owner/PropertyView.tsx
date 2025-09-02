import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/EnhancedAuthContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, MapPin, Users, Home, DollarSign, Calendar } from 'lucide-react';
import { BaseLoading } from '@/components/ui/BaseLoading';
import { BaseError } from '@/components/ui/BaseError';

const PropertyView: React.FC = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property-view', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!propertyId && !!user?.id,
  });

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Property Preview">
        <BaseLoading message="Loading property preview..." />
      </OwnerLayout>
    );
  }

  if (error || !property) {
    return (
      <OwnerLayout pageTitle="Property Preview">
        <BaseError 
          message="Property not found or you don't have permission to view it."
          onRetry={() => window.location.reload()}
        />
      </OwnerLayout>
    );
  }

  const getOccupancyInfo = () => {
    if (property.property_category === 'Apartment') {
      return 'Flexible occupancy - Owner decides';
    }
    return `${property.bedrooms || 0} rooms available`;
  };

  const getAmenities = () => {
    if (Array.isArray(property.amenities)) {
      return property.amenities.slice(0, 8);
    }
    return [];
  };

  return (
    <OwnerLayout pageTitle="Property Preview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/owner/properties">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Property Preview</h1>
              <p className="text-gray-600">How your property appears to students</p>
            </div>
          </div>
          <Link to={`/owner/property/${propertyId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </Link>
        </div>

        {/* Student View Preview */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Student Portal Preview
            </CardTitle>
            <p className="text-sm text-gray-600">
              This is exactly how your property appears to students browsing ROOMi
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {/* Property Card Preview */}
            <div className="border-t">
              {/* Cover Image */}
              <div className="aspect-video w-full bg-gray-100">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt="Property cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-property.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                      <Home className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No cover image uploaded</p>
                      <p className="text-gray-400 text-xs">Students will see a placeholder</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Property Details */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.city}, {property.state}</span>
                    </div>
                    {property.distance_to_campus && (
                      <p className="text-sm text-gray-500 mt-1">{property.distance_to_campus} from campus</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₵{property.rent?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per semester</div>
                  </div>
                </div>

                {/* Property Type & Occupancy */}
                <div className="flex gap-4 items-center">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {property.property_category} - {property.property_type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {getOccupancyInfo()}
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                  <div className="text-center">
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  {property.distance_to_campus && (
                    <div className="text-center">
                      <div className="font-semibold text-sm">{property.distance_to_campus}</div>
                      <div className="text-sm text-gray-600">To Campus</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold">{property.is_available ? 'Available' : 'Not Available'}</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>

                {/* Amenities Preview */}
                {getAmenities().length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {getAmenities().map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities && property.amenities.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Description Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">
                    {property.description}
                  </p>
                </div>

                {/* Pricing Details */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Pricing Information</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Base Price: ₵{property.rent?.toLocaleString()} per semester</div>
                    {property.property_category === 'Apartment' && (
                      <div>✓ Flexible occupancy - Owner decides student count</div>
                    )}
                    {property.utilities_included && (
                      <div>✓ All utilities included in price</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link to={`/owner/property/${propertyId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </Link>
          <Link to="/owner/properties">
            <Button variant="outline">
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default PropertyView;
