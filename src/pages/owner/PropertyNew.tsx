
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import PropertyForm from '@/components/owner/property-form/PropertyForm';
import { useFormTransformation } from '@/hooks/forms/useFormTransformation';
import { navigateBack } from '@/utils/navigation';

const PropertyNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { transformFormToDbFormat } = useFormTransformation();

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormValues) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Transform form data to database format
      const propertyData = transformFormToDbFormat(formData, user.id);

      // Only include fields that exist in the database schema
      const insertData = {
        owner_id: propertyData.owner_id,
        title: propertyData.title,
        property_type: propertyData.property_type,
        property_category: propertyData.property_category,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        rent: propertyData.rent,
        description: propertyData.description,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        available_from: propertyData.available_from,
        amenities: propertyData.amenities,
        images: propertyData.images,
        is_available: propertyData.is_available,
        
        // Enhanced features that now exist in the database
        total_rooms: propertyData.total_rooms,
        rooms_available: propertyData.rooms_available,
        beds_per_room: propertyData.beds_per_room,
        beds_available: propertyData.beds_available,
        max_occupants: propertyData.max_occupants,
        has_bedframes: propertyData.has_bedframes,
        has_mattresses: propertyData.has_mattresses,
        has_wardrobes: propertyData.has_wardrobes,
        has_fan: propertyData.has_fan,
        has_tiled_room: propertyData.has_tiled_room,
        has_individual_meters: propertyData.has_individual_meters,
        washroom_type: propertyData.washroom_type,
        shared_washroom_count: propertyData.shared_washroom_count,
        meter_type: propertyData.meter_type,
        shared_meter_count: propertyData.shared_meter_count,
        advance_payment_months: propertyData.advance_payment_months,
        allow_bill_sharing: propertyData.allow_bill_sharing,
        verification_status: propertyData.verification_status,
        emergency_contact_name: propertyData.emergency_contact_name,
        emergency_contact_phone: propertyData.emergency_contact_phone,
        has_accessibility_features: propertyData.has_accessibility_features,
        pet_policy: propertyData.pet_policy,
        parking_available: propertyData.parking_available,
        parking_cost: propertyData.parking_cost,
        security_features: propertyData.security_features,
        internet_speed: propertyData.internet_speed,
        gender_restriction: propertyData.gender_restriction,
        semester_availability: propertyData.semester_availability,
        cancellation_policy: propertyData.cancellation_policy,
        virtual_tour_url: propertyData.virtual_tour_url,
        
        created_at: propertyData.created_at,
        updated_at: propertyData.updated_at,
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(insertData)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property has been created successfully.",
      });
      navigate('/owner/properties');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PropertyFormValues) => {
    createPropertyMutation.mutate(data);
  };

  const handleCancel = () => {
    navigateBack(navigate, '/owner/properties');
  };

  return (
    <OwnerLayout pageTitle="Add New Property">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Enter Property Details</h2>
            <p className="text-sm text-gray-500">Fill out the form below to add a new property listing</p>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Properties
          </button>
        </div>

        <PropertyForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isLoading={createPropertyMutation.isPending}
          isEdit={false}
        />
      </div>
    </OwnerLayout>
  );
};

export default PropertyNew;
