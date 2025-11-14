
import React from 'react';
import { Property } from '@/types/property';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';
import { IMAGE_URLS } from '@/constants/images';
import PropertyTabs from './PropertyTabs';
import PropertyBookingCard from './PropertyBookingCard';
import PropertyOwnerCard from './PropertyOwnerCard';
import PropertyOwnerTags from './PropertyOwnerTags';
import PropertyDetailCoverOverlay from './PropertyDetailCoverOverlay';
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
    const distance = (property as any).distance_to_campus || (property as any).distanceToCampus;
    if (distance === undefined || distance === null) return '';
    return String(distance);
  };

  const getOwnerResponseRate = (): string => {
    const rate = (property.owner as any)?.responseRate;
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
    location: getLocationText({ address: property.address as any, city: (property as any).city, state: (property as any).state }),
    amenities: property.amenities ? getAmenitiesArray(property.amenities) : [],
    price: getPriceNumber(),
    distance_to_campus: getDistanceText(),
    house_rules: getHouseRulesArray().join(', '),
    owner: property.owner ? {
      ...property.owner,
      responseRate: getOwnerResponseRate()
    } : undefined
  };


  // Single cover image derived from property
  const coverImage = deriveCoverImageFromProperty(property);

  // Selected room price from dropdown
  const [selectedRoomPrice, setSelectedRoomPrice] = React.useState<number | undefined>(undefined);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      {/* Back Button */}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 relative">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* ✅ IMAGE GALLERY with COVER OVERLAY */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden h-48 sm:h-64 md:h-80 bg-gray-100">
              <ImageWithFallback
                src={coverImage || IMAGE_URLS.DEFAULT}
                alt={`${property.title} - Cover`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* ✅ Cover-only: overlay preserved */}
            <PropertyDetailCoverOverlay propertyId={property.id} />
          </div>

          {/* ✅ PRODUCTION-GRADE: Owner-Provided Tags */}
          <PropertyOwnerTags
            property={property}
            showTitle={true}
            compact={false}
          />

          {/* Property Details Tabs */}
          <PropertyTabs
            description={property.description}
            address={property.address}
            distanceToCampus={safeProperty.distance_to_campus}
            houseRules={getHouseRulesArray()}
            amenities={safeProperty.amenities}
            type={property.type}
            location={safeProperty.location}
            availableUnits={(property as any).availableUnits}
            goodToKnow={(property as any).good_to_know}
            roomTypes={(property as any).room_types}
            nearestUniversity={(property as any).nearest_university}
            // ✅ NEW: Pass pricing matrix data to tabs
            propertyId={property.id}
            propertyCategory={property.property_category}
            propertyTitle={property.title || (property as any).name}
            onRoomPriceChange={setSelectedRoomPrice}
            // ✅ Transparency fields
            advancePaymentMonths={(property as any).advance_payment_months}
            washroomType={(property as any).washroom_type}
            hasIndividualMeters={(property as any).has_individual_meters}
            allowBillSharing={(property as any).allow_bill_sharing}
            meterType={(property as any).meter_type}
            waterReliability={(property as any).water_reliability}
            waterReliabilityNotes={(property as any).water_reliability_notes}
            parkingAvailable={(property as any).parking_available}
            parkingCost={(property as any).parking_cost}
            internetSpeed={(property as any).internet_speed}
            securityFeatures={(property as any).security_features}
            genderRestriction={(property as any).gender_restriction || (property as any).gender_type}
            cancellationPolicy={(property as any).cancellation_policy}
          />
        </div>

        {/* ✅ STREAMLINED SIDEBAR - Essential Components Only */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Booking Card */}
          <PropertyBookingCard
            property={property}
            onBook={onBookNow}
            onViewStory={onViewStory}
            selectedRoomPrice={selectedRoomPrice}
          />

          {/* ✅ REMOVED: Property Owner Card to prevent outside booking */}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
