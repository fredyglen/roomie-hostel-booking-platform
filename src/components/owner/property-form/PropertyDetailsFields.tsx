
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface PropertyDetailsFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

const PropertyDetailsFields: React.FC<PropertyDetailsFieldsProps> = ({ form, propertyCategory }) => {
  const occupancyType = form.watch('occupancy_type');

  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-medium mb-4">Property Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <FormField
          control={form.control}
          name="occupancy_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupancy Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupancy type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {propertyCategory === "Hostel" && (
                    <SelectItem value="beds">Beds</SelectItem>
                  )}
                  {propertyCategory === "Homestel" && (
                    <SelectItem value="rooms">Rooms</SelectItem>
                  )}
                  {propertyCategory === "Apartment" && (
                    <SelectItem value="units">Units</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                {propertyCategory === "Hostel" 
                  ? "Track individual bed availability" 
                  : propertyCategory === "Homestel" 
                    ? "Track room availability" 
                    : "Track apartment unit availability"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {occupancyType && (
          <>
            <FormField
              control={form.control}
              name="occupancy_available"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available {occupancyType}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder={`e.g. 5`}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormDescription>
                    Number of {occupancyType} currently available
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupancy_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total {occupancyType}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder={`e.g. 40`}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of {occupancyType} in the property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {propertyCategory === "Apartment" && (
          <FormField
            control={form.control}
            name="max_occupants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Occupants</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 4"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of occupants allowed per apartment unit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="allow_bill_sharing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  Allow Bill Sharing
                </FormLabel>
                <FormDescription className="text-xs">
                  Allow tenants to share utility bills
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsFields;
