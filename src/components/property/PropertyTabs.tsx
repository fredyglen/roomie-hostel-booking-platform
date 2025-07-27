
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyLocationTab from './PropertyLocationTab';
import PropertyAmenitiesTab from './PropertyAmenitiesTab';
import SmartPropertyDescription from './SmartPropertyDescription';
import IntelligentRoomPricing from './IntelligentRoomPricing';

interface PropertyTabsProps {
  description: string;
  address: string;
  distanceToCampus?: string;
  houseRules?: string[];
  amenities?: string[];
  type?: string;
  location?: string;
  availableUnits?: number;
  goodToKnow?: string;
  roomTypes?: string[];
  nearestUniversity?: string;
  onTabChange?: (tab: string) => void;
  // ✅ NEW: Pricing matrix props
  propertyId?: string;
  propertyCategory?: string;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({
  description,
  address,
  distanceToCampus,
  houseRules = [],
  amenities = [],
  type,
  location,
  availableUnits,
  goodToKnow,
  roomTypes,
  nearestUniversity,
  onTabChange,
  propertyId,
  propertyCategory
}) => {
  const [activeTab, setActiveTab] = useState('about');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) onTabChange(value);
  };

  return (
    <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange}>
      {/* ✅ MOBILE-FIRST: 3 TABS ONLY */}
      <TabsList className="grid grid-cols-3 mb-4 w-full">
        <TabsTrigger value="about" className="text-xs md:text-sm">About</TabsTrigger>
        <TabsTrigger value="amenities" className="text-xs md:text-sm">Amenities</TabsTrigger>
        <TabsTrigger value="location" className="text-xs md:text-sm">Location</TabsTrigger>
      </TabsList>
      
      {/* ✅ ABOUT TAB: Smart Description + Intelligent Pricing */}
      <TabsContent value="about" className="space-y-6">
        {/* Smart Description with Character Limits */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About this property</h3>
          <SmartPropertyDescription
            description={description}
            characterLimit={280}
          />
        </div>

        {/* Intelligent Room Pricing Integration */}
        {propertyId && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Room options & pricing</h3>
            <IntelligentRoomPricing propertyId={propertyId} />
          </div>
        )}

        {/* Additional Property Info */}
        {goodToKnow && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Good to know</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{goodToKnow}</p>
          </div>
        )}
      </TabsContent>

      {/* ✅ AMENITIES TAB: Clean, Organized */}
      <TabsContent value="amenities">
        <PropertyAmenitiesTab amenities={amenities} />
      </TabsContent>

      {/* ✅ LOCATION TAB: Essential Location Info */}
      <TabsContent value="location">
        <PropertyLocationTab
          address={address}
          distanceToCampus={distanceToCampus}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
