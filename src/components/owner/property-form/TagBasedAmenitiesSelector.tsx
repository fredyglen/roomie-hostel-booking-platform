import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Plus, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TagBasedAmenitiesSelectorProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Tag-Based Amenities System
 * 
 * Ghana-specific amenities organized by categories
 * Following centralized configuration standards
 */
const TagBasedAmenitiesSelector: React.FC<TagBasedAmenitiesSelectorProps> = ({ 
  form, 
  propertyCategory 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const selectedAmenities = form.watch('amenities') || [];

  // BE CONSCIOUS: Ghana-specific amenities following centralized standards
  const amenityCategories = {
    'basic-utilities': {
      name: 'Basic Utilities',
      icon: '🏠',
      amenities: [
        'Water Supply', 'Electricity', 'WiFi Internet', 'Generator Backup',
        'Waste Management', 'Cleaning Service', 'Maintenance Service'
      ]
    },
    'security-safety': {
      name: 'Security & Safety',
      icon: '🔒',
      amenities: [
        'Security Guard', 'CCTV Security', 'Walled Compound', 'Gate Security',
        'Fire Safety', 'Emergency Exits', 'First Aid Kit', 'Night Security'
      ]
    },
    'room-features': {
      name: 'Room Features',
      icon: '🛏️',
      amenities: [
        'Bed Frame', 'Mattress', 'Wardrobe', 'Study Desk', 'Chair',
        'Fan', 'Tiled Floor', 'Window Curtains', 'Reading Light'
      ]
    },
    'washroom-facilities': {
      name: 'Washroom Facilities',
      icon: '🚿',
      amenities: [
        'Private Bathroom', 'Shared Bathroom', 'Hot Water', 'Water Heater',
        'Shower', 'Toilet', 'Sink', 'Mirror', 'Towel Rack'
      ]
    },
    'kitchen-dining': {
      name: 'Kitchen & Dining',
      icon: '🍽️',
      amenities: [
        'Shared Kitchen', 'Cooking Gas', 'Refrigerator', 'Microwave',
        'Dining Area', 'Cooking Utensils', 'Plates & Cutlery', 'Water Dispenser'
      ]
    },
    'recreation-study': {
      name: 'Recreation & Study',
      icon: '📚',
      amenities: [
        'Study Area', 'Library', 'Common Room', 'TV Room', 'Game Room',
        'Outdoor Space', 'Garden', 'Sports Facility', 'Gym'
      ]
    },
    'convenience': {
      name: 'Convenience',
      icon: '🛍️',
      amenities: [
        'Laundry Service', 'Parking Space', 'Nearby Shops', 'Transport Access',
        'ATM Nearby', 'Hospital Nearby', 'Market Access', 'Pharmacy Nearby'
      ]
    }
  };

  // BE CONSCIOUS: Get all amenities for search
  const getAllAmenities = () => {
    return Object.values(amenityCategories).flatMap(category => 
      category.amenities.map(amenity => ({
        name: amenity,
        category: Object.keys(amenityCategories).find(key => 
          amenityCategories[key as keyof typeof amenityCategories].amenities.includes(amenity)
        )!
      }))
    );
  };

  // BE CONSCIOUS: Filter amenities based on search and category
  const getFilteredAmenities = () => {
    const allAmenities = getAllAmenities();
    
    return allAmenities.filter(amenity => {
      const matchesSearch = amenity.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || amenity.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  };

  // BE CONSCIOUS: Toggle amenity selection
  const toggleAmenity = (amenityName: string) => {
    const currentAmenities = selectedAmenities;
    const isSelected = currentAmenities.includes(amenityName);
    
    if (isSelected) {
      form.setValue('amenities', currentAmenities.filter(a => a !== amenityName));
    } else {
      // BE CONSCIOUS: Respect max amenities limit from business rules
      if (currentAmenities.length < 20) { // From centralized business rules
        form.setValue('amenities', [...currentAmenities, amenityName]);
      }
    }
  };

  // BE CONSCIOUS: Add custom amenity
  const addCustomAmenity = (customAmenity: string) => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      if (selectedAmenities.length < 20) {
        form.setValue('amenities', [...selectedAmenities, customAmenity.trim()]);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏷️ Amenities & Features
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Select up to 20 amenities. Choose features that make your property attractive to students.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search amenities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Categories
            </Button>
            {Object.entries(amenityCategories).map(([key, category]) => (
              <Button
                key={key}
                type="button"
                variant={activeCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(key)}
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Amenities */}
        {selectedAmenities.length > 0 && (
          <div>
            <h5 className="text-sm font-medium mb-2">
              Selected Amenities ({selectedAmenities.length}/20)
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map((amenity) => (
                <Badge key={amenity} variant="default" className="flex items-center gap-1">
                  {amenity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleAmenity(amenity)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Amenities */}
        <div>
          <h5 className="text-sm font-medium mb-3">Available Amenities</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {getFilteredAmenities().map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.name);
              const category = amenityCategories[amenity.category as keyof typeof amenityCategories];
              
              return (
                <Button
                  key={amenity.name}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => toggleAmenity(amenity.name)}
                  disabled={!isSelected && selectedAmenities.length >= 20}
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-xs">{amenity.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom Amenity Input */}
        <div>
          <h5 className="text-sm font-medium mb-2">Add Custom Amenity</h5>
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom amenity..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomAmenity(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addCustomAmenity(input.value);
                input.value = '';
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hidden form field for validation */}
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default TagBasedAmenitiesSelector;
