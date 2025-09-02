import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, AlertTriangle, Eye, Send, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PropertySubmissionWorkflowProps {
  form: UseFormReturn<PropertyFormValues>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * BE CONSCIOUS: Property Submission Workflow Component
 * 
 * Implements Owner→Admin→Student data flow:
 * 1. Owner submits property for review
 * 2. Admin reviews and approves/rejects
 * 3. Approved properties appear on student portal
 * 4. Real-time status updates across portals
 */
const PropertySubmissionWorkflow: React.FC<PropertySubmissionWorkflowProps> = ({
  form,
  onSubmit,
  isSubmitting
}) => {
  const formData = form.getValues();

  // BE CONSCIOUS: Validation checks for submission readiness
  const getSubmissionChecks = () => {
    const checks = [
      {
        id: 'basic-info',
        label: 'Basic Information',
        completed: !!(formData.name && formData.address && formData.description),
        required: true
      },
      {
        id: 'room-config',
        label: 'Room Configuration',
        completed: !!(formData.bedrooms && formData.bathrooms && formData.room_types?.length),
        required: true
      },
      {
        id: 'pricing',
        label: 'Pricing Information',
        completed: !!(formData.booking_duration && formData.price > 0),
        required: true
      },
      {
        id: 'washroom-config',
        label: 'Washroom Configuration',
        completed: !!(formData.washroom_location && formData.washroom_sharing),
        required: true
      },
      {
        id: 'amenities',
        label: 'Amenities & Features',
        completed: !!(formData.amenities && formData.amenities.length >= 3),
        required: false
      },
      {
        id: 'media',
        label: 'Property Images',
        completed: !!(formData.images && formData.images.length > 0),
        required: false
      }
    ];

    return checks;
  };

  const submissionChecks = getSubmissionChecks();
  const requiredChecks = submissionChecks.filter(check => check.required);
  const optionalChecks = submissionChecks.filter(check => !check.required);
  const allRequiredCompleted = requiredChecks.every(check => check.completed);
  const completionPercentage = Math.round(
    (submissionChecks.filter(check => check.completed).length / submissionChecks.length) * 100
  );

  // BE CONSCIOUS: Submission workflow stages
  const getWorkflowStages = () => [
    {
      id: 'draft',
      label: 'Draft',
      description: 'Property being created',
      icon: <Clock className="h-4 w-4" />,
      status: 'current'
    },
    {
      id: 'submitted',
      label: 'Submitted for Review',
      description: 'Awaiting admin approval',
      icon: <Send className="h-4 w-4" />,
      status: 'pending'
    },
    {
      id: 'under-review',
      label: 'Under Review',
      description: 'Admin reviewing property',
      icon: <Eye className="h-4 w-4" />,
      status: 'pending'
    },
    {
      id: 'approved',
      label: 'Approved & Live',
      description: 'Visible to students',
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Submission Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Submission Readiness
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complete required sections to submit for admin review</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Required Checks */}
          <div>
            <h5 className="font-medium text-sm mb-2">Required Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {requiredChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-2">
                  {check.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                  <span className={`text-sm ${check.completed ? 'text-green-700' : 'text-orange-700'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Checks */}
          <div>
            <h5 className="font-medium text-sm mb-2">Optional (Recommended)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {optionalChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-2">
                  {check.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${check.completed ? 'text-green-700' : 'text-gray-600'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stages */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getWorkflowStages().map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  stage.status === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <h5 className={`font-medium ${
                    stage.status === 'current' ? 'text-blue-900' : 'text-gray-600'
                  }`}>
                    {stage.label}
                  </h5>
                  <p className="text-sm text-gray-500">{stage.description}</p>
                </div>
                {stage.status === 'current' && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Actions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Submit Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!allRequiredCompleted && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required sections before submitting for review.
              </AlertDescription>
            </Alert>
          )}

          {allRequiredCompleted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your property is ready for submission! Once submitted, our admin team will review 
                your property within 24-48 hours.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.handleSubmit(() => {})()}
            >
              💾 Save Draft
            </Button>
            
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!allRequiredCompleted || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </>
              )}
            </Button>
          </div>

          {/* Post-submission info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>After submission:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Admin team will review your property within 24-48 hours</li>
              <li>You'll receive email notifications about status updates</li>
              <li>Once approved, your property will be visible to students</li>
              <li>You can track the review status in your dashboard</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertySubmissionWorkflow;
