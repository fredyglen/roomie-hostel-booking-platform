
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Search, Filter, Building } from 'lucide-react';

const AdminOwnerSettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: ownerSettings, isLoading } = useQuery({
    queryKey: ['admin-owner-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owner_settings')
        .select(`
          *,
          profiles:owner_id (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredSettings = ownerSettings?.filter(setting => {
    const ownerName = `${setting.profiles?.first_name || ''} ${setting.profiles?.last_name || ''}`.toLowerCase();
    const businessName = setting.business_name?.toLowerCase() || '';
    const email = setting.profiles?.email?.toLowerCase() || '';
    
    return ownerName.includes(searchTerm.toLowerCase()) ||
           businessName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Owner Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Owner Settings">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Owner Settings</h1>
            <p className="text-gray-600">Manage and review property owner settings</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {ownerSettings?.length || 0} Owners
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredSettings?.map((setting) => (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">
                        {setting.business_name || `${setting.profiles?.first_name || ''} ${setting.profiles?.last_name || ''}`}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{setting.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={setting.notifications_enabled ? 'default' : 'secondary'}>
                      {setting.notifications_enabled ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Contact Info</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Phone:</span> {setting.business_phone || 'Not set'}</p>
                      <p><span className="text-gray-500">Email:</span> {setting.business_email || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Booking Settings</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Auto-accept:</span> {setting.auto_accept_bookings ? 'Yes' : 'No'}</p>
                      <p><span className="text-gray-500">Min stay:</span> {setting.minimum_stay_days} days</p>
                      <p><span className="text-gray-500">Advance notice:</span> {setting.booking_advance_notice}h</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Payment Settings</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Security deposit:</span> ₵{setting.security_deposit_amount}</p>
                      <p><span className="text-gray-500">Preferred method:</span> {setting.preferred_payment_method}</p>
                      <p><span className="text-gray-500">Utilities included:</span> {setting.utilities_included ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {(setting.terms_and_conditions || setting.refund_policy || setting.cancellation_policy) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Policies</h4>
                    <div className="flex space-x-2">
                      {setting.terms_and_conditions && (
                        <Badge variant="outline" className="text-xs">Terms & Conditions</Badge>
                      )}
                      {setting.refund_policy && (
                        <Badge variant="outline" className="text-xs">Refund Policy</Badge>
                      )}
                      {setting.cancellation_policy && (
                        <Badge variant="outline" className="text-xs">Cancellation Policy</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSettings?.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No owner settings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No owners have configured their settings yet.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOwnerSettings;
