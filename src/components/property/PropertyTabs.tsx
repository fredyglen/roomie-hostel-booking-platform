
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyAboutTab from './PropertyAboutTab';
import PropertyLocationTab from './PropertyLocationTab';
import PropertyRulesTab from './PropertyRulesTab';
import PropertyAmenitiesTab from './PropertyAmenitiesTab';

interface PropertyTabsProps {
  description: string;
  address: string;
  distanceToCampus?: string;
  houseRules: string[];
  amenities: string[];
  type?: string;
  location?: string;
  availableUnits?: number;
  onTabChange?: (tab: string) => void;
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({
  description,
  address,
  distanceToCampus,
  houseRules,
  amenities,
  type,
  location,
  availableUnits,
  onTabChange
}) => {
  return (
    <Tabs defaultValue="about" onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
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
      
      <TabsContent value="rules">
        <PropertyRulesTab rules={houseRules} />
      </TabsContent>
      
      <TabsContent value="amenities">
        <PropertyAmenitiesTab amenities={amenities} />
      </TabsContent>
    </Tabs>
  );
};

export default PropertyTabs;
