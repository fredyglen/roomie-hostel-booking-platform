// Property Detail Tabs Component
// Three-tab system: Description, Amenities/Challenges, Location & Reviews
// Designed for mobile-first property detail modal

import React, { useState } from 'react';
import { MapPin, Wifi, Car, Shield, AlertTriangle, Star, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Flexible property interface for backward compatibility
interface PropertyDetailData {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  amenities?: string[] | Array<{ name: string }>;
  type?: string;
  property_type?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  max_occupants?: number;
  max_occupancy?: number;
  maxOccupants?: number;
  gender_type?: string;
  genderRestriction?: string;
  distance_to_campus?: number | string;
  distanceToCampus?: string;
  price?: number;
  rent?: number;
  base_price_per_semester?: number;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  };
}

interface PropertyDetailTabsProps {
  property: PropertyDetailData;
  activeTab: 'description' | 'pricing' | 'amenities' | 'location';
  onTabChange: (tab: 'description' | 'pricing' | 'amenities' | 'location') => void;
}

// ✅ PHASE 2: Smart Description Component with Character Limit
interface SmartDescriptionProps {
  description: string;
  characterLimit?: number;
}

const SmartDescription: React.FC<SmartDescriptionProps> = ({
  description,
  characterLimit = 400
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return (
      <p className="text-gray-500 italic">No description available for this property.</p>
    );
  }

  const shouldTruncate = description.length > characterLimit;
  const displayText = shouldTruncate && !isExpanded
    ? description.slice(0, characterLimit) + '...'
    : description;

  return (
    <div className="space-y-3">
      <p className="text-gray-700 leading-relaxed text-base">
        {displayText}
      </p>

      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          <span className="flex items-center gap-1">
            {isExpanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </span>
        </Button>
      )}
    </div>
  );
};

// ✅ PHASE 2: Smart Room Options & Pricing Component
interface SmartRoomPricingProps {
  propertyId: string;
  propertyType?: string;
}

