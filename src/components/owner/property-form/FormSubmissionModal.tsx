
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PropertyFormValues } from './PropertyFormSchema';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: PropertyFormValues | null;
  isEdit: boolean;
  isLoading: boolean;
}

const FormSubmissionModal: React.FC<FormSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isEdit,
  isLoading
}) => {
  if (!formData) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {isEdit ? 'Update Property?' : 'Create Property?'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Please review your property details before {isEdit ? 'updating' : 'creating'}:
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Category:</strong> {formData.propertyCategory}</div>
                <div><strong>Type:</strong> {formData.type}</div>
                <div><strong>Location:</strong> {formData.city}, {formData.region}</div>
                <div><strong>Price:</strong> GH₵{formData.price} per {formData.price_unit}</div>
                
                {formData.propertyCategory === 'Hostel' && (
                  <div><strong>Available Beds:</strong> {formData.beds_available || 0}</div>
                )}
                
                {formData.propertyCategory === 'Homestel' && (
                  <div><strong>Available Rooms:</strong> {formData.rooms_available || 0}</div>
                )}
                
                {formData.propertyCategory === 'Apartment' && (
                  <div><strong>Max Occupants:</strong> {formData.max_occupants || 0}</div>
                )}
              </div>
              
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {isEdit 
                    ? 'This will update your existing property listing.'
                    : 'Once created, your property will be visible to students searching for accommodation.'
                  }
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading 
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update Property' : 'Create Property')
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSubmissionModal;
