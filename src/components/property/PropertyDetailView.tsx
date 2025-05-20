
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyTabs from '@/components/property/PropertyTabs';
import PropertyOwnerCard from '@/components/property/PropertyOwnerCard';
import PropertyBookingCard from '@/components/property/PropertyBookingCard';
import { Property } from '@/types/property';
import { toast } from 'sonner';

interface PropertyDetailViewProps {
  property: Property;
  onViewStory: () => void;
  onBookNow: () => void;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ 
  property, 
  onViewStory,
  onBookNow 
}) => {
  const [activeTab, setActiveTab] = useState('about');
  
  // Ensure we have images to display
  const images = property.images && property.images.length > 0
    ? property.images
    : ['/placeholder.svg'];
  
  const handleError = () => {
    toast.error("Failed to load some images");
  };
  
  return (
    <main className="flex-grow py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Property Header */}
        <PropertyHeader 
          id={property.id}
          title={property.title}
          address={property.address}
          distanceToCampus={property.distanceToCampus || ''}
          rating={property.rating}
          reviewCount={property.reviewCount}
          onViewStory={onViewStory}
        />
        
        {/* Property Images */}
        <PropertyImageGallery 
          images={images} 
          title={property.title} 
          onError={handleError}
        />
        
        {/* Property Details and Booking Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <PropertyTabs
                description={property.description || ''}
                address={property.address}
                distanceToCampus={property.distanceToCampus || ''}
                houseRules={property.house_rules || []}
                amenities={property.amenities || []}
                type={property.type || property.property_type || ''}
                location={property.location || ''}
                availableUnits={property.availableUnits}
                onTabChange={setActiveTab}
              />
            </div>
            
            {/* Owner/Agent Info */}
            {property.owner && (
              <PropertyOwnerCard 
                name={property.owner.name}
                verified={property.owner.verified}
                responseRate={property.owner.responseRate}
              />
            )}
          </div>
          
          {/* Booking Card */}
          <div className="md:col-span-1">
            <PropertyBookingCard
              id={property.id}
              price={property.price || 0}
              priceUnit={property.priceUnit || 'semester'}
              verified={property.verified}
              availableUnits={property.availableUnits}
              onBookNow={onBookNow}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailView;
