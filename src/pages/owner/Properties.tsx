import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Property } from '@/lib/supabase';

interface Property {
  id: string;
  title: string;
  type: string;
  address: string;
  price: number;
  price_unit: string;
  status: string;
  occupancy: string;
  image_url: string;
  created_at: string;
  owner_id: string;
}

const Properties: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map DB properties to our Property type
      return (data || []).map(prop => ({
        ...prop,
        type: prop.property_type,
        price: prop.rent,
        price_unit: 'month', // Default to month if not specified
        status: prop.is_available ? 'Available' : 'Not Available',
        occupancy: '0/1', // Default occupancy
      })) as Property[];
    },
    enabled: !!user?.id,
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('owner_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', user?.id] });
      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteProperty = (propertyId: string) => {
    deletePropertyMutation.mutate(propertyId);
  };

  // Show mock data if no properties or still loading
  const propertyList = properties && properties.length > 0 ? properties : [
    {
      id: '1',
      title: 'Cozy Studio Apartment Near UPSA',
      type: 'Studio',
      address: '123 University Road, East Legon, Accra',
      price: 850,
      price_unit: 'month',
      status: 'Available',
      occupancy: '0/1',
      image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      owner_id: user?.id || '',
    },
    {
      id: '2',
      title: 'Shared 2-Bedroom Apartment',
      type: 'Shared',
      address: '456 College Avenue, Legon, Accra',
      price: 500,
      price_unit: 'month',
      status: 'Partially Occupied',
      occupancy: '1/2',
      image_url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      owner_id: user?.id || '',
    },
    {
      id: '3',
      title: 'Premium Single Room in Hostel',
      type: 'Hostel',
      address: '789 Campus Drive, Ayeduase, Kumasi',
      price: 950,
      price_unit: 'semester',
      status: 'Fully Occupied',
      occupancy: '5/5',
      image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      owner_id: user?.id || '',
    }
  ];

  return (
    <OwnerLayout pageTitle="My Properties">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Total Properties: {propertyList.length}</h2>
            <p className="text-sm text-gray-500">Manage your property listings</p>
          </div>
          <Link to="/owner/property/new">
            <Button><Plus className="mr-2 h-4 w-4" />Add New Property</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse" />
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-md text-red-800">
            <p>Error loading properties. Please try again.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {propertyList.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="h-48 relative">
                  <img 
                    src={property.image_url || (property.images && property.images[0])} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' : 
                      property.status === 'Partially Occupied' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold truncate">{property.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{property.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">${property.price || property.rent}</span>
                      <span className="text-sm text-gray-500">per {property.price_unit || 'month'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Type: {property.type || property.property_type}</span>
                      <span>Occupancy: {property.occupancy || '0/1'}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Link to={`/owner/property/${property.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this property and all associated data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteProperty(property.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default Properties;
