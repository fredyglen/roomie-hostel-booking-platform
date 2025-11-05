import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property, Room } from '@/types/property';
import { useLocalStorage } from './useLocalStorage';
import { useRoommatesManager } from './useRoommatesManager';
import { useFormValidation } from './useFormValidation';
import { calculateTotalPrice } from './usePriceCalculation';
import { BookingQueries } from '@/services/database/standardizedQueries';
import { supabase } from '@/integrations/supabase/client';

import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';

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

  // Payment integration state
  // Subscribe to real-time commission rate changes to keep calculations fresh
  const { rates } = useRealTimeCommissionConfig({ portal: 'student', autoSubscribe: true });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [formData, setFormData] = useLocalStorage(`booking_form_${id}`, {
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
  const selectedRoomType = property?.buildings?.[0]?.floors?.[0]?.rooms?.find((r: Room) => r.name === formData.roomType);
  const selectedPrice = selectedRoomType?.price || property?.price?.amount || 0;
  const selectedUnit = property?.price?.period || 'semester';

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
    // Validate current step
    if (!validateStep(
      currentStep,
      formData,
      {
        splitPayment,
        numberOfRoommates,
        roommatesInfo,
        selectedPaymentMethod,
        propertyCategory: property?.type
      }
    )) return;

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

  // Dynamic commission engine hookup (no hardcoded rates)
  const calculatePaymentDistribution = (basePrice: number) => {
    const includeAgent = Boolean(property?.agent_id);
    const breakdown = centralizedCommissionEngine.calculateCommissions(basePrice, includeAgent);

    return {
      basePrice: breakdown.baseAmount,
      platformCommission: breakdown.platformCommission,
      platformFee: breakdown.platformFixedFee,
      paystackFee: breakdown.paystackFee,
      totalAmount: breakdown.totalAmount,
      propertyOwnerAmount: breakdown.ownerReceives,
      roomiAmount: breakdown.platformCommission + breakdown.platformFixedFee
    };
  };

  const handlePaymentSuccess = async (paymentResult: { reference: string; status: string }) => {
    try {
      if (!bookingId) {
        throw new Error('No booking ID found');
      }

      // Update booking with payment information
      const { error } = await supabase
        .from('bookings_enhanced')
        .update({
          payment_status: 'completed',
          status: 'confirmed',
          payment_reference: paymentResult.reference,
          paystack_reference: paymentResult.transaction?.reference || paymentResult.reference,
          payment_method: paymentResult.verification?.channel || 'card',
          paid_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Clear form data
      localStorage.removeItem(`booking_form_${id}`);

      // Close payment modal
      setShowPaymentModal(false);

      // Show success message
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });

      // Navigate to booking confirmation page
      navigate('/student/booking-confirmation', {
        state: {
          bookingId: bookingId,
          paymentReference: paymentResult.reference
        }
      });

    } catch (error: unknown) {
      toast({
        title: "Payment Processing Error",
        description: "Payment successful but booking update failed. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });

    // Keep payment modal open for retry
    // User can try again or close modal
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    // Booking remains in pending state for user to retry later
  };

  const processPayment = async () => {
    try {
      setIsCreatingBooking(true);

      // Calculate payment distribution
      const distribution = calculatePaymentDistribution(totalPrice);

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create booking record first
      const bookingData = {
        student_id: user.id,
        property_id: id,
        property_owner_id: property?.user_id || property?.owner_id,
        room_id: property?.buildings?.[0]?.floors?.[0]?.rooms?.[0]?.id || null,
        bed_id: property?.buildings?.[0]?.floors?.[0]?.rooms?.[0]?.beds?.[0]?.id || null,
        check_in_date: formData.checkInDate,
        check_out_date: new Date(new Date(formData.checkInDate).getTime() + (parseInt(formData.duration) * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        total_amount: distribution.totalAmount,
        base_property_price: distribution.basePrice,
        platform_commission: distribution.platformCommission,
        platform_fee: distribution.platformFee,
        student_name: formData.fullName,
        student_email: formData.email,
        student_phone: formData.phone,
        emergency_contact_name: formData.emergencyContact,
        emergency_contact_phone: formData.emergencyPhone,
        special_requests: formData.roomType ? `Room type: ${formData.roomType}` : null,
        payment_status: 'pending',
        status: 'pending'
      };

      const booking = await BookingQueries.createBooking(bookingData);
      setBookingId(booking.id);
      setIsCreatingBooking(false);

      // Show payment modal
      setShowPaymentModal(true);

    } catch (error: unknown) {
      setIsCreatingBooking(false);
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking. Please try again.";
      toast({
        title: "Booking Creation Failed",
        description: errorMessage,
        variant: "destructive"
      });
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
    setCurrentStep,
    processPayment,
    // Payment integration state and handlers
    showPaymentModal,
    setShowPaymentModal,
    isCreatingBooking,
    handlePaymentSuccess,
    handlePaymentError,
    handlePaymentModalClose,
    paymentDistribution: calculatePaymentDistribution(totalPrice)
  };
};
