
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase, PropertyFormValues, PropertyInsert } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyForm from '@/components/owner/PropertyForm';

const PropertyNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormValues) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Convert string arrays to arrays for database
      const amenitiesArray = formData.amenities ? formData.amenities.split('\n').filter(Boolean) : [];
      const houseRulesArray = formData.house_rules ? formData.house_rules.split('\n').filter(Boolean) : [];
      const utilitiesArray = formData.utilities ? formData.utilities.split('\n').filter(Boolean) : [];

      // Map from form data to database schema
      const propertyData: PropertyInsert = {
        owner_id: user.id,
        title: formData.title,
        property_type: formData.type,
        property_category: formData.propertyCategory,
        rent: formData.price,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        available_from: new Date().toISOString().split('T')[0],
        description: formData.description,
        amenities: amenitiesArray,
        house_rules: houseRulesArray,
        images: formData.image_url ? [formData.image_url] : [],
        is_available: formData.status === 'Available',
        distance_to_campus: formData.distance_to_campus,
        all_inclusive: formData.all_inclusive,
        utilities: utilitiesArray,
        location: formData.location,
        landmark: formData.landmark,
        total_rooms: formData.total_rooms,
        rooms_available: formData.rooms_available,
        beds_per_room: formData.beds_per_room,
        beds_available: formData.beds_available,
        max_occupants: formData.max_occupants,
        has_bedframes: formData.has_bedframes,
        has_mattresses: formData.has_mattresses,
        has_wardrobes: formData.has_wardrobes,
        has_individual_meters: formData.has_individual_meters,
        advance_payment_months: formData.advance_payment_months,
        allow_bill_sharing: formData.allow_bill_sharing,
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
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

  return (
    <OwnerLayout pageTitle="Add New Property">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Enter Property Details</h2>
          <p className="text-sm text-gray-500">Fill out the form below to add a new property listing</p>
        </div>

        <PropertyForm 
          onSubmit={handleSubmit} 
          isLoading={createPropertyMutation.isPending}
        />
      </div>
    </OwnerLayout>
  );
};

export default PropertyNew;
