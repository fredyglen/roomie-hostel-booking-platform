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
    // Prefer structure-aware capacity when buildings/floors/rooms are provided
    const buildings = form.getValues('buildings') as any[] | undefined;
    if (Array.isArray(buildings) && buildings.length > 0) {
      let sum = 0;
      for (const b of buildings) {
        for (const f of (b?.floors ?? [])) {
          for (const r of (f?.rooms ?? [])) {
            // Use explicit per-room max when available, else bedCount, else infer from roomType
            const inferFromType = (rt?: string) => {
              const m = rt?.match(/(\d+)_in_a_room/);
              return m ? Number(m[1]) : 0;
            };
            const occ = Number(r?.maxOccupants ?? r?.bedCount ?? inferFromType(r?.roomType)) || 0;
            sum += occ;
          }
        }
      }
      if (sum > 0) {
        form.setValue('max_occupants', sum);
        return;
      }
    }

    // Distribution-aware fallback when no detailed structure exists
    if (roomTypes.length > 0 && totalRooms > 0) {
      const occFromType = (type: string) => {
        const m = type.match(/(\d+)_in_a_room/);
        if (m) return Number(m[1]);
        // Apartment room types are flexible units; treat as 0 for capacity calc here
        if (/_bedroom_apartment$/.test(type)) return 0;
        return 1;
      };

      const types = roomTypes;
      const base = Math.floor(totalRooms / types.length);
      let remainder = totalRooms % types.length;
      let total = 0;
      types.forEach((t, idx) => {
        const count = base + (idx < remainder ? 1 : 0);
        total += count * occFromType(t);
      });

      form.setValue('max_occupants', total);
    }
  }, [form, roomTypes, totalRooms, watchBuildings]);
  const watchMeterType = form.watch('meter_type');
  const watchRoomTypes = form.watch('room_types') || [];
  const watchBuildings = form.watch('buildings') || [];


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
          { value: '1_in_a_room', label: '1 in a room' },
          { value: '2_in_a_room', label: '2 in a room' },
          { value: '3_in_a_room', label: '3 in a room' },
          { value: '4_in_a_room', label: '4 in a room' },
          { value: '5_in_a_room', label: '5 in a room' },
          { value: '6_in_a_room', label: '6 in a room' }
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
            <div className="flex flex-wrap gap-3 mt-2">
              {getRoomTypeOptions().map((option) => {
                const selected = (field.value || []).includes(option.value);
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      const currentValue = field.value || [];
                      let newValue: string[];
                      if (selected) {
                        newValue = currentValue.filter((v: string) => v !== option.value);
                      } else {
                        newValue = [...currentValue, option.value];
                      }
                      field.onChange(newValue);
                      if (newValue.length === 0) {
                        showValidationErrorToast("Room Types", "Please select at least one room type for your property.");
                      }
                    }}
                    className={`py-2 px-4 rounded-full border text-sm font-medium ${
                      selected ? 'border-primary bg-primary/20 text-primary' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
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
                  placeholder="e.g. 50"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : Number(val));
                  }}
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
                  placeholder="e.g. 25"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? undefined : Number(val));
                  }}
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
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { value: 'shared', label: 'Shared' },
                  { value: 'individual', label: 'Individual' },
                  { value: 'all_inclusive', label: 'All Inclusive' }
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    className={`flex-1 text-center py-2 px-4 rounded-lg border font-semibold ${
                      field.value === opt.value
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => field.onChange(opt.value as any)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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

    </div>
  );
};

export default RoomConfigurationFields;
