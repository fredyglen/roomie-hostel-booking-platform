
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PropertyCategory } from '@/types/property';
import { useAuth } from '@/context/AuthContext';

// Import subcomponents
import { propertyFormSchema, PropertyFormValues } from './PropertyFormSchema';
import HostelFields from './HostelFields';
import HomestelFields from './HomestelFields';
import ApartmentFields from './ApartmentFields';
import LocationFields from './LocationFields';
import RoomFeaturesFields from './RoomFeaturesFields';
import MediaUploadTabs from './MediaUploadTabs';
import AmenitiesSelector from './AmenitiesSelector';
import FormSubmissionModal from './FormSubmissionModal';
import DescriptionFields from './DescriptionFields';
import PricingFields from './PricingFields';
import PropertyTypeFields from './PropertyTypeFields';
import PropertyDetailsFields from './PropertyDetailsFields';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormValues>;
  onSubmit: (data: PropertyFormValues) => void;
  onCancel?: () => void;
  isLoading: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const { user } = useAuth();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<PropertyFormValues | null>(null);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      propertyCategory: initialData?.propertyCategory || "Hostel",
      type: initialData?.type || "",
      address: initialData?.address || "",
      city: initialData?.city || "Accra",
      region: initialData?.region || "Greater Accra",
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
      occupancy_type: initialData?.occupancy_type,
      occupancy_available: initialData?.occupancy_available || 0,
      occupancy_total: initialData?.occupancy_total || 0,
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
      has_fan: initialData?.has_fan || false,
      has_tiled_room: initialData?.has_tiled_room || false,
      washroom_type: initialData?.washroom_type,
      shared_washroom_count: initialData?.shared_washroom_count,
      meter_type: initialData?.meter_type,
      shared_meter_count: initialData?.shared_meter_count,
      has_individual_meters: initialData?.has_individual_meters || false,
      advance_payment_months: initialData?.advance_payment_months || 12,
      allow_bill_sharing: initialData?.allow_bill_sharing || false,
    },
  });

  const propertyCategory = form.watch("propertyCategory") as PropertyCategory;
  
  // Set default price unit based on property category
  useEffect(() => {
    if (propertyCategory === "Hostel") {
      form.setValue("price_unit", "semester");
    }
  }, [propertyCategory, form]);
  
  // Feature access control
  const hasFeatureAccess = (feature: string): boolean => {
    const premiumFeatures = ['virtual_tours', 'priority_listing', 'analytics', 'multiple_images'];
    return user?.role === 'owner';
  };

  // Calculate occupancy details based on property type
  const updateOccupancyDetails = () => {
    const category = form.getValues("propertyCategory");
    const totalRooms = form.getValues("total_rooms") || 0;
    const roomsAvailable = form.getValues("rooms_available") || 0;
    const bedsPerRoom = form.getValues("beds_per_room") || 0;
    const bedsAvailable = form.getValues("beds_available") || 0;
    
    if (category === "Hostel") {
      form.setValue("occupancy_type", "beds");
      form.setValue("occupancy_available", bedsAvailable);
      form.setValue("occupancy_total", totalRooms * bedsPerRoom);
    } else if (category === "Homestel") {
      form.setValue("occupancy_type", "rooms");
      form.setValue("occupancy_available", roomsAvailable);
      form.setValue("occupancy_total", totalRooms);
    } else {
      // Apartment
      form.setValue("occupancy_type", "units");
      form.setValue("occupancy_available", 1);
      form.setValue("occupancy_total", 1);
    }
  };

  const handleFormSubmit = (data: PropertyFormValues) => {
    setPendingFormData(data);
    setShowSubmissionModal(true);
  };

  const handleConfirmSubmission = () => {
    if (pendingFormData) {
      onSubmit(pendingFormData);
      setShowSubmissionModal(false);
      setPendingFormData(null);
    }
  };

  const handleCancelSubmission = () => {
    setShowSubmissionModal(false);
    setPendingFormData(null);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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

              {/* Property Details Section */}
              <PropertyDetailsFields 
                form={form} 
                propertyCategory={propertyCategory} 
              />

              {/* Conditional fields based on property category */}
              {propertyCategory === "Hostel" && (
                <HostelFields 
                  form={form} 
                  updateOccupancyDetails={updateOccupancyDetails}
                />
              )}

              {propertyCategory === "Homestel" && (
                <HomestelFields 
                  form={form} 
                  updateOccupancyDetails={updateOccupancyDetails}
                />
              )}

              {propertyCategory === "Apartment" && (
                <ApartmentFields form={form} />
              )}

              {/* Pricing Fields */}
              <PricingFields form={form} propertyCategory={propertyCategory} />

              {/* Location Fields */}
              <LocationFields form={form} />

              {/* Room Feature Fields */}
              <RoomFeaturesFields form={form} hasFeatureAccess={hasFeatureAccess} />
              
              {/* Enhanced Amenities Fields */}
              <AmenitiesSelector form={form} />

              {/* Enhanced Media Upload */}
              <MediaUploadTabs form={form} />

              {/* Description Fields */}
              <DescriptionFields form={form} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {initialData?.title ? "Update Property" : "Add Property"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <FormSubmissionModal
        isOpen={showSubmissionModal}
        onClose={handleCancelSubmission}
        onConfirm={handleConfirmSubmission}
        formData={pendingFormData}
        isEdit={!!initialData?.title}
        isLoading={isLoading}
      />
    </>
  );
};

export default PropertyForm;
