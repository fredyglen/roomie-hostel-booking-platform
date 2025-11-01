import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency } from '@/utils/currency';

interface AdminPropertyDisplayData {
  id: string | number;
  title: string;
  location: string;
  ownerName: string;
  type: string;
  price: number;
  status: string; // Or more specific union type if known
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
        .select(`
          id,
          title,
          address,
          property_type,
          rent,
          is_available,
          verification_status,
          owner_id
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        location: p.address,
        ownerName: p.owner_id || '—',
        type: p.property_type || 'hostel',
        price: p.rent ?? 0,
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

  const EditSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    location: z.string().optional().default(''),
    price: z.coerce.number().min(0).default(0),
    is_available: z.boolean().default(true),
  });

  const form = useForm<z.infer<typeof EditSchema>>({
    resolver: zodResolver(EditSchema),
    defaultValues: { title: '', location: '', price: 0, is_available: true },
  });

  React.useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title || '',
        location: editing.location || '',
        price: Number(editing.price || 0),
        is_available: editing.status !== 'Unavailable',
      });
    }
  }, [editing]);

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof EditSchema>) => {
      if (!editing) return;
      await propertyService.updateProperty(String(editing.id), {
        title: values.title,
        address: values.location,
        rent: values.price,
        is_available: values.is_available,
      } as any);
    },
    onSuccess: () => {
      toast({ title: 'Property updated' });
      setEditOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: (err: unknown) => {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Unknown error',
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
                      <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200"></div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per semester</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  Save
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
