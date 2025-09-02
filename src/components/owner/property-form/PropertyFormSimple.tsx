import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Upload, Home, MapPin, DollarSign } from 'lucide-react';

// Simplified schema that matches BASIC database (supabase-setup.sql)
const simplePropertySchema = z.object({
  // Core fields that match basic database
  title: z.string().min(1, 'Property title is required'),
  type: z.enum(['hostel', 'homestel', 'apartment']), // Basic DB uses 'type'
  address: z.string().min(1, 'Address is required'),

  // Pricing (basic schema)
  price: z.number().min(1, 'Price must be greater than 0'),
  price_unit: z.string().default('semester'),

  // Essential details
  description: z.string().min(10, 'Description must be at least 10 characters'),
  occupancy: z.string().default(''), // Basic schema uses text field

  // Basic amenities (simplified)
  amenities: z.array(z.string()).default([]),

  // Media
  image_url: z.string().optional(), // Basic schema uses 'image_url'

  // Optional fields
  distance_to_campus: z.string().optional(),
  house_rules: z.array(z.string()).default([]),
});

export type SimplePropertyFormValues = z.infer<typeof simplePropertySchema>;

interface PropertyFormSimpleProps {
  onSubmit: (data: SimplePropertyFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<SimplePropertyFormValues>;
}

// Common amenities for Ghana hostels
const COMMON_AMENITIES = [
  'WiFi Internet',
  'Water Supply',
  'Electricity',
  'Security',
  'Parking',
  'Kitchen Access',
  'Laundry',
  'Study Area',
  'Common Room',
  'CCTV',
  'Generator',
  'Cleaning Service'
];

const PropertyFormSimple: React.FC<PropertyFormSimpleProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );
  const [maxOccupancy, setMaxOccupancy] = useState<number>(1);

  const form = useForm<SimplePropertyFormValues>({
    resolver: zodResolver(simplePropertySchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'hostel',
      address: initialData?.address || '',
      price: initialData?.price || 0,
      price_unit: 'semester',
      description: initialData?.description || '',
      occupancy: initialData?.occupancy || '',
      amenities: initialData?.amenities || [],
      image_url: initialData?.image_url || '',
      distance_to_campus: initialData?.distance_to_campus || '',
      house_rules: initialData?.house_rules || [],
    }
  });

  const handleSubmit = (data: SimplePropertyFormValues) => {
    // Include selected amenities and format occupancy
    const finalData = {
      ...data,
      amenities: selectedAmenities,
      occupancy: `${maxOccupancy} beds` // Format for basic schema
    };
    onSubmit(finalData);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const propertyType = form.watch('type');
  const completedFields = Object.values(form.getValues()).filter(value =>
    value !== '' && value !== 0 && value !== undefined
  ).length;
  const totalFields = 6; // Essential fields only

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Add New Property</h2>
            <p className="text-gray-600">Create a simple listing for your {propertyType}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline">
              Progress: {completedFields}/{totalFields}
            </Badge>
            <Badge variant={completedFields >= 6 ? "default" : "secondary"}>
              {completedFields >= 6 ? "Ready to Submit" : "In Progress"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunrise Hostel - UPSA Campus" {...field} />
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
                      <FormLabel>Property Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="homestel">Homestel</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
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
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., East Legon, Near UPSA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Semester (GHS) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1500"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Details */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your property, rooms, and what makes it special..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Total Beds/Capacity *</FormLabel>
                  <Input
                    type="number"
                    placeholder="e.g., 20"
                    value={maxOccupancy}
                    onChange={(e) => setMaxOccupancy(Number(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    How many students can your property accommodate?
                  </p>
                </div>

                <div>
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {COMMON_AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Media */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Image upload feature coming soon!<br />
                    For now, use image URLs from Google Drive or similar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Buttons */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Property...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyFormSimple;
