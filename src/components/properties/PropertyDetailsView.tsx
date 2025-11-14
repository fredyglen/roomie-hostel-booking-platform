import React from 'react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Star,
  Wifi,
  Car,
  Shield,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/utils/currency';

interface PropertyDetailsViewProps {
  property: Property;
  onBookNow: () => void;
  onGoBack: () => void;
}

// Helper function to get amenity name
const getAmenityName = (amenity: string | { id: string; name: string }): string => {
  return typeof amenity === 'string' ? amenity : amenity.name;
};

const PropertyDetailsView: React.FC<PropertyDetailsViewProps> = ({
  property,
  onBookNow,
  onGoBack
}) => {
  const mainImage = property.images?.[0] || '/placeholder.svg';
  const additionalImages = property.images?.slice(1) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        {property.rating ? (
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">
              ({property.review_count || property.reviewCount || 0} {(property.review_count || property.reviewCount || 0) === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">No reviews yet</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="aspect-video rounded-lg overflow-hidden">
            <ImageWithFallback
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Additional Images */}
          {additionalImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {additionalImages.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-video rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Property Details */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}, {property.city}</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <Badge variant="secondary">{property.type}</Badge>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{property.description}</p>
              </div>

              {/* Amenities Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities?.map((amenity, index) => {
                    const amenityName = getAmenityName(amenity);
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        {amenityName.toLowerCase() === 'wifi' && <span>📶</span>}
                        {amenityName.toLowerCase() === 'parking' && <span>🚗</span>}
                        {amenityName.toLowerCase() === 'security' && <span>🔒</span>}
                        <span>{amenityName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Available from {new Date(property.available_from).toLocaleDateString()}
                    {property.available_to && ` until ${new Date(property.available_to).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(property.rent)}
                </div>
                <div className="text-gray-600">per semester</div>
              </div>

              {property.owner && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Property Owner</h4>
                  <p className="text-sm text-gray-700">{property.owner.name}</p>
                  {property.owner.email && (
                    <p className="text-sm text-gray-600">{property.owner.email}</p>
                  )}
                </div>
              )}

              <Button 
                onClick={onBookNow}
                className="w-full"
                size="lg"
              >
                Book Now
              </Button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                You won't be charged until your booking is confirmed
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsView;
