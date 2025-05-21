
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Building, Home, Users } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface PropertyTypeFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

const PropertyTypeFields: React.FC<PropertyTypeFieldsProps> = ({ form, propertyCategory }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="propertyCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Category</FormLabel>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                // Reset type when category changes
                form.setValue("type", "");
                // Set default price unit based on category
                if (value === "Hostel") {
                  form.setValue("price_unit", "semester");
                } else {
                  form.setValue("price_unit", "month");
                }
              }} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Hostel">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Hostel</span>
                  </div>
                </SelectItem>
                <SelectItem value="Homestel">
                  <div className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Homestel</span>
                  </div>
                </SelectItem>
                <SelectItem value="Apartment">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Apartment</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Determines the pricing and booking model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyCategory === "Hostel" && (
                  <>
                    <SelectItem value="1 in a room">1 in a room</SelectItem>
                    <SelectItem value="2 in a room">2 in a room</SelectItem>
                    <SelectItem value="3 in a room">3 in a room</SelectItem>
                    <SelectItem value="4 in a room">4 in a room</SelectItem>
                  </>
                )}
                {propertyCategory === "Homestel" && (
                  <>
                    <SelectItem value="Single room">Single room</SelectItem>
                    <SelectItem value="Chamber and hall">Chamber and hall</SelectItem>
                    <SelectItem value="Shared room">Shared room</SelectItem>
                  </>
                )}
                {propertyCategory === "Apartment" && (
                  <>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="1 bedroom">1 bedroom</SelectItem>
                    <SelectItem value="2 bedroom">2 bedroom</SelectItem>
                    <SelectItem value="3 bedroom">3 bedroom</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Partially Occupied">Partially Occupied</SelectItem>
                <SelectItem value="Fully Occupied">Fully Occupied</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="occupancy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupancy</FormLabel>
            <FormControl>
              <Input placeholder={propertyCategory === "Hostel" ? "e.g. 5/12 beds" : "e.g. 2/4 rooms"} {...field} />
            </FormControl>
            <FormDescription>
              {propertyCategory === "Hostel" 
                ? "Available beds / Total beds" 
                : propertyCategory === "Homestel" 
                  ? "Available rooms / Total rooms" 
                  : "Maximum occupants allowed"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyTypeFields;
