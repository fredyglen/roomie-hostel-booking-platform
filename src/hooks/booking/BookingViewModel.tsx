
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { bookingSampleProperties } from '@/data/bookingSampleProperties';
import { useBookingValidation } from './useBookingValidation';
import { useBookingRoommates } from './useBookingRoommates';
import { calculateTotalPrice } from './usePriceCalculation';
import { logger } from '@/utils/enhanced-logger';
import { useErrorHandler } from '@/hooks/common/useErrorHandler';
import type { BookingFormData, RoommateInfo } from '@/types/common';

export const STEP_LABELS = [
  'Room Type',
  'Duration',
  'Personal Info',
  'Emergency Contact',
  'Verification',
  'Summary',
  'Payment'
] as const;

const DEFAULT_FORM_DATA: BookingFormData = {
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

export const useBookingViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [splitPayment, setSplitPayment] = useState(false);
  const [numberOfRoommates, setNumberOfRoommates] = useState(1);
  const { handleError, handleAsyncError } = useErrorHandler();
  
  const [formData, setFormData] = useState<BookingFormData>(() => {
    try {
      // Try to load from localStorage
      const savedData = localStorage.getItem(`booking_form_${id}`);
      return savedData ? JSON.parse(savedData) : DEFAULT_FORM_DATA;
    } catch (error) {
      logger.warn('Failed to load saved form data', error instanceof Error ? error : new Error(String(error)));
      return DEFAULT_FORM_DATA;
    }
  });
  
  // Find the property with the matching ID
  const property = bookingSampleProperties.find(p => p.id === id);
  
  if (!property && id) {
    logger.error('Property not found', { propertyId: id });
  }
  
  // Validation hook
  const { validateCurrentStep } = useBookingValidation();
  
  // Roommates management
  const { roommatesInfo, handleRoommateChange } = useBookingRoommates(
    splitPayment,
    numberOfRoommates,
    {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone
    }
  );
  
  // Selected room type and price
  const selectedRoomType = property?.roomTypes?.find(r => r.name === formData.roomType);
  const selectedPrice = selectedRoomType?.price || 0;
  const selectedUnit = selectedRoomType?.unit || 'semester';
  
  // Calculate total price based on duration
  const totalPrice = calculateTotalPrice(selectedPrice, formData.duration, formData.durationType, selectedUnit);
  
  // Calculate individual price if split payment
  const individualPrice = splitPayment && numberOfRoommates > 1 
    ? totalPrice / numberOfRoommates 
    : totalPrice;
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(`booking_form_${id}`, JSON.stringify(formData));
    } catch (error) {
      logger.warn('Failed to save form data to localStorage', error instanceof Error ? error : new Error(String(error)));
    }
  }, [formData, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    try {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      logger.debug('Form input changed', { field: name, value });
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to update form field' });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: checked }));
      logger.debug('Checkbox changed', { field: name, checked });
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to update checkbox' });
    }
  };
  
  const handleSplitPaymentChange = (checked: boolean) => {
    try {
      setSplitPayment(checked);
      logger.userAction('Split payment toggled', { enabled: checked });
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to update split payment setting' });
    }
  };
  
  const handleNext = () => {
    try {
      // Validate current step
      const validationContext = {
        formData,
        splitPayment,
        numberOfRoommates,
        roommatesInfo,
        selectedPaymentMethod,
        propertyCategory: property?.propertyCategory
      };
      
      if (!validateCurrentStep(currentStep, validationContext)) return;
      
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
        logger.userAction('Booking step advanced', { from: currentStep, to: currentStep + 1 });
      } else {
        // Process payment
        processPayment();
      }
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to proceed to next step' });
    }
  };
  
  const handleBack = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
        logger.userAction('Booking step back', { from: currentStep, to: currentStep - 1 });
      } else {
        navigate(`/student/property/${id}`);
        logger.userAction('Returned to property page', { propertyId: id });
      }
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to go back' });
    }
  };
  
  const processPayment = async () => {
    await handleAsyncError(async () => {
      // Simulate payment processing
      toast.loading('Processing payment...');
      logger.info('Payment processing started', { 
        amount: individualPrice, 
        propertyId: id,
        paymentMethod: selectedPaymentMethod 
      });
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          toast.dismiss();
          toast.success('Payment successful! Booking confirmed.');
          logger.info('Payment processed successfully');
          
          // Clear booking form data from localStorage
          try {
            localStorage.removeItem(`booking_form_${id}`);
          } catch (error) {
            logger.warn('Failed to clear localStorage', error instanceof Error ? error : new Error(String(error)));
          }
          
          // Redirect to dashboard
          navigate('/student/dashboard');
          resolve();
        }, 2000);
      });
    }, { fallbackMessage: 'Payment processing failed' });
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
    setSelectedPaymentMethod
  };
};
