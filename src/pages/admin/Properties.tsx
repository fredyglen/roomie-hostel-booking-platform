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

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Property deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: (err: unknown) => {
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive'
      });
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
                      onClick={() => alert('Edit in Admin coming soon')}
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
    </AdminLayout>
  );
};

export default AdminProperties;
