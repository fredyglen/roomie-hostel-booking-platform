
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyLocationTab from './PropertyLocationTab';
import PropertyAmenitiesTab from './PropertyAmenitiesTab';
import PropertyHouseRulesTab from './PropertyHouseRulesTab';
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
  // ✅ Title for About heading
  propertyTitle?: string;
  // ✅ Emit selected room price up to parent
  onRoomPriceChange?: (price: number) => void;
  // ✅ Transparency fields (optional, shown only when present)
  advancePaymentMonths?: number;
  washroomType?: string;
  hasIndividualMeters?: boolean;
  allowBillSharing?: boolean;
  meterType?: string;
  waterReliability?: string;
  waterReliabilityNotes?: string;
  parkingAvailable?: boolean;
  parkingCost?: number;
  internetSpeed?: string;
  securityFeatures?: string[];
  genderRestriction?: string;
  cancellationPolicy?: string;
}

const PropertyTabs: React.FC<PropertyTabsProps> = (props) => {
  const {
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
    propertyCategory,
    propertyTitle,
    onRoomPriceChange
  } = props;

  const [activeTab, setActiveTab] = useState('about');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) onTabChange(value);
  };

  // Essentials one-liner builder (washroom + utilities + water)
  const buildEssentials = () => {
    const wt = (props.washroomType || '').toLowerCase();
    let washroom: string | undefined;
    if (wt === 'private') washroom = 'Private washroom';
    else if (wt === 'shared') washroom = 'Shared washroom';
    else if (wt === 'outside' || wt === 'external') washroom = 'External washroom';

    let utilities: string | undefined;
    if (props.hasIndividualMeters || props.allowBillSharing) utilities = 'Utilities billed separately';
    else if (props.hasIndividualMeters === false && props.allowBillSharing === false) utilities = 'Utilities included';

    let water: string | undefined;
    const wr = (props.waterReliability || '').toLowerCase();
    if (wr === 'stable') water = 'Reliable water supply';
    else if (wr === 'intermittent') water = 'Intermittent water supply';
    else if (wr === 'varies') water = 'Water supply varies';

    return [washroom, utilities, water].filter(Boolean).join(' • ');
  };

  return (
    <Tabs defaultValue="about" value={activeTab} onValueChange={handleTabChange}>
      {/* Mobile-first: 4 tabs (About, Amenities, Rules, Location) */}
      <TabsList className="grid grid-cols-4 mb-4 w-full">
        <TabsTrigger value="about" className="text-xs md:text-sm">About</TabsTrigger>
        <TabsTrigger value="amenities" className="text-xs md:text-sm">Amenities</TabsTrigger>
        <TabsTrigger value="rules" className="text-xs md:text-sm">Rules</TabsTrigger>
        <TabsTrigger value="location" className="text-xs md:text-sm">Location</TabsTrigger>
      </TabsList>

      {/* ✅ ABOUT TAB: Smart Description + Intelligent Pricing */}
      <TabsContent value="about" className="space-y-6">
        {/* Smart Description with Character Limits */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{propertyTitle ? `About ${propertyTitle}` : 'About this property'}</h3>
          <SmartPropertyDescription
            description={description}
            characterLimit={400}
          />
        </div>

        {/* Intelligent Room Pricing Integration */}
        {propertyId && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Room options & pricing</h3>
            <IntelligentRoomPricing
              propertyId={propertyId}
              propertyCategory={propertyCategory}
              onRoomTypeSelect={(rt) => onRoomPriceChange?.(rt.price)}
            />
          </div>
        )}


        {/* Essentials one-liner (concise) */}
        {buildEssentials() && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Essentials</h3>
            <p className="text-sm text-gray-700">{buildEssentials()}</p>
          </div>
        )}

        {/* Key facts (compact chips) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Key facts</h3>
          <div className="flex flex-wrap gap-2">
            {typeof props.advancePaymentMonths === 'number' && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{`${props.advancePaymentMonths} month${props.advancePaymentMonths === 1 ? '' : 's'} advance`}</span>
            )}
            {props.parkingAvailable && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{`Parking${props.parkingCost ? ` (₵${props.parkingCost})` : ''}`}</span>
            )}
            {props.internetSpeed && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{`Internet: ${props.internetSpeed}`}</span>
            )}
            {props.genderRestriction && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{`Gender: ${props.genderRestriction}`}</span>
            )}
            {Array.isArray(props.securityFeatures) && props.securityFeatures.slice(0, 3).map((sf, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{sf}</span>
            ))}
          </div>
        </div>

        {/* Must know information Section */}
        {goodToKnow && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Must know information</h3>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <p className="text-amber-900 text-sm leading-relaxed font-medium">{goodToKnow}</p>
            </div>
          </div>
        )}
      </TabsContent>

      {/* ✅ AMENITIES TAB: Clean, Organized */}
      <TabsContent value="amenities">
        <PropertyAmenitiesTab amenities={amenities} />
      </TabsContent>

      {/* ✅ RULES TAB: House Rules & Guidelines */}
      <TabsContent value="rules">
        <PropertyHouseRulesTab houseRules={houseRules} />
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
