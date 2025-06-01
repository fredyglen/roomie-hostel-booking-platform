
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { bookingSampleProperties } from '@/data/bookingSampleProperties';
import { useBookingValidation } from './useBookingValidation';
import { useBookingRoommates } from './useBookingRoommates';
import { calculateTotalPrice } from './usePriceCalculation';

export const STEP_LABELS = [
  'Room Type',
  'Duration',
  'Personal Info',
  'Emergency Contact',
  'Verification',
  'Summary',
  'Payment'
];

export const useBookingViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [splitPayment, setSplitPayment] = useState(false);
  const [numberOfRoommates, setNumberOfRoommates] = useState(1);
  
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
  
  // Find the property with the matching ID
  const property = bookingSampleProperties.find(p => p.id === id);
  
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
  
  const handleSplitPaymentChange = (checked: boolean) => {
    setSplitPayment(checked);
  };
  
  const handleNext = () => {
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
  
  const processPayment = () => {
    // Simulate payment processing
    toast.loading('Processing payment...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Payment successful! Booking confirmed.');
      
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
    setSelectedPaymentMethod
  };
};
