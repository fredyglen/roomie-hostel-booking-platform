
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

      // Map from form data to database schema
      const propertyData: PropertyInsert = {
        owner_id: user.id,
        title: formData.title,
        property_type: formData.type,
        rent: formData.price,
        address: formData.address,
        city: 'Accra', // Default city - should be in form
        state: 'Greater Accra', // Default state - should be in form
        zip: '00000', // Default zip - should be in form
        bedrooms: 1, // Default - should be in form
        bathrooms: 1, // Default - should be in form
        available_from: new Date().toISOString().split('T')[0],
        description: formData.description,
        amenities: amenitiesArray,
        images: formData.image_url ? [formData.image_url] : [],
        is_available: formData.status === 'Available',
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
