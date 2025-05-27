
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
  initialData?: PropertyFormValues;
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

      const { error } = await supabase
        .from('properties')
        .update({
          ...propertyData,
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
