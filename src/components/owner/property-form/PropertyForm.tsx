
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PropertyCategory } from '@/types/property';

// Import subcomponents
import { propertyFormSchema, PropertyFormValues } from './PropertyFormSchema';
import HostelFields from './HostelFields';
import HomestelFields from './HomestelFields';
import ApartmentFields from './ApartmentFields';
import LocationFields from './LocationFields';
import RoomFeaturesFields from './RoomFeaturesFields';
import AmenitiesFields from './AmenitiesFields';
import PropertyImageUpload from './PropertyImageUpload';
import DescriptionFields from './DescriptionFields';
import PricingFields from './PricingFields';
import PropertyTypeFields from './PropertyTypeFields';

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
  const propertyCategory = form.watch("propertyCategory") as PropertyCategory;
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

            {/* Property Type Fields */}
            <PropertyTypeFields 
              form={form} 
              propertyCategory={propertyCategory} 
            />

            {/* Conditional fields based on property category */}
            {propertyCategory === "Hostel" && (
              <HostelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />
            )}

            {propertyCategory === "Homestel" && (
              <HomestelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />
            )}

            {propertyCategory === "Apartment" && (
              <ApartmentFields form={form} />
            )}

            {/* Pricing Fields */}
            <PricingFields form={form} propertyCategory={propertyCategory} />

            {/* Location Fields */}
            <LocationFields form={form} />

            {/* Room Feature Fields */}
            <RoomFeaturesFields form={form} />
            
            {/* Amenities Fields */}
            <AmenitiesFields form={form} />

            {/* Image Upload */}
            <PropertyImageUpload
              form={form}
              mediaTab={mediaTab}
              setMediaTab={setMediaTab}
            />

            {/* Description Fields */}
            <DescriptionFields form={form} />
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
