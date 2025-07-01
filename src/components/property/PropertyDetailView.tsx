
/**
 * Property Detail View Component for ROOMi Platform
 * Displays comprehensive property information with proper type safety
 *
 * @fileoverview Apple-Level Property Detail View Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

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

/**
 * Property Detail View Component
 * Displays property information using the correct Property interface
 */
const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onBook }) => {
  // Extract data using the correct Property interface structure
  const {
    id,
    name,
    description,
    type,
    status,
    address,
    price,
    features,
    media,
    owner,
    verificationStatus
  } = property;

  // Format location string from address
  const locationText = `${address.street}, ${address.city}, ${address.state}`;

  // Get amenities array from features
  const amenitiesArray = features.amenities || [];

  // Get house rules array from features
  const houseRulesArray = features.rules || [];

  // Get images array from media
  const imagesArray = media.map(m => m.url);

  // Calculate distance to campus (placeholder - would come from external service)
  const distanceToCampus = '2.5 km'; // TODO: Implement distance calculation

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <PropertyImageGallery
            images={imagesArray}
            title={name}
            propertyId={id}
          />

          {/* Property Details Tabs */}
          <PropertyTabs
            description={description}
            address={locationText}
            distanceToCampus={distanceToCampus}
            houseRules={houseRulesArray}
            amenities={amenitiesArray}
            type={type}
            location={locationText}
            features={features}
            verificationStatus={verificationStatus}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <PropertyBookingCard
            property={property}
            onBook={onBook}
          />

          {/* Owner Card */}
          {owner && (
            <PropertyOwnerCard owner={owner} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
