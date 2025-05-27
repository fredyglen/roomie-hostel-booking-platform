
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wifi, 
  Car, 
  Shield, 
  Utensils, 
  Tv, 
  Zap, 
  Droplets, 
  Wind, 
  Coffee,
  WashingMachine,
  Home,
  Users,
  Gamepad2,
  GraduationCap
} from 'lucide-react';

interface AmenitiesSelectorProps {
  form: UseFormReturn<PropertyFormValues>;
}

const amenityCategories = {
  basic: {
    label: 'Basic Amenities',
    icon: Home,
    items: [
      { name: 'WiFi', icon: Wifi },
      { name: 'Water', icon: Droplets },
      { name: 'Electricity', icon: Zap },
      { name: 'Security', icon: Shield },
      { name: 'Parking', icon: Car },
      { name: 'Fan', icon: Wind }
    ]
  },
  kitchen: {
    label: 'Kitchen & Dining',
    icon: Utensils,
    items: [
      { name: 'Kitchen', icon: Utensils },
      { name: 'Refrigerator', icon: Coffee },
      { name: 'Microwave', icon: Coffee },
      { name: 'Gas Cooker', icon: Coffee }
    ]
  },
  common: {
    label: 'Common Areas',
    icon: Users,
    items: [
      { name: 'Common Room', icon: Users },
      { name: 'TV Room', icon: Tv },
      { name: 'Study Area', icon: GraduationCap },
      { name: 'Recreation Area', icon: Gamepad2 }
    ]
  },
  laundry: {
    label: 'Laundry & Cleaning',
    icon: WashingMachine,
    items: [
      { name: 'Washing Machine', icon: WashingMachine },
      { name: 'Cleaning Service', icon: Home }
    ]
  }
};

const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({ form }) => {
  const [activeCategory, setActiveCategory] = useState<string>('basic');

  const handleAmenityToggle = (amenityName: string, checked: boolean) => {
    const currentAmenities = form.getValues('amenities') || '';
    const amenitiesArray = currentAmenities.split('\n').filter(Boolean);
    
    if (checked && !amenitiesArray.includes(amenityName)) {
      amenitiesArray.push(amenityName);
    } else if (!checked) {
      const index = amenitiesArray.indexOf(amenityName);
      if (index > -1) {
        amenitiesArray.splice(index, 1);
      }
    }
    
    form.setValue('amenities', amenitiesArray.join('\n'));
  };

  const isAmenitySelected = (amenityName: string): boolean => {
    const currentAmenities = form.getValues('amenities') || '';
    return currentAmenities.split('\n').includes(amenityName);
  };

  return (
    <div className="col-span-full">
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Amenities</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid w-full grid-cols-4">
                    {Object.entries(amenityCategories).map(([key, category]) => {
                      const IconComponent = category.icon;
                      return (
                        <TabsTrigger 
                          key={key} 
                          value={key}
                          className="flex items-center gap-2"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="hidden sm:inline">{category.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  
                  {Object.entries(amenityCategories).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {category.items.map((amenity) => {
                          const IconComponent = amenity.icon;
                          return (
                            <div 
                              key={amenity.name}
                              className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleAmenityToggle(amenity.name, !isAmenitySelected(amenity.name))}
                            >
                              <Checkbox
                                checked={isAmenitySelected(amenity.name)}
                                onCheckedChange={(checked) => handleAmenityToggle(amenity.name, !!checked)}
                                id={`amenity-${amenity.name}`}
                              />
                              <IconComponent className="w-5 h-5 text-gray-600" />
                              <label 
                                htmlFor={`amenity-${amenity.name}`} 
                                className="text-sm font-medium cursor-pointer flex-1"
                              >
                                {amenity.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                
                <div className="mt-4">
                  <FormLabel className="text-sm text-gray-600">Additional Amenities</FormLabel>
                  <Textarea 
                    placeholder="Enter any additional amenities (one per line)" 
                    className="mt-2" 
                    {...field} 
                  />
                  <FormDescription>
                    Selected amenities and any additional ones you add will be combined
                  </FormDescription>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AmenitiesSelector;
