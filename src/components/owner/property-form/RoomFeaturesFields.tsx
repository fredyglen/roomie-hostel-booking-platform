
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PropertyFormValues } from './PropertyFormSchema';
import { Badge } from '@/components/ui/badge';

interface RoomFeaturesFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  hasFeatureAccess?: (feature: string) => boolean;
}

const RoomFeaturesFields: React.FC<RoomFeaturesFieldsProps> = ({ 
  form, 
  hasFeatureAccess = () => true 
}) => {
  return (
    <>
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-4">Room Features & Furnishing</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="has_bedframes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Bed Frames
                  {!hasFeatureAccess('premium_furnishing') && <Badge variant="outline" className="ml-1">Basic</Badge>}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_mattresses"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Mattresses
                  {!hasFeatureAccess('premium_furnishing') && <Badge variant="outline" className="ml-1">Basic</Badge>}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_wardrobes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!hasFeatureAccess('premium_furnishing')}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Wardrobes
                  {!hasFeatureAccess('premium_furnishing') && <Badge variant="secondary" className="ml-1">Premium</Badge>}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_individual_meters"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!hasFeatureAccess('advanced_utilities')}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Individual Meters
                  {!hasFeatureAccess('advanced_utilities') && <Badge variant="secondary" className="ml-1">Premium</Badge>}
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="advance_payment_months"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Advance Payment (Months)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="24"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allow_bill_sharing"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!hasFeatureAccess('advanced_billing')}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal">
                Allow Bill Sharing
                {!hasFeatureAccess('advanced_billing') && <Badge variant="secondary" className="ml-1">Premium</Badge>}
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default RoomFeaturesFields;
