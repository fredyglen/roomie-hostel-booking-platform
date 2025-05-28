
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import PropertyForm from '@/components/owner/property-form/PropertyForm';
import { useFormTransformation } from '@/hooks/forms/useFormTransformation';
import { navigateBack } from '@/utils/navigation';

interface PropertyEditFormProps {
  propertyId: string;
  initialData: Partial<PropertyFormValues>;
}

const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ propertyId, initialData }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { transformFormToDbFormat } = useFormTransformation();

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormValues) => {
      if (!propertyId) throw new Error('Property ID is required');
      if (!user?.id) throw new Error('User not authenticated');

      // Transform form data to database format
      const propertyData = transformFormToDbFormat(formData, user.id);

      // Only include fields that exist in the database schema
      const updateData = {
        title: propertyData.title,
        property_type: propertyData.property_type,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        rent: propertyData.rent,
        description: propertyData.description,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        amenities: propertyData.amenities,
        images: propertyData.images,
        is_available: propertyData.is_available,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId)
        .eq('owner_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Property Updated",
        description: "Your property has been updated successfully.",
      });
      navigate('/owner/properties');
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PropertyFormValues) => {
    updatePropertyMutation.mutate(data);
  };

  const handleCancel = () => {
    navigateBack(navigate, '/owner/properties');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Edit Property Details</h2>
          <p className="text-sm text-gray-500">Update your property information below</p>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Properties
        </button>
      </div>

      <PropertyForm 
        initialData={initialData}
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        isLoading={updatePropertyMutation.isPending}
      />
    </div>
  );
};

export default PropertyEditForm;
