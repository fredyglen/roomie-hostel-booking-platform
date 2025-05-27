
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface DescriptionFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
}

const DescriptionFields: React.FC<DescriptionFieldsProps> = ({ form }) => {
  const propertyCategory = form.watch('propertyCategory');
  
  const getDemoDescription = (category: string) => {
    switch (category) {
      case 'Hostel':
        return "Welcome to our modern student hostel located just 5 minutes from campus. Our facility offers comfortable accommodation with 4-bed rooms, each equipped with study desks, wardrobes, and ceiling fans. We provide 24/7 security, reliable water and electricity supply, high-speed WiFi throughout the building, and a spacious common area for relaxation and socializing. The hostel includes a modern kitchen facility, laundry services, and ample parking space. Perfect for students seeking a safe, affordable, and convenient living experience.";
      
      case 'Homestel':
        return "Experience comfort and privacy in our well-furnished homestel rooms. Each room comes with modern amenities including a comfortable bed with mattress, wardrobe, study desk, and fan. Shared facilities include a fully equipped kitchen, clean bathrooms, and a common lounge area. Located in a quiet residential area with easy access to campus via public transport. We provide reliable utilities, WiFi, security, and a peaceful environment perfect for focused study and rest.";
      
      case 'Apartment':
        return "Discover your ideal student apartment featuring spacious bedrooms, a modern kitchen, comfortable living area, and private bathroom. This fully furnished unit includes essential appliances, high-speed internet, and all utilities. Located in a secure residential area with excellent transport links to major universities. The apartment complex offers 24/7 security, parking facilities, and is surrounded by convenient amenities including shops, restaurants, and banking services. Perfect for students who value independence and modern living standards.";
      
      default:
        return "";
    }
  };

  const demoDescription = getDemoDescription(propertyCategory);

  return (
    <>
      <FormField 
        control={form.control} 
        name="description" 
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Property Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={`Describe your ${propertyCategory.toLowerCase()}, include details about the rooms, facilities, location advantages, etc.`}
                className="min-h-32" 
                {...field}
                value={field.value || demoDescription}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              A detailed description helps students understand what makes your property special
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />

      <FormField
        control={form.control}
        name="house_rules"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>House Rules</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="e.g. No smoking inside rooms&#10;No overnight guests&#10;Quiet hours: 10 PM - 6 AM&#10;Keep common areas clean" 
                className="min-h-20" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Enter each rule on a new line. Clear rules help maintain a peaceful living environment.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DescriptionFields;
