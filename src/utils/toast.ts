import { toast } from "@/hooks/use-toast";

/**
 * Enhanced toast utilities for consistent user feedback
 * Implements user requirements: light mint green for success, red for errors,
 * positioned at upper center with slide-down animation and auto-fade
 */

export const showSuccessToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "success",
  });
};

export const showErrorToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "destructive",
  });
};

export const showInfoToast = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
  });
};

/**
 * Form validation toast - for immediate feedback on form errors
 */
export const showValidationErrorToast = (fieldName: string, error: string) => {
  return showErrorToast(
    `${fieldName} Error`,
    error
  );
};

/**
 * Property form specific toasts
 */
export const showPropertyFormToasts = {
  roomTypeRequired: () => showValidationErrorToast("Room Type", "Please select at least one room type for your property."),
  
  smartConfigurationApplied: (roomType: string) => showSuccessToast(
    "Smart Configuration Applied",
    `Settings automatically optimized for ${roomType} properties.`
  ),
  
  formSaved: () => showSuccessToast(
    "Progress Saved",
    "Your property information has been saved automatically."
  ),
  
  submissionError: (error: string) => showErrorToast(
    "Submission Failed",
    `Unable to submit property form: ${error}`
  ),
  
  submissionSuccess: () => showSuccessToast(
    "Property Created Successfully",
    "Your property is now live and visible to students!"
  )
};
