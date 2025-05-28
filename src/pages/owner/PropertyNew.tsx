
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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
