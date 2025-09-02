
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
      {/* Removed duplicate Total Rooms field - now handled in RoomConfigurationFields */}

      {/* Removed duplicate Beds Per Room field - now handled conditionally in RoomConfigurationFields */}

      <FormField
        control={form.control}
        name="beds_available"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beds Available for Booking</FormLabel>
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
            <FormDescription>
              How many beds are currently available for new bookings?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default HostelFields;
