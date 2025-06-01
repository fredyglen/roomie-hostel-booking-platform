
import { toast } from 'sonner';
import { logger } from '@/utils/enhanced-logger';
import type { RoommateInfo, BookingFormData } from '@/types/common';

interface ValidationContext {
  formData: BookingFormData;
  splitPayment: boolean;
  numberOfRoommates: number;
  roommatesInfo: RoommateInfo[];
  selectedPaymentMethod: string;
  propertyCategory?: string;
}

export const useBookingValidation = () => {
  const validateCurrentStep = (currentStep: number, context: ValidationContext): boolean => {
    const { formData, splitPayment, numberOfRoommates, roommatesInfo, selectedPaymentMethod, propertyCategory } = context;
    
    logger.debug('Validating booking step', { currentStep, propertyCategory, splitPayment });
    
    try {
      switch (currentStep) {
        case 1: // Room Type
          if (!formData.roomType) {
            toast.error('Please select a room type');
            return false;
          }
          return true;
          
        case 2: // Duration
          if (!formData.duration) {
            toast.error('Please enter duration');
            return false;
          }
          if (!formData.checkInDate) {
            toast.error('Please select check-in date');
            return false;
          }
          
          // Validate split payment info if it's an apartment and split payment is enabled
          if (propertyCategory === 'Apartment' && splitPayment) {
            if (numberOfRoommates < 2) {
              toast.error('Please specify at least 2 roommates for split payment');
              return false;
            }
            
            // Check if all roommates have complete info
            const incompleteRoommate = roommatesInfo.find((r, idx) => {
              // Skip first roommate validation here (it's validated in personal info step)
              if (idx === 0) return false;
              return !r.name || !r.email || !r.phone;
            });
            
            if (incompleteRoommate) {
              toast.error('Please provide complete information for all roommates');
              return false;
            }
          }
          
          return true;
          
        case 3: // Personal Info
          if (!formData.fullName || !formData.phone || !formData.email) {
            toast.error('Please fill in all personal information');
            return false;
          }
          
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
          }
          
          return true;
          
        case 4: // Emergency Contact
          if (!formData.emergencyContact || !formData.emergencyPhone) {
            toast.error('Please fill in all emergency contact information');
            return false;
          }
          return true;
          
        case 5: // Verification
          // Skip validation here as it's handled in the StudentVerification component
          return true;
          
        case 6: // Summary
          if (!formData.termsAgreed) {
            toast.error('Please agree to the terms and conditions');
            return false;
          }
          return true;
          
        case 7: // Payment
          if (!selectedPaymentMethod) {
            toast.error('Please select a payment method');
            return false;
          }
          return true;
          
        default:
          logger.warn('Unknown validation step', { currentStep });
          return true;
      }
    } catch (error) {
      logger.error('Validation error', error instanceof Error ? error : new Error(String(error)));
      toast.error('Validation failed. Please try again.');
      return false;
    }
  };

  return { validateCurrentStep };
};
