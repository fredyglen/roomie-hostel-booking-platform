
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const washroomType = form.watch('washroom_type');
  const meterType = form.watch('meter_type');

  return (
    <div className="col-span-full">
      <h3 className="text-lg font-medium mb-4">Room Features & Furnishing</h3>
      
      {/* Basic Furnishing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          name="has_fan"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Fan
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_tiled_room"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Tiled Room
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Washroom Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="washroom_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Washroom Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select washroom type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="inside">Inside Washroom</SelectItem>
                  <SelectItem value="outside">Outside Washroom</SelectItem>
                  <SelectItem value="shared">Shared Washroom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {washroomType === 'shared' && (
          <FormField
            control={form.control}
            name="shared_washroom_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of People Sharing Washroom</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 4"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                  />
                </FormControl>
                <FormDescription>
                  How many people share each washroom
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Meter Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="meter_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meter Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meter type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="self">Self Meter</SelectItem>
                  <SelectItem value="shared">Shared Meter</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {meterType === 'shared' && (
          <FormField
            control={form.control}
            name="shared_meter_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of People Sharing Meter</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 6"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))} 
                  />
                </FormControl>
                <FormDescription>
                  How many people share each meter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={form.control}
        name="advance_payment_months"
        render={({ field }) => (
          <FormItem className="max-w-xs">
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
    </div>
  );
};

export default RoomFeaturesFields;
