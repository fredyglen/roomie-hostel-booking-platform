
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyEditForm from '@/components/owner/PropertyEditForm';
import PropertyVerificationStatus from '@/components/owner/PropertyVerificationStatus';
import { useFormTransformation } from '@/hooks/forms/useFormTransformation';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyEdit: React.FC = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { transformDbToFormValues } = useFormTransformation();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('owner_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!propertyId && !!user?.id,
  });

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <LoadingIndicator />
      </OwnerLayout>
    );
  }

  if (error || !property) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="text-center py-8">
          <p className="text-red-600">Property not found or you don't have permission to edit it.</p>
        </div>
      </OwnerLayout>
    );
  }

  // Transform database data to form format
  const initialData = transformDbToFormValues(property);

  return (
    <OwnerLayout pageTitle="Edit Property">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="verification">Verification Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <PropertyEditForm 
            propertyId={propertyId!} 
            initialData={initialData}
          />
        </TabsContent>
        
        <TabsContent value="verification">
          <PropertyVerificationStatus propertyId={propertyId!} />
        </TabsContent>
      </Tabs>
    </OwnerLayout>
  );
};

export default PropertyEdit;
