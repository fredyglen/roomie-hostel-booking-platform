
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { getPropertyTypeOptions, categoryToType, getPropertyTypeConfig } from '@/config/property-types.config';

interface PropertyTypeFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  propertyCategory: 'Hostel' | 'Homestel' | 'Apartment';
}

const PropertyTypeFields: React.FC<PropertyTypeFieldsProps> = ({ form, propertyCategory }) => {
  const propertyTypeOptions = getPropertyTypeOptions();

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
                // Use centralized config to set appropriate values
                const propertyType = categoryToType(value as any);
                const config = getPropertyTypeConfig(propertyType);

                form.setValue("type", config.type);
                form.setValue("price_unit", config.defaultPricingUnit);
                form.setValue("occupancy_type", config.occupancyType);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
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
                    <SelectItem value="5 in a room">5 in a room</SelectItem>
                    <SelectItem value="6 in a room">6 in a room</SelectItem>
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyTypeFields;
