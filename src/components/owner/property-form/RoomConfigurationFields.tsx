import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface RoomConfigurationFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: string;
}

const RoomConfigurationFields: React.FC<RoomConfigurationFieldsProps> = ({ form, propertyCategory }) => {
  const watchMeterType = form.watch('meter_type');
  
  // Ghana hostel room types based on category
  const getRoomTypeOptions = () => {
    switch (propertyCategory) {
      case 'Hostel':
        return [
          { value: '1_in_a_room', label: '1 in a room' },
          { value: '2_in_a_room', label: '2 in a room' },
          { value: '3_in_a_room', label: '3 in a room' },
          { value: '4_in_a_room', label: '4 in a room' }
        ];
      case 'Homestel':
        return [
          { value: 'single_room', label: 'Single room' },
          { value: 'shared_room', label: 'Shared room' }
        ];
      case 'Apartment':
        return [
          { value: 'studio', label: 'Studio' },
          { value: '1_bedroom', label: '1 bedroom' },
          { value: '2_bedroom', label: '2 bedroom' },
          { value: '3_bedroom', label: '3 bedroom' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Room Types Available */}
      <FormField
        control={form.control}
        name="room_types"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Types Available *</FormLabel>
            <FormDescription>
              Select all room types available in your {propertyCategory.toLowerCase()}
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {getRoomTypeOptions().map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, option.value]);
                      } else {
                        field.onChange(currentValue.filter((val) => val !== option.value));
                      }
                    }}
                  />
                  <label htmlFor={option.value} className="text-sm font-medium">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Pricing Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Semester *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="2500"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Price in Ghana Cedis (GH₵) for 4-month semester
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Rooms *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bathrooms *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Utility Configuration - FIXED REDUNDANCY */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Utility Configuration</h3>
        
        <FormField
          control={form.control}
          name="meter_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Utility Meter Setup *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meter configuration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="shared">Shared Meter (Bills split among tenants)</SelectItem>
                  <SelectItem value="individual">Individual Meters (Each room pays separately)</SelectItem>
                  <SelectItem value="all_inclusive">All Inclusive (Utilities included in rent)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How are utilities (electricity, water) managed in your property?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Bill Sharing - Only show for individual meters */}
        {watchMeterType === 'individual' && (
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
                  <FormLabel>
                    Allow bill sharing between roommates
                  </FormLabel>
                  <FormDescription>
                    Students can split utility costs with their roommates
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Auto-enable bill sharing for shared meters */}
        {watchMeterType === 'shared' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              ✓ Bill sharing is automatically enabled for shared meter configuration
            </p>
          </div>
        )}
      </div>

      {/* Advance Payment */}
      <FormField
        control={form.control}
        name="advance_payment_months"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Advance Payment Required</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select advance payment period" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">No advance payment required</SelectItem>
                <SelectItem value="1">1 month advance</SelectItem>
                <SelectItem value="2">2 months advance</SelectItem>
                <SelectItem value="3">3 months advance</SelectItem>
                <SelectItem value="4">Full semester advance</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              How much advance payment do you require from students?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Maximum Occupancy */}
      <FormField
        control={form.control}
        name="max_occupants"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Occupancy *</FormLabel>
            <FormControl>
              <Input 
                type="number"
                placeholder="20"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Total number of students your property can accommodate
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RoomConfigurationFields;
