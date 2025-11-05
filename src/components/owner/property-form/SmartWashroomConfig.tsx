import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bath, Home, Users, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SmartWashroomConfigProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Washroom Configuration Component
 *
 * Two-step washroom system:
 * 1. Inside/Outside washroom location
 * 2. Shared/Not Shared with conditional inputs
 */
const SmartWashroomConfig: React.FC<SmartWashroomConfigProps> = ({
  form,
  propertyCategory
}) => {
  const washroomLocation = form.watch('washroom_location');
  const washroomSharing = form.watch('washroom_sharing');
  const roomTypes = form.watch('room_types') || [];

  // BE CONSCIOUS: Calculate sharing details for each room type
  const getRoomTypeOccupancy = (roomType: string) => {
    const occupancyMap = {
      '1_in_a_room': 1,
      '2_in_a_room': 2,
      '3_in_a_room': 3,
      '4_in_a_room': 4,
      '5_in_a_room': 5,
      '6_in_a_room': 6
    } as const;
    return (occupancyMap as any)[roomType] ?? (Number(roomType.match(/^(\d+)_in_a_room$/)?.[1]) || 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bath className="h-5 w-5" />
          Washroom Configuration
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure washroom location and sharing arrangements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Washroom Location */}
          <div>
            <FormField
              control={form.control}
              name="washroom_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Washroom Location *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inside">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>Inside Room</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="outside">
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4" />
                          <span>Outside Room</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Washroom Sharing */}
          <div>
            <FormField
              control={form.control}
              name="washroom_sharing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sharing Arrangement *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sharing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>Private (Not Shared)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shared">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Shared</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Shared Washroom Details - Only for shared type */}
        {washroomSharing === 'shared' && (
          <div className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="people_per_washroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>People Per Washroom</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2"
                      placeholder="e.g. 4"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room Type Sharing Tags */}
            {roomTypes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sharing details</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label="Show washroom sharing details"
                        className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">info</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs text-gray-800 space-y-1">
                        {roomTypes.map((roomType) => {
                          const occupancy = getRoomTypeOccupancy(roomType);
                          const peoplePerWashroom = form.watch('people_per_washroom') || 4;
                          const washroomsNeeded = Math.ceil(occupancy / peoplePerWashroom);
                          const label = roomType.replaceAll('_', ' ');
                          return (
                            <div key={roomType} className="flex items-center justify-between gap-2">
                              <span className="font-medium capitalize">{label}</span>
                              <span className="tabular-nums text-gray-600">{occupancy} people → {washroomsNeeded} washroom{washroomsNeeded > 1 ? 's' : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartWashroomConfig;
