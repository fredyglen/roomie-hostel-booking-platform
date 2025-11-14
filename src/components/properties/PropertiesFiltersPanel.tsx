
import React from 'react';
import SearchBar from '@/components/properties/SearchBar';
import ResultsCount from '@/components/properties/ResultsCount';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { MINUTES_TO_CAMPUS_FILTER_DEFAULTS } from '@/config/constants';


interface PropertiesFiltersPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedPropertyType: string;
  setSelectedPropertyType: (type: string) => void;
  selectedGenderType: string;
  setSelectedGenderType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  // Ghana-specific quick chips
  wifiOnly: boolean;
  setWifiOnly: (v: boolean) => void;
  utilitiesIncludedOnly: boolean;
  setUtilitiesIncludedOnly: (v: boolean) => void;
  washroomInsideOnly: boolean;
  setWashroomInsideOnly: (v: boolean) => void;
  washroomOutsideOnly: boolean;
  setWashroomOutsideOnly: (v: boolean) => void;
  // Minutes-to-campus (owner_settings)
  minutesMax: number | null;
  setMinutesMax: (v: number | null) => void;
  minutesMode: 'walk' | 'drive' | null;
  setMinutesMode: (v: 'walk' | 'drive' | null) => void;
  resetFilters: () => void;
  filteredPropertiesCount: number;
}

const PropertiesFiltersPanel: React.FC<PropertiesFiltersPanelProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedGenderType,
  setSelectedGenderType,
  priceRange,
  setPriceRange,
  wifiOnly,
  setWifiOnly,
  utilitiesIncludedOnly,
  setUtilitiesIncludedOnly,
  washroomInsideOnly,
  setWashroomInsideOnly,
  washroomOutsideOnly,
  setWashroomOutsideOnly,
  minutesMax,
  setMinutesMax,
  minutesMode,
  setMinutesMode,
  resetFilters,
  filteredPropertiesCount
}) => {
  const [minutesOpen, setMinutesOpen] = React.useState(false);

  return (
    <div className="mb-6 px-1">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {/* Quick Ghana-market chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 snap-x">
        <button className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap snap-start ${wifiOnly ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => setWifiOnly(!wifiOnly)}>
          Wi‑Fi
        </button>
        <button className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap snap-start ${utilitiesIncludedOnly ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => setUtilitiesIncludedOnly(!utilitiesIncludedOnly)}>
          All‑inclusive utilities
        </button>
        <button className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap snap-start ${washroomInsideOnly ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => setWashroomInsideOnly(!washroomInsideOnly)}>
          Washroom inside
        </button>
        <button className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap snap-start ${washroomOutsideOnly ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => setWashroomOutsideOnly(!washroomOutsideOnly)}>
          Washroom outside
        </button>
        <button className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap snap-start ${minutesMax != null ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`} onClick={() => setMinutesOpen(true)}>
          {minutesMax != null ? `≤ ${minutesMax} min` : 'Minutes to campus'}
        </button>
      </div>


      {/* Minutes to campus bottom sheet */}
      <Sheet open={minutesOpen} onOpenChange={setMinutesOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Minutes to campus</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Maximum minutes</Label>
              <div className="mt-3">
                <Slider
                  min={MINUTES_TO_CAMPUS_FILTER_DEFAULTS.MIN}
                  max={MINUTES_TO_CAMPUS_FILTER_DEFAULTS.MAX}
                  step={MINUTES_TO_CAMPUS_FILTER_DEFAULTS.STEP}
                  value={[minutesMax ?? MINUTES_TO_CAMPUS_FILTER_DEFAULTS.MAX]}
                  onValueChange={([v]) => setMinutesMax(v)}
                />
                <p className="text-sm text-gray-600 mt-2">
                  ≤ {minutesMax ?? MINUTES_TO_CAMPUS_FILTER_DEFAULTS.MAX} minutes to campus
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Travel mode</Label>
              <RadioGroup
                value={minutesMode ?? ''}
                onValueChange={(v) => setMinutesMode((v as 'walk' | 'drive') || null)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="walk" id="walk" />
                  <Label htmlFor="walk">Walk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drive" id="drive" />
                  <Label htmlFor="drive">Drive</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setMinutesMax(null);
                  setMinutesMode(null);
                  setMinutesOpen(false);
                }}
              >
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setMinutesOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Filter Panel */}
      {showFilters && (
        <PropertyFilters
          propertyType={selectedPropertyType}
          onPropertyTypeChange={setSelectedPropertyType}
          genderType={selectedGenderType}
          onGenderTypeChange={setSelectedGenderType}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onResetFilters={resetFilters}
        />
      )}

      <ResultsCount count={filteredPropertiesCount} />
    </div>
  );
};

export default PropertiesFiltersPanel;
