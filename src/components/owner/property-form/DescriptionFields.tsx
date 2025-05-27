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
  return <>
      <FormField control={form.control} name="description" render={({
      field
    }) => <FormItem className="md:col-span-2">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe your property, include details about the rooms, facilities, etc." className="min-h-32" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={form.control} name="house_rules" render={({
      field
    }) => {}} />
    </>;
};
export default DescriptionFields;