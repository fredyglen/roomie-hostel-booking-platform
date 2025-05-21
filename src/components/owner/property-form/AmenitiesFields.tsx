
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface AmenitiesFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const AmenitiesFields: React.FC<AmenitiesFieldsProps> = ({ form }) => {
  // Common amenities for quick selection
  const commonAmenities = [
    "WiFi", "Water", "Electricity", "Security", "Kitchen", "Study Area", 
    "Common Room", "TV Room", "Parking", "Generator", "Air Conditioning", 
    "Fan", "Washing Machine", "Refrigerator", "Microwave", "Gas Cooker"
  ];

  // Common utilities for quick selection
  const commonUtilities = [
    "Water", "Electricity", "Gas", "Internet", "Cable TV", "Cleaning Service"
  ];

  const allInclusive = form.watch("all_inclusive");

  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-medium mb-4">Utilities & Amenities</h3>
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="all_inclusive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>All-Inclusive</FormLabel>
                <FormDescription>
                  All utilities are included in the price
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {!allInclusive && (
          <FormField
            control={form.control}
            name="utilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utilities Included</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                  {commonUtilities.map((utility) => (
                    <div 
                      key={utility}
                      className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50"
                      onClick={() => {
                        const currentUtilities = field.value ? field.value.split('\n') : [];
                        if (currentUtilities.includes(utility)) {
                          field.onChange(currentUtilities.filter(item => item !== utility).join('\n'));
                        } else {
                          field.onChange([...currentUtilities, utility].join('\n'));
                        }
                      }}
                    >
                      <Checkbox
                        checked={field.value?.split('\n').includes(utility)}
                        id={`utility-${utility}`}
                      />
                      <label htmlFor={`utility-${utility}`} className="text-sm cursor-pointer">{utility}</label>
                    </div>
                  ))}
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Water, Electricity, Gas (one per line)" 
                    className="min-h-20" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter each utility included on a new line or use quick selections above
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                {commonAmenities.map((amenity) => (
                  <div 
                    key={amenity}
                    className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50"
                    onClick={() => {
                      const currentAmenities = field.value ? field.value.split('\n') : [];
                      if (currentAmenities.includes(amenity)) {
                        field.onChange(currentAmenities.filter(item => item !== amenity).join('\n'));
                      } else {
                        field.onChange([...currentAmenities, amenity].join('\n'));
                      }
                    }}
                  >
                    <Checkbox
                      checked={field.value?.split('\n').includes(amenity)}
                      id={`amenity-${amenity}`}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">{amenity}</label>
                  </div>
                ))}
              </div>
              <FormControl>
                <Textarea 
                  placeholder="e.g. Wi-Fi, Air Conditioning, Kitchen, Security (one per line)" 
                  className="min-h-20" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Enter each amenity on a new line or use quick selections above
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AmenitiesFields;
