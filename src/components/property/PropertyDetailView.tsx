
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

  const getPriceNumber = (): number => {
    const price = property.price || property.rent;
    return typeof price === 'number' ? price : parseFloat(price.toString()) || 0;
  };

  const getDistanceText = (): string => {
    const distance = property.distance_to_campus || property.distanceToCampus;
    if (distance === undefined || distance === null) return '';
    return typeof distance === 'string' ? distance : String(distance);
  };

  const getOwnerResponseRate = (): string => {
    const rate = property.owner?.responseRate;
    if (rate === undefined || rate === null) return 'N/A';
    return typeof rate === 'number' ? `${rate}%` : rate.toString();
  };

  const getHouseRulesArray = (): string[] => {
    const rules = property.house_rules;
    if (!rules) return [];
    if (typeof rules === 'string') return [rules];
    return Array.isArray(rules) ? rules : [];
  };

  // Safe data extraction
  const safeProperty = {
    ...property,
    location: getLocationText(property.location),
    amenities: property.amenities ? getAmenitiesArray(property.amenities) : [],
    price: getPriceNumber(),
    distance_to_campus: getDistanceText(),
    price_unit: property.price_unit || property.priceUnit || 'month',
    house_rules: getHouseRulesArray(),
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
            houseRules={safeProperty.house_rules}
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
