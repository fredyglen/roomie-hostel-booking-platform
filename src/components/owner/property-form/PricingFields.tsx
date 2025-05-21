
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface PricingFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

const PricingFields: React.FC<PricingFieldsProps> = ({ form, propertyCategory }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g. 500" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price_unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price Unit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select price unit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyCategory === "Hostel" ? (
                  <SelectItem value="semester">Per Semester</SelectItem>
                ) : (
                  <>
                    <SelectItem value="month">Per Month</SelectItem>
                    <SelectItem value="semester">Per Semester</SelectItem>
                    <SelectItem value="year">Per Year</SelectItem>
                    <SelectItem value="week">Per Week</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {propertyCategory !== "Hostel" && (
        <FormField
          control={form.control}
          name="advance_payment_months"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advance Payment (months)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g. 12" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                />
              </FormControl>
              <FormDescription>
                How many months of advance payment required
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default PricingFields;
