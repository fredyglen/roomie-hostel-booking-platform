import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Clock, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BookingDurationFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Booking Duration System Component
 * 
 * Implements Ghana university standards compliance:
 * - Hostels: Semester (4 months) only - Ghana university standard
 * - Homestels & Apartments: Flexible durations with custom option
 * - Custom Duration Logic: For early vacancies and short-term rentals
 */
const BookingDurationFields: React.FC<BookingDurationFieldsProps> = ({ 
  form, 
  propertyCategory 
}) => {
  const bookingDuration = form.watch('booking_duration');
  const customDurationWeeks = form.watch('custom_duration_weeks');

  // BE CONSCIOUS: Ghana university standards - Hostels support semester and academic year
  const getAvailableDurations = () => {
    if (propertyCategory === 'Hostel') {
      return [
        { value: 'semester', label: '4 Months (1 Semester)', description: 'Single semester booking' },
        { value: 'academic_year', label: '8 Months (Academic Year)', description: 'Full academic year (2 semesters)' }
      ];
    }

    // Homestels & Apartments have flexible durations
    return [
      { value: 'week', label: '1 Week', description: 'Short-term stay' },
      { value: 'month', label: '1 Month', description: 'Monthly rental' },
      { value: 'semester', label: '4 Months (1 Semester)', description: 'University semester' },
      { value: 'academic_year', label: '8 Months (Academic Year)', description: 'Full academic year (2 semesters)' },
      { value: 'year', label: '12 Months (1 Year)', description: 'Annual rental' },
      { value: 'custom', label: 'Custom Duration', description: 'Flexible timing' }
    ];
  };

  // BE CONSCIOUS: Calculate duration display for pricing context
  const getDurationInWeeks = () => {
    switch (bookingDuration) {
      case 'week': return 1;
      case 'month': return 4;
      case 'semester': return 16; // 4 months = 16 weeks
      case 'academic_year': return 32; // 8 months = 32 weeks (Ghana academic year)
      case 'year': return 52;
      case 'custom': return customDurationWeeks || 1;
      default: return 16;
    }
  };

  return (
    <div className="space-y-6">

      {/* Booking Duration Selection */}
      <FormField
        control={form.control}
        name="booking_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Booking Duration <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="What is a semester?" className="text-gray-500 hover:text-gray-700">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    A semester is approximately 4 months.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                // BE CONSCIOUS: Auto-update price_unit to match booking_duration
                form.setValue('price_unit', value as any);
                
                // Clear custom duration when not needed
                if (value !== 'custom') {
                  form.setValue('custom_duration_weeks', undefined);
                }
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getAvailableDurations().map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{duration.label}</span>
                      <span className="text-xs text-gray-500">{duration.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {propertyCategory === 'Hostel' 
                ? 'Hostels follow Ghana university semester system (4 months)'
                : 'Choose the booking duration that works best for your property'
              }
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Custom Duration Input - Only for Homestels & Apartments */}
      {bookingDuration === 'custom' && propertyCategory !== 'Hostel' && (
        <FormField
          control={form.control}
          name="custom_duration_weeks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Duration (Weeks) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="52"
                  placeholder="e.g. 6"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the number of weeks for your custom booking duration (1-52 weeks)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

    </div>
  );
};

export default BookingDurationFields;
