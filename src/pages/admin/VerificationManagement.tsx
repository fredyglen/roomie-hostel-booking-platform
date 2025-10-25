
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, FileText, Search } from 'lucide-react';

const VerificationManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: verifications, isLoading, isError, error } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_verifications')
        .select(`
          id, status, verification_type, priority_level, verification_deadline, resubmission_count, notes, admin_notes, rejection_reason, created_at,
          properties!inner (
            id,
            title,
            property_category,
            owner_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
      rejectionReason
    }: {
      id: string;
      status: string;
      adminNotes?: string;
      rejectionReason?: string;
    }) => {
      const { data, error } = await supabase
        .from('property_verifications')
        .update({
          status,
          admin_notes: adminNotes,
          rejection_reason: rejectionReason,
          verification_date: status === 'verified' ? new Date().toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Verification Updated',
        description: 'The verification status has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: `Failed to update verification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const getStatusIcon = (status: string) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredVerifications = verifications?.filter((verification: any) => {
    const statusVal = String(verification.status || '').toLowerCase();
    const matchesStatus = selectedStatus === 'all' || statusVal === selectedStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      q === '' ||
      String(verification.properties?.title || '').toLowerCase().includes(q) ||
      String(verification.properties?.owner_id || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = verifications?.filter(v => String(v.status || '').toLowerCase() === 'pending').length || 0;
  const verifiedCount = verifications?.filter(v => String(v.status || '').toLowerCase() === 'verified').length || 0;
  const rejectedCount = verifications?.filter(v => String(v.status || '').toLowerCase() === 'rejected').length || 0;

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Verification Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout pageTitle="Verification Management">
        <div className="mx-4 mt-4 p-4 border border-red-200 bg-red-50 text-sm text-red-700 rounded">
          {error instanceof Error ? error.message : 'Failed to load verifications'}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Verification Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Property Verification</h1>
            <p className="text-gray-600">Review and manage property verification requests</p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="px-3 py-1">
              {pendingCount} Pending
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {verifiedCount} Verified
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              {rejectedCount} Rejected
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredVerifications?.map((verification) => (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(verification.status)}
                    <div>
                      <CardTitle className="text-lg">
                        {verification.properties?.title || 'Property Title'}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Owner: {verification.properties?.owner_id || 'Unknown'} •
                        {verification.properties?.property_category || 'Unknown'} •
                        {verification.verification_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(verification.status)}
                    <Badge variant="outline" className="text-xs">
                      {new Date(verification.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Verification Info</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Type:</span> {verification.verification_type}</p>
                          <p><span className="text-gray-500">Priority:</span> {verification.priority_level}</p>
                          <p><span className="text-gray-500">Deadline:</span> {verification.verification_deadline || 'Not set'}</p>
                          <p><span className="text-gray-500">Resubmissions:</span> {verification.resubmission_count || 0}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Property Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Category:</span> {verification.properties?.property_category}</p>
                          <p><span className="text-gray-500">Owner ID:</span> {verification.properties?.owner_id}</p>
                        </div>
                      </div>
                    </div>

                    {verification.notes && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Owner Notes</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{verification.notes}</p>
                      </div>
                    )}

                    {verification.admin_notes && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Admin Notes</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{verification.admin_notes}</p>
                      </div>
                    )}

                    {verification.rejection_reason && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Rejection Reason</h4>
                        <p className="text-sm bg-red-50 p-3 rounded">{verification.rejection_reason}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Required Documents</h4>
                      {verification.verification_requirements && verification.verification_requirements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {verification.verification_requirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No specific requirements listed</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Uploaded Documents</h4>
                      {verification.documents && verification.documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {verification.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">{doc}</span>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No documents uploaded yet</p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    {String(verification.status || '').toLowerCase() === 'pending' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes
                          </label>
                          <Textarea 
                            id={`admin-notes-${verification.id}`}
                            placeholder="Add notes about the verification..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason (if rejecting)
                          </label>
                          <Textarea 
                            id={`rejection-reason-${verification.id}`}
                            placeholder="Explain why the verification is being rejected..."
                            className="min-h-[60px]"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            onClick={() => {
                              const adminNotes = (document.getElementById(`admin-notes-${verification.id}`) as HTMLTextAreaElement)?.value;
                              updateVerificationMutation.mutate({
                                id: verification.id,
                                status: 'verified',
                                adminNotes,
                              });
                            }}
                            disabled={updateVerificationMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              const adminNotes = (document.getElementById(`admin-notes-${verification.id}`) as HTMLTextAreaElement)?.value;
                              const rejectionReason = (document.getElementById(`rejection-reason-${verification.id}`) as HTMLTextAreaElement)?.value;
                              updateVerificationMutation.mutate({
                                id: verification.id,
                                status: 'rejected',
                                adminNotes,
                                rejectionReason,
                              });
                            }}
                            disabled={updateVerificationMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {String(verification.status || '').toLowerCase() !== 'pending' && (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500">
                          This verification has been {verification.status}.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVerifications?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No verification requests have been submitted yet.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VerificationManagement;
