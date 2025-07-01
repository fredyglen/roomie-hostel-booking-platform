// Enhanced Booking Hook for ROOMi Ghana Hostel Bookings
// Integrates with BookingService and provides comprehensive state management

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookingService, CreateBookingData, RoommateData } from '@/services/bookingService';
import { PaymentFirstBookingService, type PaymentFirstBookingData, type BookingCreationResult } from '@/services/payment/PaymentFirstBookingService';
import { Property } from '@/types/property';

export interface BookingFormState {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Dates
  startDate: Date;
  endDate: Date;
  duration: string;
  
  // Room Selection
  roomType: string;
  furnishing: string;
  floor: string;
  extraRequests: string;
  
  // Roommates
  roommates: RoommateData[];
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  
  // Verification
  idType: string;
  studentId: string;
  university: string;
  program: string;
  idImage: File | null;
  verified: boolean;
  
  // Payment
  paymentMethod: string;
  termsAgreed: boolean;
}

export interface BookingState {
  formData: BookingFormState;
  currentStep: number;
  loading: boolean;
  error: string | null;
  bookingId: string | null;
  pricing: {
    propertyRent: number;
    platformCommission: number;
    platformFixedFee: number;
    agentFee: number;
    totalPlatformFee: number;
    totalAmount: number;
    ownerReceives: number;
  };
}

