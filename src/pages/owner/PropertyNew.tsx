
import React, { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from "@/components/ui/use-toast";
import OwnerLayout from '@/components/layout/OwnerLayout';
import { PropertyFormValues } from '@/components/owner/property-form/PropertyFormSchema';
import PropertyForm from '@/components/owner/property-form/PropertyForm';
import { usePropertyCreation, usePropertyPipelineStatus } from '@/hooks/property/usePropertyCreation';
import { navigateBack } from '@/utils/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const PropertyNew: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Use enhanced property creation with pipeline
  const { createProperty, isCreating, result } = usePropertyCreation({
    onSuccess: (pipelineResult) => {
      if (pipelineResult.success) {
        navigate('/owner/properties');
      }
    },
    onError: (error) => {
      console.error('Property creation failed:', error);
    },
    enablePipeline: true // Use full pipeline for reliability
  });

  const { getStatus } = usePropertyPipelineStatus();
  const pipelineStatus = getStatus(result);

  const handleSubmit = (data: PropertyFormValues) => {
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

      createProperty({ formData: data, ownerId: user.id });
    });
  };

  const handleCancel = () => {
    navigateBack(navigate, '/owner/properties');
  };

  return (
    <OwnerLayout pageTitle="Add New Property">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Enter Property Details</h2>
            <p className="text-sm text-gray-500">Fill out the form below to add a new property listing</p>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Properties
          </button>
        </div>

        {/* Pipeline Status Display */}
        {result && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {pipelineStatus.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : pipelineStatus.status === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600" />
                )}
                Property Creation Pipeline
                <Badge variant={pipelineStatus.status === 'success' ? 'default' : 'secondary'}>
                  {pipelineStatus.completedSteps}/{pipelineStatus.totalSteps} Steps
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{pipelineStatus.message}</p>
              {result.success && (
                <div className="mt-2 text-xs text-blue-600">
                  ✅ Submitted for review. You’ll get an email and in‑app notification within 24–48 hours once approved.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating}
          isEdit={false}
        />
      </div>
    </OwnerLayout>
  );
};

export default PropertyNew;
