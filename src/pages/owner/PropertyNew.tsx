
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

// Define form schema with Zod
const propertyFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  type: z.string().min(1, { message: "Please select a property type" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  priceUnit: z.string().min(1, { message: "Please select a price unit" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  amenities: z.string().min(1, { message: "Please add at least one amenity" }),
  houseRules: z.string().min(1, { message: "Please add at least one house rule" }),
  availableUnits: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Available units must be a positive number",
  })
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const PropertyNew: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      type: "",
      price: "",
      priceUnit: "month",
      address: "",
      description: "",
      amenities: "",
      houseRules: "",
      availableUnits: "1"
    }
  });

  const onSubmit = (data: PropertyFormValues) => {
    console.log("Form data:", data);
    // Here you would typically send this data to your API
    
    toast({
      title: "Property Created",
      description: "Your property has been successfully created!",
    });
    
    // Redirect to the properties list after successful submission
    navigate("/owner/properties");
  };

  return (
    <OwnerLayout pageTitle="Add New Property">
      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Cozy Studio Near Campus" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a catchy title that describes your property
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <select
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          >
                            <option value="" disabled>Select type</option>
                            <option value="Studio">Studio</option>
                            <option value="Shared">Shared Apartment</option>
                            <option value="Single">Single Room</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Apartment">Full Apartment</option>
                          </select>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availableUnits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Units</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Full address of the property" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                            $
                          </span>
                          <Input className="pl-8" type="number" min="0" step="0.01" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <select
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        >
                          <option value="month">Month</option>
                          <option value="semester">Semester</option>
                          <option value="year">Year</option>
                        </select>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your property in detail..." 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include important details about the space, neighborhood, and why it's great for students
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Features */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Wi-Fi, Air Conditioning, Kitchen, Security..." 
                          {...field} 
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormDescription>
                        List amenities separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="houseRules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Rules</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="No smoking, No pets, Quiet hours..." 
                          {...field} 
                          className="min-h-20"
                        />
                      </FormControl>
                      <FormDescription>
                        List house rules separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Photo Upload - Adding just a placeholder for now */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Property Photos</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-roomi-blue hover:text-roomi-teal focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-roomi-blue">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate('/owner/properties')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Property</Button>
            </div>
          </form>
        </Form>
      </div>
    </OwnerLayout>
  );
};

export default PropertyNew;
