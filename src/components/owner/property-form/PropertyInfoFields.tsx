import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { getPropertyTypeOptions, categoryToType } from '@/config/property-types.config';

interface PropertyInfoFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const PropertyInfoFields: React.FC<PropertyInfoFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {/* Property Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Sunrise Hostel, Campus View Homestel"
                {...field}
                className={form.formState.errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
            </FormControl>
            <FormDescription>
              Give your property a memorable name that students will recognize
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Affordable Student Housing Near Campus"
                {...field}
                className={form.formState.errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
            </FormControl>
            <FormDescription>
              A descriptive title for your property listing
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="propertyCategory"
          render={({ field }) => {
            const propertyTypeOptions = getPropertyTypeOptions();

            return (
              <FormItem>
                <FormLabel>Property Category <span className="text-red-500">*</span></FormLabel>
                <FormDescription>
                  The building type - determines room configuration options
                </FormDescription>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Auto-set property type based on category using centralized config
                    const propertyType = categoryToType(value as any);
                    form.setValue("type", propertyType);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} ({option.description})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            const propertyCategory = form.watch('propertyCategory');

            const getTypeOptions = () => {
              switch (propertyCategory) {
                case 'Hostel':
                  return [
                    { value: 'hostel', label: 'Hostel (Bed-based tracking)' }
                  ];
                case 'Homestel':
                  return [
                    { value: 'hostel', label: 'Operate as Hostel (Bed-based tracking)' },
                    { value: 'homestel', label: 'Operate as Homestel (Room-based tracking)' }
                  ];
                case 'Apartment':
                  return [
                    { value: 'apartment', label: 'Apartment (Unit-based tracking)' }
                  ];
                default:
                  return [];
              }
            };

            return (
              <FormItem>
                <FormLabel>Property Type <span className="text-red-500">*</span></FormLabel>
                <FormDescription>
                  How the property operates - determines pricing and booking model
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operational type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getTypeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      {/* Location Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                  <SelectItem value="Ashanti">Ashanti</SelectItem>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Western">Western</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City/Town <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Accra, Kumasi, Cape Coast"
                  {...field}
                  className={form.formState.errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Address <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Near UPSA Main Gate, Madina-Accra"
                {...field}
                className={form.formState.errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
            </FormControl>
            <FormDescription>
              Include nearby landmarks and university proximity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nearest University */}
      <FormField
        control={form.control}
        name="nearest_university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nearest University <span className="text-red-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select nearest university" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="UPSA">University of Professional Studies, Accra (UPSA)</SelectItem>
                <SelectItem value="University of Ghana">University of Ghana, Legon</SelectItem>
                <SelectItem value="KNUST">Kwame Nkrumah University of Science and Technology (KNUST)</SelectItem>
                <SelectItem value="UCC">University of Cape Coast (UCC)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Description <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your property, its unique features, and what makes it special for students..."
                className={`min-h-[120px] resize-none ${form.formState.errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                maxLength={1000}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide a detailed description that helps students understand your property.
              {field.value?.length || 0}/1000 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Good to Know Section */}
      <FormField
        control={form.control}
        name="good_to_know"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Good to Know</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share important details students should know (e.g., 'Water supply available 6 days a week', 'Quiet study hours after 10 PM', 'Generator backup during power outages')"
                className="min-h-[100px] resize-none"
                maxLength={500}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Help students make informed decisions by sharing important property details.
              {field.value?.length || 0}/500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyInfoFields;
