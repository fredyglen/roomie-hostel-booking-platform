
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface HomestelFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  updateOccupancyDetails: () => void;
}

const HomestelFields: React.FC<HomestelFieldsProps> = ({ form, updateOccupancyDetails }) => {
  // Watch room types to implement smart conditional logic
  const watchRoomTypes = form.watch('room_types') || [];
  const hasSingleRoom = watchRoomTypes.includes('single_room');
  const hasSharedRoom = watchRoomTypes.includes('shared_room');
  const hasOnlySingleRooms = hasSingleRoom && !hasSharedRoom;

  // Auto-set max occupants when single room is selected
  React.useEffect(() => {
    if (hasOnlySingleRooms) {
      // For single rooms only, automatically set max occupants to 1
      form.setValue('max_occupants', 1);
    }
  }, [hasOnlySingleRooms, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="total_rooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Rooms</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 3"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.valueAsNumber);
                  updateOccupancyDetails();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rooms_available"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rooms Available</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="e.g. 2"
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.valueAsNumber);
                  updateOccupancyDetails();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Smart conditional logic: Hide max occupants field for single rooms only */}
      {!hasOnlySingleRooms && (
        <FormField
          control={form.control}
          name="max_occupants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Occupants Per Room</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 2"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>Maximum number of occupants allowed per room</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Show smart hint when single rooms are selected */}
      {hasOnlySingleRooms && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ <strong>Smart Configuration:</strong> Since you selected "Single room" only,
            max occupants per room is automatically set to 1 person.
          </p>
        </div>
      )}
    </>
  );
};

export default HomestelFields;
