
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Upload, Eye } from 'lucide-react';

interface PropertyVerificationStatusProps {
  propertyId: string;
}

const PropertyVerificationStatus: React.FC<PropertyVerificationStatusProps> = ({ propertyId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: verifications, isLoading } = useQuery({
    queryKey: ['property-verifications', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_verifications')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!propertyId && !!user?.id,
  });

  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('verification_status, title')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!propertyId,
  });

  const requestVerificationMutation = useMutation({
    mutationFn: async (verificationType: string) => {
      const { data, error } = await supabase
        .from('property_verifications')
        .insert({
          property_id: propertyId,
          verification_type: verificationType,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Verification Requested',
        description: 'Your verification request has been submitted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['property-verifications', propertyId] });
    },
    onError: (error) => {
      toast({
        title: 'Request Failed',
        description: `Failed to request verification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading verification status...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Property Verification</span>
            {property && getStatusBadge(property.verification_status || 'pending')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Overall Status</h3>
              <p className="text-sm text-gray-600">
                {property?.verification_status === 'verified' 
                  ? 'Your property is verified and trusted by students.'
                  : property?.verification_status === 'rejected'
                  ? 'Verification was rejected. Please address the issues and resubmit.'
                  : 'Verification is pending review.'}
              </p>
            </div>
            {property?.verification_status !== 'verified' && (
              <Button
                onClick={() => requestVerificationMutation.mutate('basic')}
                disabled={requestVerificationMutation.isPending}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Request Verification
              </Button>
            )}
          </div>

          {verifications && verifications.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Verification History</h4>
              {verifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(verification.status)}
                    <div>
                      <p className="font-medium capitalize">{verification.verification_type} Verification</p>
                      <p className="text-sm text-gray-600">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(verification.status)}
                    {verification.notes && (
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">Benefits of Verification</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Increased trust and bookings from students</li>
              <li>• Higher visibility in search results</li>
              <li>• Verified badge on your property listings</li>
              <li>• Access to premium features</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyVerificationStatus;
