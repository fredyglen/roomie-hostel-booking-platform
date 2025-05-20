
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

const propertyFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select a property type.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
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
      type: initialData?.type || "",
      address: initialData?.address || "",
      price: initialData?.price || 0,
      price_unit: initialData?.price_unit || "",
      description: initialData?.description || "",
      distance_to_campus: initialData?.distance_to_campus || "",
      amenities: initialData?.amenities || "",
      house_rules: initialData?.house_rules || "",
      status: initialData?.status || "Available",
      occupancy: initialData?.occupancy || "0/1",
      image_url: initialData?.image_url || "",
    },
  });

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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Shared">Shared</SelectItem>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Room">Room</SelectItem>
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
                      <SelectItem value="month">Per Month</SelectItem>
                      <SelectItem value="semester">Per Semester</SelectItem>
                      <SelectItem value="year">Per Year</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                    </SelectContent>
                  </Select>
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
