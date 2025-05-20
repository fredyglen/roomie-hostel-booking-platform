
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Mock property data
const propertyData = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    price: '850',
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    description: 'This cozy studio apartment is perfect for students looking for a comfortable and convenient living space near UPSA. The apartment features a modern design, fully furnished with all the essential amenities to make your stay as comfortable as possible.',
    amenities: 'Wi-Fi, Air Conditioning, Kitchen, Security',
    houseRules: 'No smoking, No pets, No parties, Quiet hours from 10 PM to 6 AM',
    availableUnits: '3'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: '500',
    priceUnit: 'month',
    address: '456 College Avenue, Legon, Accra',
    description: 'Share a spacious 2-bedroom apartment with a fellow student. The apartment is fully furnished with a shared kitchen, living room, and bathroom. Each bedroom is private and comes with a desk, chair, and wardrobe.',
    amenities: 'Wi-Fi, Shared Kitchen, Laundry, Water Supply',
    houseRules: "No smoking, No pets, Clean common areas after use, Respect roommates' space and belongings",
    availableUnits: '1'
  }
];

// Define form schema with Zod (same as PropertyNew)
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

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the property with matching ID
  const property = propertyData.find(p => p.id === id);
  
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
  
  // Populate form when property data is available
  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        type: property.type,
        price: property.price,
        priceUnit: property.priceUnit,
        address: property.address,
        description: property.description,
        amenities: property.amenities,
        houseRules: property.houseRules,
        availableUnits: property.availableUnits
      });
    }
  }, [property, form]);
  
  const onSubmit = (data: PropertyFormValues) => {
    console.log("Form data:", data);
    // Here you would typically update this data via your API
    
    toast({
      title: "Property Updated",
      description: "Your property has been successfully updated!",
    });
    
    // Redirect to the properties list after successful update
    navigate("/owner/properties");
  };
  
  if (!property) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Property Not Found</h2>
          <p className="mt-2 text-gray-600">The property you're trying to edit doesn't exist</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/owner/properties')}
          >
            Back to Properties
          </Button>
        </div>
      </OwnerLayout>
    );
  }
  
  return (
    <OwnerLayout pageTitle={`Edit Property: ${property.title}`}>
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                          className="min-h-20"
                          {...field} 
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
                          className="min-h-20"
                          {...field} 
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
            
            {/* Current photos */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Current Photos</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="relative h-40 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80"
                    alt="Property thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="relative h-40 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80"
                    alt="Property thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Add more photos */}
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
              <Button 
                variant="destructive" 
                type="button"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  const confirmDelete = window.confirm("Are you sure you want to delete this property? This action cannot be undone.");
                  if (confirmDelete) {
                    toast({
                      variant: "destructive",
                      title: "Property Deleted",
                      description: "Your property has been permanently removed",
                    });
                    navigate('/owner/properties');
                  }
                }}
              >
                Delete Property
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </OwnerLayout>
  );
};

export default PropertyEdit;
