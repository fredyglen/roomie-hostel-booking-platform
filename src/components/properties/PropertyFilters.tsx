
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface PropertyFiltersProps {
  filters: {
    priceMin: string;
    priceMax: string;
    propertyType: string;
    location: string;
    amenities: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    priceMin: string;
    priceMax: string;
    propertyType: string;
    location: string;
    amenities: string[];
  }>>;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  setFilters,
  onResetFilters,
  onApplyFilters
}) => {
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prevFilters => {
      const currentAmenities = prevFilters.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity];
      
      return {
        ...prevFilters,
        amenities: newAmenities
      };
    });
  };

  const amenitiesList = [
    'Wi-Fi', 
    'Air Conditioning', 
    'Kitchen', 
    'Security', 
    'Water Supply',
    'Study Area', 
    'Inner Washroom'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-3">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Property Type</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={filters.propertyType}
            onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Hostel">Hostel</option>
            <option value="Homestel">Homestel</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Location</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          >
            <option value="">All Locations</option>
            <option value="East Legon">East Legon</option>
            <option value="Madina">Madina</option>
            <option value="Legon">Legon</option>
            <option value="Atomic">Atomic</option>
          </select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₵)</Label>
          <Input 
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₵)</Label>
          <Input 
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-700 mb-2">Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="mr-2"
              />
              <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onResetFilters}>
          Reset Filters
        </Button>
        <Button onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
