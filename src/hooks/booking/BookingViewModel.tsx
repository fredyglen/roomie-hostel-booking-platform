
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { BookingFormData, EmergencyContact } from '@/types/common';
import { useLocalStorage } from './useLocalStorage';
import { useRoommatesManager } from './useRoommatesManager';
import { useFormValidation } from './useFormValidation';
import { calculateTotalPrice } from './usePriceCalculation';
import { ErrorHandler } from '@/utils/ErrorHandler';

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
  
  const [formData, setFormData] = useLocalStorage(`booking_form_${id}`, {
    roomType: '',
    duration: '',
    durationType: 'semester',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    fullName: '',
    phone: '',
    email: '',
    emergencyPhone: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    } as EmergencyContact,
    idType: 'studentId',
    studentId: '',
    university: '',
    program: '',
    idImage: null,
    termsAgreed: false,
    roommates: [],
    specialRequests: ''
  });
  
  // Form validation
  const { validateStep } = useFormValidation();
  
  // Roommates management
  const { 
    roommatesInfo, 
    handleRoommateChange 
  } = useRoommatesManager(
    splitPayment, 
    numberOfRoommates, 
    {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone
    }
  );
  
  // Selected room type and price calculations
  const selectedRoomType = property?.roomTypes?.find(rt => rt === formData.roomType) || formData.roomType;
  const selectedPrice = property?.price || property?.rent || 0;
  const selectedUnit = 'semester';
  
  // Calculate total price based on duration
  const totalPrice = calculateTotalPrice(
    selectedPrice, 
    formData.duration, 
    formData.durationType, 
    selectedUnit
  );
  
  // Calculate individual price if split payment
  const individualPrice = splitPayment && numberOfRoommates > 1 
    ? totalPrice / numberOfRoommates 
    : totalPrice;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSplitPaymentChange = (checked: boolean) => {
    setSplitPayment(checked);
  };
  
  const handleNext = () => {
    try {
      // Validate current step
      if (!validateStep(
        currentStep, 
        formData, 
        {
          splitPayment,
          numberOfRoommates,
          roommatesInfo,
          selectedPaymentMethod,
          propertyCategory: property?.propertyCategory
        }
      )) return;
      
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        // Process payment
        processPayment();
      }
    } catch (error) {
      ErrorHandler.handle(error, 'BookingViewModel.handleNext');
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
  
  const processPayment = () => {
    try {
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
    } catch (error) {
      ErrorHandler.handle(error, 'BookingViewModel.processPayment');
    }
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
