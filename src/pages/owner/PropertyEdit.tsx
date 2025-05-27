
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyEditForm from '@/components/owner/PropertyEditForm';
import { useFormTransformation } from '@/hooks/forms/useFormTransformation';
import { Loader } from 'lucide-react';

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { transformDbToFormValues } = useFormTransformation();

  // Fetch property data
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id || !user?.id) throw new Error('Property ID or user ID missing');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user?.id,
  });

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Edit Property" showBackButton>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin text-[#9b87f5]" />
            <span className="text-gray-600">Loading property details...</span>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  if (error || !property) {
    return (
      <OwnerLayout pageTitle="Edit Property" showBackButton>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Property</h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Property not found or access denied'}
            </p>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  // Transform database data to form values
  const initialData = transformDbToFormValues(property);

  return (
    <OwnerLayout pageTitle="Edit Property" showBackButton backUrl="/owner/properties">
      <PropertyEditForm 
        propertyId={id!} 
        initialData={initialData} 
      />
    </OwnerLayout>
  );
};

export default PropertyEdit;
