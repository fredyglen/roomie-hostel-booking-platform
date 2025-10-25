import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import type { PropertyFormValues } from './PropertyFormSchema';
import PropertySubmissionWorkflow from './PropertySubmissionWorkflow';

interface FormSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: PropertyFormValues;
  isLoading?: boolean;
  isEdit?: boolean;
}

/**
 * Apple‑grade preview + confirmation modal used by PropertyForm
 * - No business logic, purely presentational
 * - Shows a concise preview of critical fields and the submission workflow
 */
const FormSubmissionModal: React.FC<FormSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isLoading = false,
  isEdit = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Confirm Update' : 'Preview & Submit'}</DialogTitle>
          <DialogDescription>
            Review the details below. You can go back to make changes or continue to submit.
          </DialogDescription>
          <div className="mt-3 rounded-md bg-blue-50 p-3 text-blue-900 text-sm">
            What happens next: Your submission will be reviewed within 24–48 hours. We’ll notify you by email and in-app once approved
            or if any fixes are needed. You can track the status in Owner → Properties.
          </div>
        </DialogHeader>

        {/* Quick Preview */}
        <Card className="border-l-4 border-l-[#9b87f5]">
          <CardContent className="p-4 text-sm text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="font-medium">Title</div>
                <div className="text-gray-600">{formData.title || '—'}</div>
              </div>
              <div>
                <div className="font-medium">Category</div>
                <div className="text-gray-600">{formData.propertyCategory || '—'}</div>
              </div>
              <div>
                <div className="font-medium">Type</div>
                <div className="text-gray-600">{formData.type || '—'}</div>
              </div>
              <div>
                <div className="font-medium">Address</div>
                <div className="text-gray-600">{formData.address || '—'}</div>
              </div>
              <div>
                <div className="font-medium">Bedrooms / Bathrooms</div>
                <div className="text-gray-600">{formData.bedrooms || 0} / {formData.bathrooms || 0}</div>
              </div>
              <div>
                <div className="font-medium">Base Price</div>
                <div className="text-gray-600">{formData.price || 0} per {formData.price_unit || 'semester'}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="font-medium mb-2">Images</div>
              {((formData as any).image_url || (formData.images && formData.images.length > 0)) ? (
                <div className="grid grid-cols-3 gap-2">
                  <img
                    src={(formData as any).image_url || (formData.images?.[0] as any) || ''}
                    alt="Cover"
                    className="w-full h-24 object-cover rounded"
                  />
                  {formData.images?.slice(1, 4).map((img, idx) => (
                    <img key={idx} src={img as any} alt={`Media ${idx}`} className="w-full h-24 object-cover rounded" />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No images added yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Submission Workflow Guidance */}
        <PropertySubmissionWorkflow
          form={{
            // Minimal shim to satisfy the component API for read-only preview
            getValues: () => formData,
          } as any}
          onSubmit={onConfirm}
          isSubmitting={isLoading}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Back
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Submitting...' : isEdit ? 'Confirm Update' : 'Submit for Review'}
          </Button>
        </DialogFooter>
        <div className="pt-2 text-xs text-gray-500">
          By submitting, you agree that ROOMi’s team may contact you to verify details. Typical review time is 24–48 hours.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormSubmissionModal;

