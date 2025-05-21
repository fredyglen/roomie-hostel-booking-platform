
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface HomestelFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  updateOccupancyDetails: () => void;
}

const HomestelFields: React.FC<HomestelFieldsProps> = ({ form, updateOccupancyDetails }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="total_rooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Rooms</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 3" 
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.valueAsNumber);
                  updateOccupancyDetails();
                }} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rooms_available"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rooms Available</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 2" 
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.valueAsNumber);
                  updateOccupancyDetails();
                }} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_occupants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Occupants Per Room</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 1" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)} 
              />
            </FormControl>
            <FormDescription>Maximum number of occupants allowed per room</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default HomestelFields;
