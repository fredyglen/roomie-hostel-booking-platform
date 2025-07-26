import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  address: string;
  property_type: string;
  verification_status: string;
  owner_id: string;
  created_at: string;
}

const QuickPropertyVerifier: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch all properties
  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address, property_type, verification_status, owner_id, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    }
  });

  // Verify property mutation
  const verifyPropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          verification_status: 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Property Verified",
        description: `${data.title} has been verified and is now visible to students.`,
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Reject property mutation
  const rejectPropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          verification_status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Property Rejected",
        description: `${data.title} has been rejected.`,
        variant: "destructive"
      });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading properties...</div>;
  }

  const pendingProperties = properties?.filter(p => p.verification_status === 'pending') || [];
  const verifiedProperties = properties?.filter(p => p.verification_status === 'verified') || [];
  const rejectedProperties = properties?.filter(p => p.verification_status === 'rejected') || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quick Property Verifier</h1>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            Pending: {pendingProperties.length}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Verified: {verifiedProperties.length}
          </span>
          <span className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            Rejected: {rejectedProperties.length}
          </span>
        </div>
      </div>

      {/* Pending Properties */}
      {pendingProperties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Verification ({pendingProperties.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{property.property_type}</Badge>
                      <Badge className={getStatusColor(property.verification_status)}>
                        {getStatusIcon(property.verification_status)}
                        {property.verification_status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => verifyPropertyMutation.mutate(property.id)}
                      disabled={verifyPropertyMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectPropertyMutation.mutate(property.id)}
                      disabled={rejectPropertyMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Properties Summary */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {properties?.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <span className="font-medium">{property.title}</span>
                  <span className="text-sm text-gray-600 ml-2">({property.property_type})</span>
                </div>
                <Badge className={getStatusColor(property.verification_status)}>
                  {getStatusIcon(property.verification_status)}
                  {property.verification_status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickPropertyVerifier;
