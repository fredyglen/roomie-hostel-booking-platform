
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface HostelFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  updateOccupancyDetails: () => void;
}

const HostelFields: React.FC<HostelFieldsProps> = ({ form, updateOccupancyDetails }) => {
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
                placeholder="e.g. 10" 
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
        name="beds_per_room"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beds Per Room</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 4" 
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.valueAsNumber);
                  updateOccupancyDetails();
                }} 
              />
            </FormControl>
            <FormDescription>How many beds in each room (1-4)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="beds_available"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beds Available</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 5" 
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
    </>
  );
};

export default HostelFields;
