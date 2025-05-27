
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface DescriptionFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const DescriptionFields: React.FC<DescriptionFieldsProps> = ({
  form
}) => {
  return (
    <>
      <FormField 
        control={form.control} 
        name="description" 
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your property, include details about the rooms, facilities, etc." 
                className="min-h-32" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <FormField 
        control={form.control} 
        name="house_rules" 
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>House Rules</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter house rules (one per line)&#10;e.g. No smoking&#10;No loud music after 10 PM&#10;Keep common areas clean" 
                className="min-h-24" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
    </>
  );
};

export default DescriptionFields;
