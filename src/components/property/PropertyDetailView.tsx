
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
    return typeof price === 'number' ? price.toString() : price;
  };

  const getOwnerResponseRate = (): string => {
    const rate = property.owner?.responseRate;
    return typeof rate === 'number' ? `${rate}%` : 'N/A';
  };

  // Safe data extraction
  const safeProperty = {
    ...property,
    location: getLocationText(property.location),
    amenities: property.amenities ? getAmenitiesArray(property.amenities) : [],
    price: getPriceText(),
    distance_to_campus: property.distance_to_campus || property.distanceToCampus,
    price_unit: property.price_unit || property.priceUnit || 'month',
    owner: {
      ...property.owner,
      responseRate: getOwnerResponseRate()
    }
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
            property={safeProperty}
            amenities={safeProperty.amenities}
            description={property.description}
            location={safeProperty.location}
            houseRules={property.house_rules}
            availableUnits={property.availableUnits}
            distanceToCampus={safeProperty.distance_to_campus}
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
          <PropertyOwnerCard owner={property.owner} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
