
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase, Property, PropertyFormValues } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyForm from '@/components/owner/PropertyForm';
import { Loader } from 'lucide-react';

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async (): Promise<Property> => {
      if (!id) throw new Error('Property ID is required');
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Property not found');

      // Convert database property to our frontend property format
      return {
        ...data,
        type: data.property_type,
        price: data.rent,
        price_unit: 'month', // Default to month
        status: data.is_available ? 'Available' : 'Not Available',
        occupancy: '0/1', // Default occupancy
        propertyCategory: (data.property_category as any) || 'Hostel',
        all_inclusive: data.all_inclusive || false,
      } as Property;
    },
    enabled: !!id && !!user?.id,
  });

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async (formData: PropertyFormValues) => {
      if (!id) throw new Error('Property ID is required');
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
          updated_at: new Date().toISOString(),
          // Keep existing values for other fields
        })
        .eq('id', id)
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

  // Prepare form initial data
  const initialData = property ? {
    ...property,
    propertyCategory: property.propertyCategory || 'Hostel',
    amenities: property.amenities?.join('\n') || '',
    house_rules: property.house_rules?.join('\n') || '',
    utilities: property.utilities?.join('\n') || '',
    all_inclusive: property.all_inclusive || false,
    bedrooms: property.bedrooms || 1,
    bathrooms: property.bathrooms || 1,
    city: property.city || 'Accra',
    state: property.state || 'Greater Accra',
    zip: property.zip || '00000',
    price_unit: property.price_unit || 'semester',
  } : undefined;

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </OwnerLayout>
    );
  }

  if (error || !property) {
    return (
      <OwnerLayout pageTitle="Edit Property">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : 'Failed to load property. Please try again.'}
          </p>
          <button 
            onClick={() => navigate('/owner/properties')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to Properties
          </button>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout pageTitle={`Edit Property: ${property.title}`}>
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
    </OwnerLayout>
  );
};

export default PropertyEdit;