const SmartRoomPricing: React.FC<SmartRoomPricingProps> = ({
  propertyId,
  propertyType
}) => {
  // Mock room data - in real app, this would come from usePropertyRoomTypes hook
  const mockRoomOptions = [
    { type: '1 in a room', price: 3500, available: 2 },
    { type: '2 in a room', price: 2800, available: 4 },
    { type: '3 in a room', price: 2200, available: 6 },
    { type: '4 in a room', price: 1800, available: 8 }
  ];

  // Smart display logic
  const getSmartRoomDisplay = () => {
    if (mockRoomOptions.length === 0) return "No room options available";

    const occupancyNumbers = mockRoomOptions.map(room =>
      parseInt(room.type.split(' ')[0])
    ).sort((a, b) => a - b);

    // Check if it's sequential (1,2,3,4,5,6)
    const isSequential = occupancyNumbers.every((num, index) =>
      index === 0 || num === occupancyNumbers[index - 1] + 1
    );

    if (isSequential && occupancyNumbers.length > 2) {
      return `${occupancyNumbers[0]}-${occupancyNumbers[occupancyNumbers.length - 1]} person rooms available`;
    } else {
      return `${occupancyNumbers.join(', ')} ${occupancyNumbers.length === 1 ? 'person room' : 'in a room'} available`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Room Display Header */}
      <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Room Options</span>
        </div>
        <span className="text-xs text-blue-600 font-medium">
          {getSmartRoomDisplay()}
        </span>
      </div>

      {/* Compact Pricing Table */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-gray-900">Pricing per Semester</h4>
        <div className="grid gap-2">
          {mockRoomOptions.map((room, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {room.type.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{room.type}</span>
                  <div className="text-xs text-gray-500">
                    {room.available} bed{room.available !== 1 ? 's' : ''} available
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-primary">¢{room.price.toLocaleString()}</div>
                <div className="text-xs text-gray-500">4 months</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertyDetailTabs: React.FC<PropertyDetailTabsProps> = ({
  property,
  activeTab,
  onTabChange
}) => {
  // Helper functions for safe data access
  const getLocationText = (): string => {
    // Use address field from Property type
    if (property.address) {
      const cityText = property.city ? `, ${property.city}` : '';
      return `${property.address}${cityText}`;
    }
    return 'Location not specified';
  };

  const getAmenitiesArray = (): string[] => {
    // Handle both string[] and object[] amenities
    if (property.amenities) {
      return property.amenities.map(amenity =>
        typeof amenity === 'string' ? amenity : amenity.name || 'Unknown amenity'
      );
    }
    if (property.features?.amenities) return property.features.amenities;
    return [];
  };

  const getDistanceText = (): string => {
    if (property.distance_to_campus) return `${property.distance_to_campus}km`;
    return '';
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
      return <Wifi size={16} className="text-blue-500" />;
    }
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('car')) {
      return <Car size={16} className="text-green-500" />;
    }
    if (lowerAmenity.includes('security') || lowerAmenity.includes('safe')) {
      return <Shield size={16} className="text-purple-500" />;
    }
    return <ThumbsUp size={16} className="text-gray-500" />;
  };

  // Mock challenges data (in real app, this would come from property data)
  const getChallenges = (): string[] => {
    // This would be extracted from property description or separate field
    return [
      'Limited parking spaces',
      'No elevator access',
      'Shared bathroom facilities',
      'Noise from nearby road'
    ];
  };

  // Mock reviews data (in real app, this would come from reviews API)
  const getReviews = () => {
    return [
      {
        id: 1,
        author: 'Sarah K.',
        rating: 5,
        comment: 'Great location, very close to campus. Clean facilities and friendly management.',
        date: '2 weeks ago'
      },
      {
        id: 2,
        author: 'Michael A.',
        rating: 4,
        comment: 'Good value for money. The room was spacious and well-maintained.',
        date: '1 month ago'
      },
      {
        id: 3,
        author: 'Grace M.',
        rating: 4,
        comment: 'Nice amenities and good security. Would recommend to other students.',
        date: '2 months ago'
      }
    ];
  };

  const tabs = [
    { id: 'description', label: 'About' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'location', label: 'Location' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as 'description' | 'pricing' | 'amenities' | 'location')}
            className={`flex-1 py-3 px-2 text-xs font-semibold border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <div className="space-y-6">
            {/* ✅ PHASE 2: Smart Description with Character Limit */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">About this property</h3>
              <SmartDescription
                description={property.description || ''}
                characterLimit={400}
              />
            </div>

            {/* ✅ PHASE 2: Smart Room Options & Pricing */}
            <SmartRoomPricing
              propertyId={property.id.toString()}
              propertyType={property.type || property.property_type || property.propertyType}
            />

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Property Details</h4>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Bedrooms:</span>
                  <span className="font-bold text-gray-900">{property.bedrooms || property.features?.bedrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Bathrooms:</span>
                  <span className="font-bold text-gray-900">{property.bathrooms || property.features?.bathrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Max Occupants:</span>
                  <span className="font-bold text-gray-900">{property.max_occupants || property.max_occupancy || 'N/A'}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Property Type:</span>
                  <span className="font-bold text-gray-900">{property.type || property.property_type || 'Hostel'}</span>
                </div>
              </div>
            </div>

            {property.gender_type && (
              <div>
                <h4 className="text-base font-semibold mb-2 text-gray-900">Restrictions</h4>
                <Badge variant="outline" className="text-sm px-3 py-1 font-medium">
                  {property.gender_type} only
                </Badge>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-4">
            {/* ✅ PHASE 2: Detailed Room Options & Pricing */}
            <SmartRoomPricing
              propertyId={property.id.toString()}
              propertyType={property.type || property.property_type || property.propertyType}
            />

            {/* Compact Payment Information */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">Payment Terms</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-bold text-gray-900">
                    {property.advance_payment_months || 1} month{(property.advance_payment_months || 1) > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-600">Advance Payment</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-bold text-gray-900">
                    {property.allow_bill_sharing ? 'Yes' : 'No'}
                  </div>
                  <div className="text-xs text-gray-600">Bill Sharing</div>
                </div>
              </div>
            </div>

            {/* Compact Booking Information */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 <strong>Booking:</strong> Secure your spot with advance payment. Full semester payment due before move-in.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="space-y-6">
            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ThumbsUp size={20} className="text-green-500" />
                What's included
              </h3>
              <div className="space-y-3">
                {getAmenitiesArray().map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                Things to consider
              </h3>
              <div className="space-y-3">
                {getChallenges().map((challenge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <ThumbsDown size={16} className="text-orange-500" />
                    <span className="text-gray-800">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-6">
            {/* Location Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" />
                Location
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-800">{getLocationText()}</p>
                  {getDistanceText() && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getDistanceText()} from campus
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Reviews
              </h3>
              <div className="space-y-4">
                {getReviews().map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{review.author}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={12} className="text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailTabs;
