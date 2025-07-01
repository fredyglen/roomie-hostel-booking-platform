
/**
 * Property Tabs Component for ROOMi Platform
 * Displays property information in organized tabs with proper type safety
 *
 * @fileoverview Apple-Level Property Tabs Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyFeatures } from '@/types/property';
import PropertyAboutTab from './PropertyAboutTab';
import PropertyLocationTab from './PropertyLocationTab';
import PropertyAmenitiesTab from './PropertyAmenitiesTab';
import PropertyHouseRulesTab from './PropertyHouseRulesTab';

interface PropertyTabsProps {
  description: string;
  address: string;
  distanceToCampus?: string;
  houseRules?: string[];
  amenities?: string[];
  type?: string;
  location?: string;
  features?: PropertyFeatures;
  verificationStatus?: string;
  onTabChange?: (tab: string) => void;
}

/**
 * Property Tabs Component
 * Organizes property information into accessible tabs
 */
const PropertyTabs: React.FC<PropertyTabsProps> = ({
  description,
  address,
  distanceToCampus,
  houseRules = [],
  amenities = [],
  type,
  location,
  features,
  verificationStatus,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState('about');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) onTabChange(value);
  };

  // Calculate available units from features if available
  const availableUnits = features?.bedrooms || 0;

  return (
    <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about">
        <PropertyAboutTab 
          description={description}
          type={type}
          location={location} 
          availableUnits={availableUnits}
          distanceToCampus={distanceToCampus}
        />
      </TabsContent>
      
      <TabsContent value="location">
        <PropertyLocationTab 
          address={address}
          distanceToCampus={distanceToCampus}
        />
      </TabsContent>
      
      <TabsContent value="amenities">
        <PropertyAmenitiesTab amenities={amenities} />
      </TabsContent>
      
      <TabsContent value="rules">
        <PropertyHouseRulesTab houseRules={houseRules} />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
