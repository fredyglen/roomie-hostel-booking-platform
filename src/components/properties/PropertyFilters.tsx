
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PRICE_FILTER_DEFAULTS } from '@/config/constants';

interface PropertyFiltersProps {
  propertyType: string;
  onPropertyTypeChange: (type: string) => void;
  genderType: string;
  onGenderTypeChange: (type: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  propertyType,
  onPropertyTypeChange,
  genderType,
  onGenderTypeChange,
  priceRange,
  onPriceRangeChange,
  onResetFilters
}) => {
  const handleAmenityToggle = (amenity: string) => {
    // This function is no longer used but kept for backward compatibility
  };

  const amenitiesList = [
    'Wi-Fi', 
    'Air Conditioning', 
    'Kitchen', 
    'Security', 
    'Water Supply',
    'Study Area', 
    'Private Washroom'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Property Type</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={propertyType}
            onChange={(e) => onPropertyTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Hostel">Hostel</option>
            <option value="Homestel">Homestel</option>

          </select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Gender</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={genderType}
            onChange={(e) => onGenderTypeChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Price Range</Label>
          <div className="flex items-center gap-2">
            <div className="text-sm">₵{priceRange[0]}</div>
            <Slider
              value={[priceRange[0], priceRange[1]]}
              min={PRICE_FILTER_DEFAULTS.MIN}
              max={PRICE_FILTER_DEFAULTS.MAX}
              step={PRICE_FILTER_DEFAULTS.STEP}
              onValueChange={(values) => onPriceRangeChange([values[0], values[1]])}
              className="flex-grow mx-2"
            />
            <div className="text-sm">₵{priceRange[1]}</div>
          </div>
        </div>
        

      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onResetFilters} className="mr-2">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
