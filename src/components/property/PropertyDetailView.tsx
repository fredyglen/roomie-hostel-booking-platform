
import React from 'react';
import { Property } from '@/types/property';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyTabs from './PropertyTabs';
import PropertyBookingCard from './PropertyBookingCard';
import PropertyOwnerCard from './PropertyOwnerCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PropertyDetailViewProps {
  property: Property;
  onBookNow?: () => void;
  onGoBack?: () => void;
  onViewStory?: () => void;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onBookNow, onGoBack, onViewStory }) => {
  // Apple-grade error handling: Guard against undefined property
  if (!property) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for could not be loaded.</p>
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Helper functions to safely extract data with Apple-grade error handling
  const getLocationText = (location?: string | { city?: string; state?: string; address?: string } | null): string => {
    if (!location) {
      return 'Location not specified';
    }
    if (typeof location === 'string') {
      return location;
    }
    // Safely construct location string with fallbacks
    const address = location.address || '';
    const city = location.city || '';
    const state = location.state || '';

    const parts = [address, city, state].filter(part => part.trim().length > 0);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  const getAmenityText = (amenity: string | { id?: string; name?: string } | null | undefined): string => {
    if (!amenity) return '';
    if (typeof amenity === 'string') return amenity;
    return amenity.name || amenity.id || '';
  };

  const getAmenitiesArray = (amenities?: (string | { id?: string; name?: string } | null)[] | null): string[] => {
    if (!amenities || !Array.isArray(amenities)) return [];
    return amenities.map(getAmenityText).filter(text => text.length > 0);
  };

  const getPriceNumber = (): number => {
    const price = property.price || property.rent;
    return typeof price === 'number' ? price : parseFloat(String(price) || '0') || 0;
  };

  const getDistanceText = (): string => {
    const distance = property.distance_to_campus || property.distanceToCampus;
    if (distance === undefined || distance === null) return '';
    return String(distance);
  };

  const getOwnerResponseRate = (): string => {
    const rate = property.owner?.responseRate;
    if (rate === undefined || rate === null) return 'N/A';
    return typeof rate === 'number' ? `${rate}%` : String(rate);
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
    house_rules: getHouseRulesArray().join(', '),
    owner: property.owner ? {
      ...property.owner,
      responseRate: getOwnerResponseRate()
    } : undefined
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      {/* Back Button */}
      {onGoBack && (
        <div className="mb-4">
          <Button variant="outline" onClick={onGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Image Gallery */}
          <PropertyImageGallery images={property.images} title={property.title} />
          
          {/* Property Details Tabs */}
          <PropertyTabs
            description={property.description}
            address={property.address}
            distanceToCampus={safeProperty.distance_to_campus}
            houseRules={getHouseRulesArray()}
            amenities={safeProperty.amenities}
            type={property.type}
            location={safeProperty.location}
            availableUnits={property.availableUnits}
            goodToKnow={property.good_to_know}
            roomTypes={property.room_types}
            nearestUniversity={property.nearest_university}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <PropertyBookingCard
            property={property}
            onBook={onBookNow}
            onViewStory={onViewStory}
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
