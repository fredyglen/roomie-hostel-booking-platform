import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CriticalFieldsRestorationProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

/**
 * BE CONSCIOUS: Critical Fields Restoration Component
 * 
 * Restores essential fields for Ghana university housing compliance:
 * - Gender Restriction: Essential for university housing compliance
 * - Semester Availability: Critical for Ghana academic calendar alignment
 * - Property Category vs Type clarification
 */
const CriticalFieldsRestoration: React.FC<CriticalFieldsRestorationProps> = ({ 
  form, 
  propertyCategory 
}) => {
  const genderRestriction = form.watch('gender_restriction');
  const semesterAvailability = form.watch('semester_availability') || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gender Restriction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gender Restriction
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Essential for Ghana university housing compliance and student safety</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="gender_restriction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender Restriction *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender restriction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Male Only</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="female">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-pink-50 text-pink-700">Female Only</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="mixed">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Mixed</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Semester Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Semester Availability
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>System automatically calculates 4 months from booking date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="semester_availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Semesters *</FormLabel>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {[
                    { value: 'semester_1', label: 'First Semester' },
                    { value: 'semester_2', label: 'Second Semester' },
                    { value: 'year_round', label: 'Year Round' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.value}
                        checked={field.value?.includes(option.value as any)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, option.value]);
                          } else {
                            field.onChange(currentValue.filter((val) => val !== option.value));
                          }
                        }}
                      />
                      <label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

        </CardContent>
      </Card>
    </div>
  );
};

export default CriticalFieldsRestoration;
