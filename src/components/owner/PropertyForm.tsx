
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyCategory } from '@/types/property';

const propertyFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  propertyCategory: z.enum(['Hostel', 'Homestel', 'Apartment'] as const, {
    message: "Please select a property category.",
  }),
  type: z.string().min(1, {
    message: "Please select a property type.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  state: z.string().min(1, {
    message: "State is required",
  }),
  zip: z.string().min(1, {
    message: "Zip code is required",
  }),
  price: z.number().positive({
    message: "Price must be a positive number.",
  }),
  price_unit: z.string().min(1, {
    message: "Please select a price unit.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  distance_to_campus: z.string().optional(),
  amenities: z.string().optional(),
  house_rules: z.string().optional(),
  status: z.string().min(1, {
    message: "Please select a property status.",
  }),
  occupancy: z.string().optional(),
  image_url: z.string().optional(),
  all_inclusive: z.boolean().default(false),
  utilities: z.string().optional(),
  location: z.string().optional(),
  bedrooms: z.number().positive({
    message: "Bedrooms must be a positive number.",
  }),
  bathrooms: z.number().positive({
    message: "Bathrooms must be a positive number.",
  }),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  initialData?: Partial<PropertyFormValues>;
  onSubmit: (data: PropertyFormValues) => void;
  isLoading: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      propertyCategory: initialData?.propertyCategory || "Hostel",
      type: initialData?.type || "",
      address: initialData?.address || "",
      city: initialData?.city || "Accra",
      state: initialData?.state || "Greater Accra",
      zip: initialData?.zip || "00000",
      price: initialData?.price || 0,
      price_unit: initialData?.price_unit || "semester",
      description: initialData?.description || "",
      distance_to_campus: initialData?.distance_to_campus || "",
      amenities: initialData?.amenities || "",
      house_rules: initialData?.house_rules || "",
      status: initialData?.status || "Available",
      occupancy: initialData?.occupancy || "0/1",
      image_url: initialData?.image_url || "",
      all_inclusive: initialData?.all_inclusive || false,
      utilities: initialData?.utilities || "",
      location: initialData?.location || "",
      bedrooms: initialData?.bedrooms || 1,
      bathrooms: initialData?.bathrooms || 1,
    },
  });

  const propertyCategory = form.watch("propertyCategory");

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cozy Studio Apartment Near University" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Homestel">Homestel</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 500" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyCategory === "Hostel" ? (
                        <SelectItem value="semester">Per Semester</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="month">Per Month</SelectItem>
                          <SelectItem value="semester">Per Semester</SelectItem>
                          <SelectItem value="year">Per Year</SelectItem>
                          <SelectItem value="week">Per Week</SelectItem>
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
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 1" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 1" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 University Road, East Legon, Accra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Accra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Greater Accra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location/Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. East Legon, Madina, Atomic" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specific area name for searching
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance_to_campus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance to Campus</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 5 min walk" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g. 0/1, 1/4" {...field} />
                  </FormControl>
                  <FormDescription>
                    Current occupants / Total capacity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="all_inclusive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All-Inclusive</FormLabel>
                    <FormDescription>
                      Check if all utilities are included in the price
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter an image URL. Future versions will support file uploads.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property, include details about the rooms, facilities, etc." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Wi-Fi, Air Conditioning, Kitchen, Security (one per line)" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each amenity on a new line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="utilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utilities Included</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Water, Electricity, Gas (one per line)" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each utility included on a new line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="house_rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House Rules</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. No smoking, No pets (one per line)" 
                      className="min-h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each rule on a new line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (initialData?.title ? "Update Property" : "Add Property")}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default PropertyForm;
