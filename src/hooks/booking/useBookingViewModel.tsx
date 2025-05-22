
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';

export const STEP_LABELS = [
  'Room Type',
  'Duration',
  'Personal Info',
  'Emergency Contact',
  'Verification',
  'Summary',
  'Payment'
];

/**
 * Custom hook for managing booking form state and logic
 */
export const useBookingViewModel = (property: Property | undefined, id: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [splitPayment, setSplitPayment] = useState(false);
  const [numberOfRoommates, setNumberOfRoommates] = useState(1);
  const [roommatesInfo, setRoommatesInfo] = useState<Array<{name: string, email: string, phone: string}>>([]);
  
  const [formData, setFormData] = useState(() => {
    // Try to load from localStorage
    const savedData = localStorage.getItem(`booking_form_${id}`);
    return savedData ? JSON.parse(savedData) : {
      roomType: '',
      duration: '',
      durationType: 'semester',
      checkInDate: '',
      fullName: '',
      phone: '',
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      idType: 'studentId',
      studentId: '',
      university: '',
      program: '',
      idImage: null,
      termsAgreed: false
    };
  });
  
  // Selected room type and price calculations
  const selectedRoomType = property?.roomTypes?.find(r => r.name === formData.roomType);
  const selectedPrice = selectedRoomType?.price || 0;
  const selectedUnit = selectedRoomType?.unit || 'semester';
  
  // Calculate total price based on duration
  const totalPrice = calculateTotalPrice(selectedPrice, formData.duration, formData.durationType, selectedUnit);
  
  // Calculate individual price if split payment
  const individualPrice = splitPayment && numberOfRoommates > 1 
    ? totalPrice / numberOfRoommates 
    : totalPrice;
  
  // Initialize roommate info when numberOfRoommates changes
  useEffect(() => {
    if (splitPayment && numberOfRoommates > 1) {
      // Always keep roommate at index 0 as the current user
      const currentUser = roommatesInfo[0] || {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };
      
      const newRoommatesInfo = [currentUser];
      
      // Add/remove additional roommates as needed
      for (let i = 1; i < numberOfRoommates; i++) {
        newRoommatesInfo[i] = roommatesInfo[i] || { name: '', email: '', phone: '' };
      }
      
      setRoommatesInfo(newRoommatesInfo);
    }
  }, [numberOfRoommates, splitPayment, formData.fullName, formData.email, formData.phone]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`booking_form_${id}`, JSON.stringify(formData));
  }, [formData, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommatesInfo];
    updatedRoommates[index] = { ...updatedRoommates[index], [field]: value };
    setRoommatesInfo(updatedRoommates);
  };
  
  const handleSplitPaymentChange = (checked: boolean) => {
    setSplitPayment(checked);
    
    // Initialize with current user info if enabling split payment
    if (checked && !roommatesInfo.length) {
      setRoommatesInfo([{
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone
      }]);
    }
  };
  
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) return;
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Process payment
      processPayment();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(`/student/property/${id}`);
    }
  };
  
  const validateCurrentStep = () => {
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
        if (property?.propertyCategory === 'Apartment' && splitPayment) {
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
        
        // Update first roommate info if using split payment
        if (splitPayment && roommatesInfo.length) {
          handleRoommateChange(0, 'name', formData.fullName);
          handleRoommateChange(0, 'email', formData.email);
          handleRoommateChange(0, 'phone', formData.phone);
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
  
  const processPayment = () => {
    // Simulate payment processing
    toast({
      title: "Processing payment...",
    });
    
    setTimeout(() => {
      toast({
        title: "Payment successful!",
        description: "Booking confirmed."
      });
      
      // Clear booking form data from localStorage
      localStorage.removeItem(`booking_form_${id}`);
      
      // Redirect to dashboard
      navigate('/student/dashboard');
    }, 2000);
  };
  
  return {
    property,
    currentStep,
    formData,
    selectedPaymentMethod,
    selectedPrice,
    selectedUnit,
    totalPrice,
    splitPayment,
    setSplitPayment: handleSplitPaymentChange,
    numberOfRoommates,
    setNumberOfRoommates,
    roommatesInfo,
    handleRoommateChange,
    individualPrice,
    handleInputChange,
    handleCheckboxChange,
    handleNext,
    handleBack,
    setSelectedPaymentMethod,
    setCurrentStep
  };
};

// Helper function to calculate total price
function calculateTotalPrice(
  basePrice: number,
  duration: string,
  durationType: string,
  propertyPriceUnit: string
): number {
  if (!basePrice || !duration) return 0;
  
  const durationNum = parseInt(duration, 10);
  
  if (isNaN(durationNum) || durationNum <= 0) return 0;
  
  // If durationType matches property's price unit, simple multiplication
  if (durationType === propertyPriceUnit) {
    return basePrice * durationNum;
  }
  
  // Handle conversions between different duration types
  if (propertyPriceUnit === 'month' && durationType === 'semester') {
    // Semester is approximately 4 months
    return basePrice * 4 * durationNum;
  } else if (propertyPriceUnit === 'semester' && durationType === 'month') {
    // Convert semester price to monthly
    return (basePrice / 4) * durationNum;
  } else if (propertyPriceUnit === 'month' && durationType === 'year') {
    // Year is 12 months
    return basePrice * 12 * durationNum;
  } else if (propertyPriceUnit === 'year' && durationType === 'month') {
    // Convert yearly price to monthly
    return (basePrice / 12) * durationNum;
  } else if (propertyPriceUnit === 'semester' && durationType === 'year') {
    // Year is typically 2 semesters
    return basePrice * 2 * durationNum;
  } else if (propertyPriceUnit === 'year' && durationType === 'semester') {
    // Convert yearly price to semester
    return (basePrice / 2) * durationNum;
  } else if (propertyPriceUnit === 'week' && durationType === 'month') {
    // Month is typically 4 weeks
    return basePrice * 4 * durationNum;
  } else if (propertyPriceUnit === 'month' && durationType === 'week') {
    // Convert monthly price to weekly
    return (basePrice / 4) * durationNum;
  }
  
  // Default fallback
  return basePrice * durationNum;
}
