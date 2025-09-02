import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import PropertyFormSimple, { SimplePropertyFormValues } from '@/components/owner/property-form/PropertyFormSimple';
import { supabase } from '@/integrations/supabase/client';
import { navigateBack } from '@/utils/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

const PropertyNewSimple: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Simple property creation mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (data: SimplePropertyFormValues) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Transform form data to match BASIC database schema (supabase-setup.sql)
      const propertyData = {
        owner_id: user.id,
        title: data.title,
        type: data.property_type, // Basic schema uses 'type' not 'property_type'
        address: data.address,
        price: data.base_price_per_semester, // Basic schema uses 'price' not 'base_price_per_semester'
        price_unit: 'semester',
        status: 'Available', // Basic schema uses 'Available' not 'available'
        description: data.description,
        amenities: data.amenities,
        house_rules: data.house_rules,
        image_url: data.cover_image_url || null,
        distance_to_campus: data.distance_to_campus || null,
        occupancy: `${data.max_occupancy} beds`, // Basic schema format

        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Property creation error:', error);
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: (result) => {
      toast({
        title: "Property Created Successfully!",
        description: `${result.title} has been added to your properties.`,
      });
      navigate('/owner/properties');
    },
    onError: (error) => {
      console.error('Property creation failed:', error);
      toast({
        title: "Property Creation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: SimplePropertyFormValues) => {
    // Fix React Suspense error by wrapping async operations in startTransition
    startTransition(() => {
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a property.",
          variant: "destructive",
        });
        return;
      }

      createPropertyMutation.mutate(data);
    });
  };

  const handleCancel = () => {
    navigateBack(navigate, '/owner/properties');
  };

  return (
    <OwnerLayout pageTitle="Add New Property">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success/Error Status */}
        {createPropertyMutation.isSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Property Created Successfully!
                <Badge variant="default">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700">
                Your property is now live and visible to students on the platform.
              </p>
            </CardContent>
          </Card>
        )}

        {createPropertyMutation.isError && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                Property Creation Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                {createPropertyMutation.error instanceof Error 
                  ? createPropertyMutation.error.message 
                  : 'An unknown error occurred'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Simple Property Form */}
        <PropertyFormSimple
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createPropertyMutation.isPending}
        />

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-2">
            <p>• <strong>Title:</strong> Use a descriptive name like "Sunrise Hostel - UPSA Campus"</p>
            <p>• <strong>Price:</strong> Enter the full semester price (4 months) in Ghana Cedis</p>
            <p>• <strong>Gender:</strong> Choose based on your target students</p>
            <p>• <strong>Capacity:</strong> Total number of beds/students you can accommodate</p>
            <p>• <strong>Description:</strong> Highlight what makes your property special</p>
          </CardContent>
        </Card>

        {/* ROOMi Platform Info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">🏠 About ROOMi Platform</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>ROOMi connects property owners with university students looking for semester housing.</p>
            <p><strong>What happens next?</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your property will be reviewed by our admin team (24-48 hours)</li>
              <li>Once approved, it appears on the student portal</li>
              <li>Students can view, favorite, and book your property</li>
              <li>You'll receive booking notifications and manage tenants</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default PropertyNewSimple;
