
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues, GhanaRegions } from './PropertyFormSchema';

interface LocationFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ form }) => {
  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-medium mb-4">Location Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 123 University Road" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area/Suburb</FormLabel>
              <FormControl>
                <Input placeholder="e.g. East Legon, Madina, Atomic" {...field} />
              </FormControl>
              <FormDescription>
                Specific area name for searching
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landmark</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Near Ghana International School" {...field} />
              </FormControl>
              <FormDescription>
                Nearby landmark to help find the property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distance_to_campus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance to Campus</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5 min walk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Accra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GhanaRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationFields;
