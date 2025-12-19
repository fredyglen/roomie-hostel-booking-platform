import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency } from '@/utils/currency';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';

interface AdminPropertyDisplayData {
  id: string | number;
  title: string;
  location: string;
  ownerName: string;
  type: string;
  price: number;
  status: string;
  imageUrl?: string;
  // Additional fields for comprehensive editing
  description?: string;
  city?: string;
  property_type?: string;
  gender_type?: string;
  max_occupants?: number;
  verification_status?: string;
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyService } from '@/services/propertyService';

const AdminProperties: React.FC = () => {
  const { data: properties = [], isLoading, error, refetch } = useQuery<AdminPropertyDisplayData[]>({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`*`)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[Admin/Properties] query error', error);
        throw error;
      }
      console.debug('[Admin/Properties] fetched rows:', data?.length ?? 0);
      if (data && data.length > 0) {
        console.debug('[Admin/Properties] first row sample:', { id: data[0].id, verification_status: data[0].verification_status });
      }
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        location: p.address,
        city: p.city,
        ownerName: p.owner_id || '—',
        type: p.property_type || 'hostel',
        property_type: p.property_type,
        price: p.rent ?? p.price ?? 0,
        gender_type: p.gender_restriction,
        max_occupants: p.max_occupants,
        verification_status: p.verification_status,
        imageUrl: deriveCoverImageFromProperty(p),
        status: p.is_available ? (p.verification_status === 'verified' ? 'Live' : 'Pending Review') : 'Unavailable'
      }));
    }
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Edit modal state and form setup
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminPropertyDisplayData | null>(null);

  // Enhanced schema with comprehensive property fields
  const EditSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required').optional(),
    property_type: z.enum(['hostel', 'homestel', 'apartment'], {
      required_error: 'Property type is required',
    }),
    gender_type: z.enum(['male', 'female', 'mixed'], {
      required_error: 'Gender restriction is required',
    }),
    max_occupants: z.coerce.number().min(1, 'Must have at least 1 occupant').optional(),
    rent: z.coerce.number().min(0, 'Rent must be positive'),
    is_available: z.boolean().default(true),
    verification_status: z.enum(['pending', 'verified', 'rejected', 'suspended']).optional(),
  });

  const form = useForm<z.infer<typeof EditSchema>>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      property_type: 'hostel',
      gender_type: 'mixed',
      max_occupants: 1,
      rent: 0,
      is_available: true,
      verification_status: 'pending',
    },
  });

  React.useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title || '',
        description: editing.description || '',
        address: editing.location || '',
        city: editing.city || '',
        property_type: (editing.property_type as 'hostel' | 'homestel' | 'apartment') || 'hostel',
        gender_type: (editing.gender_type as 'male' | 'female' | 'mixed') || 'mixed',
        max_occupants: editing.max_occupants || 1,
        rent: Number(editing.price || 0),
        is_available: editing.status !== 'Unavailable',
        verification_status: (editing.verification_status as 'pending' | 'verified' | 'rejected' | 'suspended') || 'pending',
      });
    }
  }, [editing, form]);

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof EditSchema>) => {
      if (!editing) return;

      // Direct Supabase update with comprehensive fields
      const { error } = await supabase
        .from('properties')
        .update({
          title: values.title,
          description: values.description,
          address: values.address,
          city: values.city,
          property_type: values.property_type,
          gender_restriction: values.gender_type,
          max_occupants: values.max_occupants,
          rent: values.rent,
          is_available: values.is_available,
          verification_status: values.verification_status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editing.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Property Updated',
        description: 'Property information has been successfully updated.',
      });
      setEditOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: (err: unknown) => {
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'An error occurred while updating the property.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({ queryKey: ['admin-properties'] });
      const previous = queryClient.getQueryData<AdminPropertyDisplayData[]>(['admin-properties']);
      queryClient.setQueryData<AdminPropertyDisplayData[]>(['admin-properties'], (old) => (old || []).filter(p => p.id !== id));
      return { previous } as { previous?: AdminPropertyDisplayData[] };
    },
    onError: (err: unknown, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['admin-properties'], context.previous);
      }
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive'
      });
    },
    onSuccess: () => {
      toast({ title: 'Property deleted' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    }
  });


  if (isLoading) {
    return (
      <AdminLayout pageTitle="Properties Management">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-2 animate-pulse transition-all duration-500">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }
  if (error) {
    return (
      <AdminLayout pageTitle="Properties Management">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <ErrorDisplay
            title="Unable to load properties"
            error={error}
            onRetry={refetch}
          />
        </div>
      </AdminLayout>
    );
  }



  if (properties.length === 0) {
    return (
      <AdminLayout pageTitle="Properties Management">
        <div className="flex flex-col items-center justify-center py-12 transition-all duration-500">
          <img src="/empty-state.svg" alt="No properties" className="w-32 h-32 mb-4 opacity-80" />
          <p className="text-gray-500 text-lg mb-4">No properties found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Properties Management">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">All Properties</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="h-10 w-10 rounded object-cover bg-gray-100 flex-shrink-0"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0" />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-xs text-gray-500">{property.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.ownerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{formatCurrency(property.price || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-roomi-blue hover:text-roomi-blue-dark mr-3"
                      onClick={() => { setEditing(property); setEditOpen(true); }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (confirm('Delete this property? This cannot be undone.')) {
                          deleteMutation.mutate(property.id);
                        }
                      }}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Modern 2-Bedroom Hostel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe the property..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Street address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Accra" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Property Type and Gender Restriction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="property_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="homestel">Homestel</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender Restriction</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male Only</SelectItem>
                          <SelectItem value="female">Female Only</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Max Occupants and Rent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_occupants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Occupants</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={1} />
                      </FormControl>
                      <FormDescription>Maximum number of occupants</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent (GHS per semester)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={0} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Verification Status */}
              <FormField
                control={form.control}
                name="verification_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Property verification status</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability Toggle */}
              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available for Booking</FormLabel>
                      <FormDescription>
                        Toggle property availability for students
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={updateMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProperties;
