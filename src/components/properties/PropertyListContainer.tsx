import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertyList from './PropertyList';
import PropertiesFiltersPanel from './PropertiesFiltersPanel';
import { Property } from '@/types/property';
import { usePropertiesFilter } from '@/hooks/filters';
import { useToast } from '@/hooks/use-toast';
import { navigateToProperty, navigateToStory } from '@/utils/navigation';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { logger } from '@/utils/logger';
import { useOwnerSettingsByOwnerIds } from '@/hooks/property/useOwnerSettingsByOwnerIds';

interface PropertyListContainerProps {
  properties: Property[];
  isLoading?: boolean;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({
  properties,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Use the custom hook for handling property filtering
  const {
    searchQuery,
    setSearchQuery,
    selectedPropertyType,
    setSelectedPropertyType,
    selectedGenderType,
    setSelectedGenderType,
    priceRange,
    setPriceRange,
    showFilters,
    setShowFilters,
    filteredProperties,
    resetFilters
  } = usePropertiesFilter({ properties });
  // Ghana-market quick chips state
  const [wifiOnly, setWifiOnly] = useState(false);
  const [utilitiesIncludedOnly, setUtilitiesIncludedOnly] = useState(false);
  const [washroomInsideOnly, setWashroomInsideOnly] = useState(false);
  const [washroomOutsideOnly, setWashroomOutsideOnly] = useState(false);
  // Minutes-to-campus filter state
  const [minutesMax, setMinutesMax] = useState<number | null>(null);
  const [minutesMode, setMinutesMode] = useState<'walk' | 'drive' | null>(null);

  // Reset all filters, including Ghana-market chips
  const resetAllFilters = React.useCallback(() => {
    resetFilters();
    setWifiOnly(false);
    setUtilitiesIncludedOnly(false);
    setWashroomInsideOnly(false);
    setWashroomOutsideOnly(false);
    setMinutesMax(null);
    setMinutesMode(null);
  }, [resetFilters]);

  // Load owner settings for current owners to resolve wifi/utilities from DB
  const ownerIds = useMemo(
    () => Array.from(new Set(properties.map((p: any) => p.owner_id).filter(Boolean))),
    [properties]
  );
  const { data: ownerSettingsMap } = useOwnerSettingsByOwnerIds(ownerIds);

  const filteredWithChips = React.useMemo(() => {
    return filteredProperties.filter((p: any) => {
      // Wi-Fi: prefer owner_settings.wifi_included; fallback to properties.internet_speed
      if (wifiOnly) {
        const ownerWifi = p.owner_id && ownerSettingsMap ? ownerSettingsMap[p.owner_id]?.wifi_included === true : false;
        const hasInternet = typeof p.internet_speed === 'string' && p.internet_speed.trim().length > 0;
        if (!(ownerWifi || hasInternet)) return false;
      }

      // All-inclusive utilities: owner_settings.utilities_included
      if (utilitiesIncludedOnly) {
        const included = p.owner_id && ownerSettingsMap ? ownerSettingsMap[p.owner_id]?.utilities_included === true : false;
        if (!included) return false;
      }

      // Washroom inside
      if (washroomInsideOnly) {
        const wt = (p.washroom_type || '').toLowerCase();
        if (!(wt === 'inside')) return false;
      }

      // Washroom outside
      if (washroomOutsideOnly) {
        const wt = (p.washroom_type || '').toLowerCase();
        // allow shared_washroom_count as secondary signal of outside/shared
        const sharedCount = typeof p.shared_washroom_count === 'number' ? p.shared_washroom_count : 0;
        if (!(wt === 'outside' || sharedCount > 0)) return false;
      }

      // Minutes to campus (owner_settings), only when slider active
      if (minutesMax != null) {
        const ownerData = p.owner_id && ownerSettingsMap ? ownerSettingsMap[p.owner_id] : undefined;
        const m = ownerData?.minutes_to_campus ?? null;
        const mo = ownerData?.minutes_to_campus_mode ?? null;
        if (m == null || m > minutesMax) return false;
        if (minutesMode && mo && mo !== minutesMode) return false;
      }

      return true;
    });
  }, [
    filteredProperties,
    wifiOnly,
    utilitiesIncludedOnly,
    washroomInsideOnly,
    washroomOutsideOnly,
    minutesMax,
    minutesMode,
    ownerSettingsMap
  ]);

  const handleViewProperty = (id: string) => {
    logger.debug('Navigating to property detail', { id });
    navigateToProperty(navigate, id, {
      from: location.pathname + location.search,
      preserveHistory: true
    });
  };

  const handleViewStory = (id: string) => {
    logger.debug('Navigating to property story', { id });
    navigateToStory(navigate, id, {
      from: location.pathname + location.search,
      preserveHistory: true
    });
  };

  const handleError = (error: unknown) => {
    ErrorHandler.handle(error, 'Error in PropertyListContainer:');
    toast.error("Something went wrong", {
      description: "Please try again later"
    });
  };

  return (
    <div className="property-list-container">
      <PropertiesFiltersPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedGenderType={selectedGenderType}
        setSelectedGenderType={setSelectedGenderType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        wifiOnly={wifiOnly}
        setWifiOnly={setWifiOnly}
        utilitiesIncludedOnly={utilitiesIncludedOnly}
        setUtilitiesIncludedOnly={setUtilitiesIncludedOnly}
        washroomInsideOnly={washroomInsideOnly}
        setWashroomInsideOnly={setWashroomInsideOnly}
        washroomOutsideOnly={washroomOutsideOnly}
        setWashroomOutsideOnly={setWashroomOutsideOnly}
        minutesMax={minutesMax}
        setMinutesMax={setMinutesMax}
        minutesMode={minutesMode}
        setMinutesMode={setMinutesMode}
        resetFilters={resetAllFilters}
        filteredPropertiesCount={filteredWithChips.length}
      />

      {/* Property List */}
      <PropertyList
        properties={filteredWithChips}
        isLoading={isLoading}
        onResetFilters={resetAllFilters}
        onViewProperty={handleViewProperty}
        onViewStory={handleViewStory}
      />
    </div>
  );
};

export default PropertyListContainer;
