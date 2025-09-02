import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { showValidationErrorToast, showPropertyFormToasts } from '@/utils/toast';
import { Users } from 'lucide-react';

interface RoomConfigurationFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: string;
}

const RoomConfigurationFields: React.FC<RoomConfigurationFieldsProps> = ({ form, propertyCategory }) => {
  // Auto-calculate max occupants based on room types and total rooms
  const totalRooms = form.watch('bedrooms') || 0;
  const roomTypes = form.watch('room_types') || [];

  useEffect(() => {
    if (roomTypes.length > 0 && totalRooms > 0) {
      // Calculate based on room types
      const maxOccupantsPerRoom = Math.max(...roomTypes.map(type => {
        const occupancyMap = {
          '1_in_a_room': 1, '2_in_a_room': 2, '3_in_a_room': 3, '4_in_a_room': 4, '5_in_a_room': 5, '6_in_a_room': 6,
          'single_room': 1, 'shared_room': 2,
          '1_bedroom_apartment': 0, '2_bedroom_apartment': 0, '3_bedroom_apartment': 0 // Apartments have flexible occupancy
        };
        return occupancyMap[type as keyof typeof occupancyMap] || 1;
      }));

      const totalCapacity = totalRooms * maxOccupantsPerRoom;
      form.setValue('max_occupants', totalCapacity);
    }
  }, [roomTypes, totalRooms, form]);
  const watchMeterType = form.watch('meter_type');
  const watchRoomTypes = form.watch('room_types') || [];

  // Ghana hostel room types based on category
  const getRoomTypeOptions = () => {
    switch (propertyCategory) {
      case 'Hostel':
        return [
          { value: '1_in_a_room', label: '1 in a room' },
          { value: '2_in_a_room', label: '2 in a room' },
          { value: '3_in_a_room', label: '3 in a room' },
          { value: '4_in_a_room', label: '4 in a room' },
          { value: '5_in_a_room', label: '5 in a room' },
          { value: '6_in_a_room', label: '6 in a room' }
        ];
      case 'Homestel':
        return [
          { value: 'single_room', label: 'Single room' },
          { value: 'shared_room', label: 'Shared room' }
        ];
      case 'Apartment':
        return [
          { value: '1_bedroom_apartment', label: '1 Bedroom Apartment' },
          { value: '2_bedroom_apartment', label: '2 Bedroom Apartment' },
          { value: '3_bedroom_apartment', label: '3 Bedroom Apartment' }
        ];
      default:
        return [];
    }
  };

  // BE CONSCIOUS: Removed getBedsPerRoomOptions - redundant with room type-based occupancy

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
                      let newValue;

                      if (checked) {
                        newValue = [...currentValue, option.value];
                        field.onChange(newValue);

                        // Show smart configuration toast for single room selection
                        if (option.value === 'single_room' && propertyCategory === 'Homestel') {
                          showPropertyFormToasts.smartConfigurationApplied('single room');
                        }
                      } else {
                        newValue = currentValue.filter((val) => val !== option.value);
                        field.onChange(newValue);

                        // Validate that at least one room type is selected
                        if (newValue.length === 0) {
                          showValidationErrorToast("Room Types", "Please select at least one room type for your property.");
                        }
                      }

                      // BE CONSCIOUS: Room type changes will auto-update max occupants in DynamicPricingMatrix
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

      {/* BE CONSCIOUS: Removed redundant "Beds Per Room" selector - room types already define occupancy */}

      {/* BE CONSCIOUS: Pricing moved to DynamicPricingMatrix component for room type-based pricing */}

      {/* Room and Washroom Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <FormLabel>Total Washrooms *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Number of washrooms/bathrooms available in your property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* BE CONSCIOUS: Utility Configuration */}
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

      {/* Advance Payment - Only for Homestels and Apartments */}
      {(propertyCategory === 'Homestel' || propertyCategory === 'Apartment') && (
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
      )}

      {/* Auto-calculated Maximum Occupancy - Ghana standard: every bed = one student */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-green-600" />
          <h4 className="font-medium text-green-800">Maximum Students Capacity</h4>
        </div>
        <p className="text-sm text-green-700 mb-3">
          Based on Ghana hostel standards: <strong>Every bed = One student</strong>
        </p>
        <div className="text-lg font-semibold text-green-800">
          {(() => {
            if (roomTypes.length === 0 || totalRooms === 0) {
              return 'Select room types and total rooms to calculate capacity';
            }

            // Calculate based on room types
            const isApartment = roomTypes.some(type => type.includes('apartment'));

            if (isApartment) {
              return `Flexible occupancy - Owner decides`;
            }

            const maxOccupantsPerRoom = Math.max(...roomTypes.map(type => {
              const occupancyMap = {
                '1_in_a_room': 1, '2_in_a_room': 2, '3_in_a_room': 3, '4_in_a_room': 4, '5_in_a_room': 5, '6_in_a_room': 6,
                'single_room': 1, 'shared_room': 2,
                '1_bedroom_apartment': 0, '2_bedroom_apartment': 0, '3_bedroom_apartment': 0 // Flexible occupancy
              };
              return occupancyMap[type as keyof typeof occupancyMap] || 1;
            }));

            const totalCapacity = totalRooms * maxOccupantsPerRoom;
            return `${totalCapacity} students maximum`;
          })()}
        </div>
        <p className="text-xs text-green-600 mt-2">
          This is automatically calculated based on your room configuration
        </p>
      </div>
    </div>
  );
};

export default RoomConfigurationFields;
