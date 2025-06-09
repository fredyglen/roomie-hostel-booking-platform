
import React from 'react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Bed } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPropertyClick }) => {
  const getAmenityText = (amenity: string | { id: string; name: string }): string => {
    return typeof amenity === 'string' ? amenity : amenity.name;
  };

  const getLocationText = (location: string | { city: string; state: string; address: string }): string => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.address}, ${location.city}, ${location.state}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card 
          key={property.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onPropertyClick(property)}
        >
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={property.images?.[0] || '/placeholder.svg'}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">
                GH₵{property.price || property.rent}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {property.title || property.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">
                  {getLocationText(property.location)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Max {property.max_occupants}</span>
                </div>
              </div>
              
              {property.amenities && property.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {getAmenityText(amenity)}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PropertyList;