export const useEnhancedBooking = (property: Property) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [state, setState] = useState<BookingState>({
    formData: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months later
      duration: 'semester',
      roomType: '',
      furnishing: '',
      floor: '',
      extraRequests: '',
      roommates: [],
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelationship: '',
      idType: '',
      studentId: '',
      university: '',
      program: '',
      idImage: null,
      verified: false,
      paymentMethod: '',
      termsAgreed: false
    },
    currentStep: 1,
    loading: false,
    error: null,
    bookingId: null,
    pricing: BookingService.calculateBookingPricing(property.price?.amount || 0, !!property.owner?.id)
  });

  // Update form data
  const updateFormData = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  }, []);

  // Update multiple form fields
  const updateFormFields = useCallback((fields: Partial<BookingFormState>) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...fields
      }
    }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 7)
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, 7))
    }));
  }, []);

  // Roommate management
  const addRoommate = useCallback(() => {
    const newRoommate: RoommateData = {
      roommate_name: '',
      roommate_email: '',
      roommate_phone: '',
      is_primary_booker: false,
      payment_responsibility: 'individual'
    };
    
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        roommates: [...prev.formData.roommates, newRoommate]
      }
    }));
  }, []);

  const removeRoommate = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        roommates: prev.formData.roommates.filter((_, i) => i !== index)
      }
    }));
  }, []);

  const updateRoommate = useCallback((index: number, field: string, value: any) => {
    setState(prev => {
      const updatedRoommates = [...prev.formData.roommates];
      updatedRoommates[index] = {
        ...updatedRoommates[index],
        [field]: value
      };
      
      return {
        ...prev,
        formData: {
          ...prev.formData,
          roommates: updatedRoommates
        }
      };
    });
  }, []);

  // Validation
  const validateStep = useCallback((step: number): boolean => {
    const { formData } = state;
    
    switch (step) {
      case 1: // Personal Info
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2: // Dates
        return !!(formData.startDate && formData.endDate && formData.duration);
      case 3: // Room Selection
        return !!formData.roomType;
      case 4: // Roommates (optional)
        return true;
      case 5: // Emergency Contact
        return !!(formData.emergencyName && formData.emergencyPhone && formData.emergencyRelationship);
      case 6: // Verification
        return !!(formData.studentId && formData.university && formData.program);
      case 7: // Payment
        return !!(formData.paymentMethod && formData.termsAgreed);
      default:
        return false;
    }
  }, [state]);

  /**
   * Apple-Level Payment-First Booking Creation
   *
   * Business Purpose: Creates bookings ONLY after successful payment confirmation
   * This ensures financial integrity and prevents phantom bookings
   *
   * Technical Implementation: Uses PaymentFirstBookingService to process payment
   * before booking creation, maintaining data consistency and audit trails
   *
   * Critical for Revenue Protection: Eliminates booking-payment mismatches
   */
  const processPaymentFirstBooking = useCallback(async (): Promise<BookingCreationResult> => {
    if (!user) {
      const error = {
        type: 'booking' as const,
        message: "Authentication required to complete booking",
        details: "User session expired or not authenticated"
      };

      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });

      return { success: false, error };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { formData, pricing } = state;

      // Prepare Apple-Level payment-first booking data
      const paymentFirstData: PaymentFirstBookingData = {
        property,
        student: user,
        bookingDetails: {
          checkInDate: formData.startDate.toISOString().split('T')[0],
          checkOutDate: formData.endDate.toISOString().split('T')[0],
          semesterPeriod: formData.duration,
          roomType: formData.roomType,
          roommatesCount: formData.roommates.length + 1,
          specialRequests: formData.extraRequests
        },
        studentInfo: {
          emergencyContactName: formData.emergencyName,
          emergencyContactPhone: formData.emergencyPhone,
          emergencyContactRelationship: formData.emergencyRelationship,
          studentIdNumber: formData.studentId,
          university: formData.university,
          program: formData.program,
          verified: formData.verified
        },
        roommates: formData.roommates.map(roommate => ({
          name: roommate.roommate_name || '',
          email: roommate.roommate_email || '',
          phone: roommate.roommate_phone || '',
          relationship: 'friend' // Default relationship
        })),
        pricing: {
          propertyRent: pricing.propertyRent,
          platformCommission: pricing.platformCommission,
          platformFixedFee: pricing.platformFixedFee,
          agentFee: pricing.agentFee,
          totalAmount: pricing.totalAmount
        }
      };

      // Process payment-first booking with Apple-Level service
      const result = await PaymentFirstBookingService.processPaymentFirstBooking(paymentFirstData);

      setState(prev => ({
        ...prev,
        loading: false,
        bookingId: result.bookingId || null,
        error: result.success ? null : result.error?.message || 'Booking failed'
      }));

      if (result.success) {
        toast({
          title: "Payment Successful!",
          description: `Your booking has been confirmed. Confirmation: ${result.confirmationNumber}`,
        });
      } else {
        toast({
          title: "Booking Failed",
          description: result.error?.message || "Payment or booking processing failed",
          variant: "destructive",
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment and booking';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: {
          type: 'booking',
          message: errorMessage,
          details: error
        }
      };
    }
  }, [user, state, property, toast]);

  /**
   * Legacy booking creation method - DEPRECATED
   *
   * @deprecated Use processPaymentFirstBooking instead
   * This method creates bookings before payment and violates Apple-Level standards
   */
  const createBooking = useCallback(async (): Promise<string | null> => {
    console.warn('DEPRECATED: createBooking method violates Apple-Level standards. Use processPaymentFirstBooking instead.');

    // For backward compatibility, redirect to payment-first flow
    const result = await processPaymentFirstBooking();
    return result.success ? result.bookingId || null : null;
  }, [processPaymentFirstBooking]);

  // Reset form
  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        firstName: user?.user_metadata?.first_name || '',
        lastName: user?.user_metadata?.last_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        duration: 'semester',
        roomType: '',
        furnishing: '',
        floor: '',
        extraRequests: '',
        roommates: [],
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelationship: '',
        idType: '',
        studentId: '',
        university: '',
        program: '',
        idImage: null,
        verified: false,
        paymentMethod: '',
        termsAgreed: false
      },
      currentStep: 1,
      loading: false,
      error: null,
      bookingId: null
    }));
  }, [user]);

  return {
    // State
    ...state,

    // Form updates
    updateFormData,
    updateFormFields,

    // Navigation
    nextStep,
    previousStep,
    goToStep,

    // Roommate management
    addRoommate,
    removeRoommate,
    updateRoommate,

    // Validation
    validateStep,

    // Actions - Apple-Level payment-first booking
    processPaymentFirstBooking,
    createBooking, // Deprecated - kept for backward compatibility
    resetForm
  };
};

export default useEnhancedBooking;
