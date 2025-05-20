
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Property, PropertyFormValues, supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import PropertyForm from '@/components/owner/PropertyForm';

interface PropertyEditFormProps {
  propertyId: string;
  initialData?: PropertyFormValues;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ propertyId, initialData }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormValues) => {
      if (!propertyId) throw new Error('Property ID is required');
      if (!user?.id) throw new Error('User not authenticated');

      // Convert string arrays to arrays for database
      const amenitiesArray = formData.amenities ? formData.amenities.split('\n').filter(Boolean) : [];
      const houseRulesArray = formData.house_rules ? formData.house_rules.split('\n').filter(Boolean) : [];
      const utilitiesArray = formData.utilities ? formData.utilities.split('\n').filter(Boolean) : [];

      const { error } = await supabase
        .from('properties')
        .update({
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
          description: formData.description,
          amenities: amenitiesArray,
          house_rules: houseRulesArray,
          images: formData.image_url ? [formData.image_url] : undefined,
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId)
        .eq('owner_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property has been updated successfully.",
      });
      navigate('/owner/properties');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PropertyFormValues) => {
    updatePropertyMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Edit Property Details</h2>
        <p className="text-sm text-gray-500">Update your property information below</p>
      </div>

      <PropertyForm 
        initialData={initialData}
        onSubmit={handleSubmit} 
        isLoading={updatePropertyMutation.isPending}
      />
    </div>
  );
};

export default PropertyEditForm;
