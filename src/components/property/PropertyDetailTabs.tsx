// Property Detail Tabs Component
// Three-tab system: Description, Amenities/Challenges, Location & Reviews
// Designed for mobile-first property detail modal

import React from 'react';
import { MapPin, Wifi, Car, Shield, AlertTriangle, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';

interface PropertyDetailTabsProps {
  property: Property;
  activeTab: 'description' | 'amenities' | 'location';
  onTabChange: (tab: 'description' | 'amenities' | 'location') => void;
}

const PropertyDetailTabs: React.FC<PropertyDetailTabsProps> = ({
  property,
  activeTab,
  onTabChange
}) => {
  // Helper functions for safe data access
  const getLocationText = (): string => {
    if (typeof property.location === 'string') {
      return property.location;
    }
    if (property.location && typeof property.location === 'object') {
      return `${property.location.address || ''}, ${property.location.city || ''}`.trim().replace(/^,\s*/, '');
    }
    return 'Location not specified';
  };

  const getAmenitiesArray = (): string[] => {
    if (!property.amenities) return [];
    return property.amenities.map(amenity => 
      typeof amenity === 'string' ? amenity : amenity.name || 'Unknown amenity'
    );
  };

  const getDistanceText = (): string => {
    if (property.distanceToCampus) return property.distanceToCampus;
    if (property.distance_to_campus) return property.distance_to_campus;
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
    { id: 'description', label: 'Description' },
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
            onClick={() => onTabChange(tab.id as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About this property</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description || 'No description available for this property.'}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Property Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium">{property.bedrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium">{property.bathrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Occupants:</span>
                  <span className="font-medium">{property.maxOccupants || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium">{property.propertyType || 'Hostel'}</span>
                </div>
              </div>
            </div>

            {property.genderRestriction && (
              <div>
                <h4 className="font-medium mb-2">Restrictions</h4>
                <Badge variant="outline" className="text-sm">
                  {property.genderRestriction} only
                </Badge>
              </div>
            )}
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
