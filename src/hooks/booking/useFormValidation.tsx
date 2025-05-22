
import { useToast } from '@/hooks/use-toast';

// Define types for form data
interface FormData {
  roomType: string;
  duration: string;
  checkInDate: string;
  fullName: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  termsAgreed: boolean;
  [key: string]: any;
}

export const useFormValidation = () => {
  const { toast } = useToast();
  
  const validateStep = (currentStep: number, formData: FormData, additionalData: {
    splitPayment: boolean,
    numberOfRoommates: number,
    roommatesInfo: Array<{name: string, email: string, phone: string}>,
    selectedPaymentMethod: string,
    propertyCategory?: string
  }) => {
    const {
      splitPayment,
      numberOfRoommates,
      roommatesInfo,
      selectedPaymentMethod,
      propertyCategory
    } = additionalData;
    
    switch (currentStep) {
      case 1: // Room Type
        if (!formData.roomType) {
          toast({
            title: "Please select a room type",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 2: // Duration
        if (!formData.duration) {
          toast({
            title: "Please enter duration",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.checkInDate) {
          toast({
            title: "Please select check-in date",
            variant: "destructive"
          });
          return false;
        }
        
        // Validate split payment info if it's an apartment and split payment is enabled
        if (propertyCategory === 'Apartment' && splitPayment) {
          if (numberOfRoommates < 2) {
            toast({
              title: "Please specify at least 2 roommates for split payment",
              variant: "destructive"
            });
            return false;
          }
          
          // Check if all roommates have complete info
          const incompleteRoommate = roommatesInfo.find((r, idx) => {
            // Skip first roommate validation here (it's validated in personal info step)
            if (idx === 0) return false;
            return !r.name || !r.email || !r.phone;
          });
          
          if (incompleteRoommate) {
            toast({
              title: "Please provide complete information for all roommates",
              variant: "destructive"
            });
            return false;
          }
        }
        
        return true;
        
      case 3: // Personal Info
        if (!formData.fullName || !formData.phone || !formData.email) {
          toast({
            title: "Please fill in all personal information",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 4: // Emergency Contact
        if (!formData.emergencyContact || !formData.emergencyPhone) {
          toast({
            title: "Please fill in all emergency contact information",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 5: // Verification
        // Skip validation here as it's handled in the StudentVerification component
        return true;
        
      case 6: // Summary
        if (!formData.termsAgreed) {
          toast({
            title: "Please agree to the terms and conditions",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      case 7: // Payment
        if (!selectedPaymentMethod) {
          toast({
            title: "Please select a payment method",
            variant: "destructive"
          });
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  return { validateStep };
};
