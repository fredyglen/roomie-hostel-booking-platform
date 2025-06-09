import React, { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCategory } from '@/types/property';
import { Upload, Bed, Building, Users, Home } from 'lucide-react';
import { IMAGE_URLS } from '@/constants/images';

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
  location: z.string().optional(),
  landmark: z.string().optional(),
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
  bedrooms: z.number().positive({
    message: "Bedrooms must be a positive number.",
  }),
  bathrooms: z.number().positive({
    message: "Bathrooms must be a positive number.",
  }),
  max_occupants: z.number().optional(),
  total_rooms: z.number().optional(),
  rooms_available: z.number().optional(),
  beds_per_room: z.number().optional(),
  beds_available: z.number().optional(),
  has_bedframes: z.boolean().default(false),
  has_mattresses: z.boolean().default(false),
  has_wardrobes: z.boolean().default(false),
  has_individual_meters: z.boolean().default(false),
  advance_payment_months: z.number().optional(),
  allow_bill_sharing: z.boolean().default(false),
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
      location: initialData?.location || "",
      landmark: initialData?.landmark || "",
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
      bedrooms: initialData?.bedrooms || 1,
      bathrooms: initialData?.bathrooms || 1,
      max_occupants: initialData?.max_occupants || 1,
      total_rooms: initialData?.total_rooms || 1,
      rooms_available: initialData?.rooms_available || 1,
      beds_per_room: initialData?.beds_per_room || 1,
      beds_available: initialData?.beds_available || 1,
      has_bedframes: initialData?.has_bedframes || false,
      has_mattresses: initialData?.has_mattresses || false,
      has_wardrobes: initialData?.has_wardrobes || false,
      has_individual_meters: initialData?.has_individual_meters || false,
      advance_payment_months: initialData?.advance_payment_months || 12,
      allow_bill_sharing: initialData?.allow_bill_sharing || false,
    },
  });

  const [mediaTab, setMediaTab] = useState<string>("upload");
  const propertyCategory = form.watch("propertyCategory");
  const allInclusive = form.watch("all_inclusive");
  
  // Calculate occupancy details based on property type
  const updateOccupancyDetails = () => {
    const category = form.getValues("propertyCategory");
    const totalRooms = form.getValues("total_rooms") || 0;
    const roomsAvailable = form.getValues("rooms_available") || 0;
    const bedsPerRoom = form.getValues("beds_per_room") || 0;
    const bedsAvailable = form.getValues("beds_available") || 0;
    
    let occupancyText = "";
    
    if (category === "Hostel") {
      occupancyText = `${bedsAvailable}/${totalRooms * bedsPerRoom} beds`;
    } else if (category === "Homestel") {
      occupancyText = `${roomsAvailable}/${totalRooms} rooms`;
    } else {
      // Apartment
      occupancyText = `${form.getValues("max_occupants") || 0} max occupants`;
    }
    
    form.setValue("occupancy", occupancyText);
  };

  // Create a set of common amenities for easy selection
  const commonAmenities = [
    "WiFi", "Water", "Electricity", "Security", "Kitchen", "Study Area", 
    "Common Room", "TV Room", "Parking", "Generator", "Air Conditioning", 
    "Fan", "Washing Machine", "Refrigerator", "Microwave", "Gas Cooker"
  ];

  // Create a set of common utilities for easy selection
  const commonUtilities = [
    "Water", "Electricity", "Gas", "Internet", "Cable TV", "Cleaning Service"
  ];

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => {
          updateOccupancyDetails();
          onSubmit(data);
        })} className="space-y-6">
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

            {propertyCategory === "Hostel" && (
              <>
                <FormField
                  control={form.control}
                  name="total_rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 10" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                            updateOccupancyDetails();
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="beds_per_room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds Per Room</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 4" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                            updateOccupancyDetails();
                          }} 
                        />
                      </FormControl>
                      <FormDescription>How many beds in each room (1-4)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="beds_available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beds Available</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 5" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                            updateOccupancyDetails();
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {propertyCategory === "Homestel" && (
              <>
                <FormField
                  control={form.control}
                  name="total_rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 3" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                            updateOccupancyDetails();
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rooms_available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rooms Available</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 2" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                            updateOccupancyDetails();
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_occupants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupants Per Room</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 1" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                        />
                      </FormControl>
                      <FormDescription>Maximum number of occupants allowed per room</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {propertyCategory === "Apartment" && (
              <>
                <FormField
                  control={form.control}
                  name="max_occupants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Occupants</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 4" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                        />
                      </FormControl>
                      <FormDescription>Maximum number of occupants allowed in the apartment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allow_bill_sharing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Bill Sharing</FormLabel>
                        <FormDescription>
                          Allow multiple students to split the bill for this apartment
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}

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

            {propertyCategory !== "Hostel" && (
              <FormField
                control={form.control}
                name="advance_payment_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Payment (months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 12" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                      />
                    </FormControl>
                    <FormDescription>
                      How many months of advance payment required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 University Road" {...field} />
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
                      <FormLabel>Area/Suburb</FormLabel>
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
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landmark</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Near Ghana International School" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nearby landmark to help find the property
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
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Room Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="has_bedframes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Bed Frames Included</FormLabel>
                        <FormDescription>
                          Property comes with bed frames (no mattress)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_mattresses"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mattresses Included</FormLabel>
                        <FormDescription>
                          Property comes with mattresses
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_wardrobes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Wardrobes Included</FormLabel>
                        <FormDescription>
                          Property comes with wardrobes
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_individual_meters"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Individual Meters</FormLabel>
                        <FormDescription>
                          Each room has its own utility meters
                        </FormDescription>
                      </div>
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
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Utilities & Amenities</h3>
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="all_inclusive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>All-Inclusive</FormLabel>
                        <FormDescription>
                          All utilities are included in the price
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {!allInclusive && (
                  <FormField
                    control={form.control}
                    name="utilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utilities Included</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                          {commonUtilities.map((utility) => (
                            <div 
                              key={utility}
                              className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50"
                              onClick={() => {
                                const currentUtilities = field.value ? field.value.split('\n') : [];
                                if (currentUtilities.includes(utility)) {
                                  field.onChange(currentUtilities.filter(item => item !== utility).join('\n'));
                                } else {
                                  field.onChange([...currentUtilities, utility].join('\n'));
                                }
                              }}
                            >
                              <Checkbox
                                checked={field.value?.split('\n').includes(utility)}
                                id={`utility-${utility}`}
                              />
                              <label htmlFor={`utility-${utility}`} className="text-sm cursor-pointer">{utility}</label>
                            </div>
                          ))}
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g. Water, Electricity, Gas (one per line)" 
                            className="min-h-20" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter each utility included on a new line or use quick selections above
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                        {commonAmenities.map((amenity) => (
                          <div 
                            key={amenity}
                            className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-slate-50"
                            onClick={() => {
                              const currentAmenities = field.value ? field.value.split('\n') : [];
                              if (currentAmenities.includes(amenity)) {
                                field.onChange(currentAmenities.filter(item => item !== amenity).join('\n'));
                              } else {
                                field.onChange([...currentAmenities, amenity].join('\n'));
                              }
                            }}
                          >
                            <Checkbox
                              checked={field.value?.split('\n').includes(amenity)}
                              id={`amenity-${amenity}`}
                            />
                            <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">{amenity}</label>
                          </div>
                        ))}
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Wi-Fi, Air Conditioning, Kitchen, Security (one per line)" 
                          className="min-h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each amenity on a new line or use quick selections above
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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

            <div className="md:col-span-2">
              <Tabs defaultValue="upload" onValueChange={setMediaTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Images</TabsTrigger>
                  <TabsTrigger value="cover">Cover Photo</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Images</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                                {field.value && (
                                  <p className="mt-2 text-xs text-green-600">
                                    Image URL: {field.value}
                                  </p>
                                )}
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                              />
                            </label>
                          </div>
                          <Input 
                            type="text" 
                            placeholder={`Or enter image URL directly: ${IMAGE_URLS.DEFAULT}`}
                            {...field}
                            className="mt-2"
                          />
                        </FormControl>
                        <FormDescription>
                          Upload property images or provide image URLs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="cover" className="pt-4">
                  <FormItem>
                    <FormLabel>Cover Photo</FormLabel>
                    <FormDescription>
                      Select a landscape orientation photo to use as the main image for this property
                    </FormDescription>
                    {form.getValues("image_url") ? (
                      <div className="aspect-video w-full rounded-md border overflow-hidden">
                        <img 
                          src={form.getValues("image_url")} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = IMAGE_URLS.PLACEHOLDER;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-md border bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">No cover image selected</p>
                      </div>
                    )}
                  </FormItem>
                </TabsContent>
              </Tabs>
            </div>

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
              name="house_rules"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
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
