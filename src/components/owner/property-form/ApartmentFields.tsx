
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface ApartmentFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const ApartmentFields: React.FC<ApartmentFieldsProps> = ({ form }) => {
  return (
    <>
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
            <FormDescription>Maximum number of occupants allowed in the apartment</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allow_bill_sharing"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Allow Bill Sharing</FormLabel>
              <FormDescription>
                Allow multiple students to split the bill for this apartment
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default ApartmentFields;
