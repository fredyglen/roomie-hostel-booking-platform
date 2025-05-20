
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyForm, { PropertyFormValues } from '@/components/owner/PropertyForm';

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

      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            owner_id: user.id,
            title: formData.title,
            type: formData.type,
            price: formData.price,
            price_unit: formData.price_unit,
            address: formData.address,
            distance_to_campus: formData.distance_to_campus,
            description: formData.description,
            amenities: amenitiesArray,
            house_rules: houseRulesArray,
            status: formData.status,
            occupancy: formData.occupancy,
            image_url: formData.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
            created_at: new Date().toISOString(),
          }
        ])
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
