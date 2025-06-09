
import React from 'react';
import { Property } from '@/types/property';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyTabs from './PropertyTabs';
import PropertyBookingCard from './PropertyBookingCard';
import PropertyOwnerCard from './PropertyOwnerCard';

interface PropertyDetailViewProps {
  property: Property;
  onBook?: () => void;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onBook }) => {
  // Helper functions to safely extract data
  const getLocationText = (location: string | { city: string; state: string; address: string }): string => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.address}, ${location.city}, ${location.state}`;
  };

  const getAmenityText = (amenity: string | { id: string; name: string }): string => {
    return typeof amenity === 'string' ? amenity : amenity.name;
  };

  const getAmenitiesArray = (amenities: (string | { id: string; name: string })[]): string[] => {
    return amenities.map(getAmenityText);
  };

  const getPriceText = (): string => {
    const price = property.price || property.rent;
    return typeof price === 'number' ? price.toString() : price.toString();
  };

  const getOwnerResponseRate = (): string => {
    const rate = property.owner?.responseRate;
    return typeof rate === 'number' ? `${rate}%` : 'N/A';
  };

  const getDistanceToCampus = (): string => {
    const distance = property.distance_to_campus || property.distanceToCampus;
    return typeof distance === 'number' ? distance.toString() : (distance || '');
  };

  // Safe data extraction
  const safeProperty = {
    ...property,
    location: getLocationText(property.location),
    amenities: property.amenities ? getAmenitiesArray(property.amenities) : [],
    price: getPriceText(),
    distance_to_campus: getDistanceToCampus(),
    price_unit: property.price_unit || property.priceUnit || 'month',
    owner: property.owner ? {
      ...property.owner,
      responseRate: getOwnerResponseRate()
    } : undefined
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <PropertyImageGallery images={property.images} title={property.title} />
          
          {/* Property Details Tabs */}
          <PropertyTabs
            description={property.description}
            address={property.address}
            distanceToCampus={safeProperty.distance_to_campus}
            houseRules={property.house_rules}
            amenities={safeProperty.amenities}
            type={property.type}
            location={safeProperty.location}
            availableUnits={property.availableUnits}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <PropertyBookingCard
            property={safeProperty}
            onBook={onBook}
          />
          
          {/* Owner Card */}
          {property.owner && (
            <PropertyOwnerCard owner={property.owner} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
