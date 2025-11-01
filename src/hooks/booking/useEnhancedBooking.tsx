// Enhanced Booking Hook for ROOMi Ghana Hostel Bookings
// Integrates with BookingService and provides comprehensive state management

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookingService, CreateBookingData, RoommateData } from '@/services/bookingService';
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

  // Optional roommate preferences (mobile flow)
  studyHabits?: string;
  sleepSchedule?: string;
  cleanliness?: string;
  socialPreference?: string;
  hobbies?: string[];
  dietary?: string;
  smoking?: string;
  noiseSensitivity?: string;

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
      duration: 'one_semester',
      roomType: '',
      furnishing: '',
      floor: '',
      extraRequests: '',
      // Mobile preferences (optional)
      studyHabits: '',
      sleepSchedule: '',
      cleanliness: '',
      socialPreference: '',
      hobbies: [],
      dietary: '',
      smoking: '',
      noiseSensitivity: '',
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
    pricing: BookingService.calculateBookingPricing(property.rent || 0, !!property.agent_id)
  });

  // Update form data
  const updateFormData = useCallback((field: string, value: string | Date | boolean | File | RoommateData[]) => {
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

  // Recompute pricing when base amount changes (e.g., selected room type price)
  const recomputePricing = useCallback((baseAmount: number) => {
    setState(prev => ({
      ...prev,
      pricing: BookingService.calculateBookingPricing(baseAmount, !!property.agent_id)
    }));
  }, [property.agent_id]);


  // Navigation
  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5)
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
      currentStep: Math.max(1, Math.min(step, 5))
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

  const updateRoommate = useCallback((index: number, field: keyof RoommateData, value: string | number | boolean) => {
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
      case 1: // Student Info (Personal + Emergency)
        return !!(
          formData.firstName && formData.lastName && formData.email && formData.phone &&
          formData.emergencyName && formData.emergencyPhone && formData.emergencyRelationship
        );
      case 2: // Stay Details
        return !!(formData.startDate && formData.endDate && formData.duration);
      case 3: // Room & Preferences (only room type required)
        return !!formData.roomType;
      case 4: // Verification
        // In development, allow skipping verification to test payments unless explicitly required via env
        {
          const verificationRequired = import.meta.env.PROD && import.meta.env.VITE_REQUIRE_VERIFICATION !== 'false';
          if (!verificationRequired) return true;
        }
        return !!(formData.idType && formData.studentId && formData.university && formData.program && formData.verified);
      case 5: // Payment
        return !!(formData.paymentMethod && formData.termsAgreed);
      default:
        return false;
    }
  }, [state]);

  // Create booking
  const createBooking = useCallback(async (): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { formData, pricing } = state;

      const bookingData: CreateBookingData = {
        property_id: property.id,
        student_id: user.id,
        property_owner_id: property.owner_id,
        agent_id: property.agent_id,
        check_in_date: formData.startDate.toISOString().split('T')[0],
        check_out_date: formData.endDate.toISOString().split('T')[0],
        semester_period: formData.duration,
        room_type: formData.roomType,
        roommates_count: formData.roommates.length + 1,
        total_amount: pricing.totalAmount,
        property_rent: pricing.propertyRent,
        platform_fee: pricing.totalPlatformFee,
        agent_fee: pricing.agentFee,
        emergency_contact_name: formData.emergencyName,
        emergency_contact_phone: formData.emergencyPhone,
        emergency_contact_relationship: formData.emergencyRelationship,
        student_id_number: formData.studentId,
        university: formData.university,
        program: formData.program,
        payment_method: formData.paymentMethod,
        special_requests: formData.extraRequests,
        metadata: {
          booking_source: 'web',
          property_title: property.title,
          student_verification_status: formData.verified ? 'verified' : 'pending',
          furnishing: formData.furnishing,
          floor: formData.floor,
          preferences: {
            studyHabits: formData.studyHabits,
            sleepSchedule: formData.sleepSchedule,
            cleanliness: formData.cleanliness,
            socialPreference: formData.socialPreference,
            hobbies: formData.hobbies,
            dietary: formData.dietary,
            smoking: formData.smoking,
            noiseSensitivity: formData.noiseSensitivity
          }
        }
      };

      const { booking_id } = await BookingService.createBooking(bookingData, formData.roommates);

      setState(prev => ({
        ...prev,
        loading: false,
        bookingId: booking_id
      }));

      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully!",
      });

      return booking_id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
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

      return null;
    }
  }, [user, state, property, toast]);
  // Create booking AFTER successful payment verification
  const createBookingWithPayment = useCallback(async (
    payment: { reference: string; channel?: string; id?: number | string; metadata?: Record<string, unknown> }
  ): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { formData, pricing } = state;

      const bookingData: CreateBookingData = {
        property_id: property.id,
        student_id: user.id,
        property_owner_id: property.owner_id,
        agent_id: property.agent_id,
        check_in_date: formData.startDate.toISOString().split('T')[0],
        check_out_date: formData.endDate.toISOString().split('T')[0],
        semester_period: formData.duration,
        room_type: formData.roomType,
        roommates_count: formData.roommates.length + 1,
        total_amount: pricing.totalAmount,
        property_rent: pricing.propertyRent,
        platform_fee: pricing.totalPlatformFee,
        agent_fee: pricing.agentFee,
        emergency_contact_name: formData.emergencyName,
        emergency_contact_phone: formData.emergencyPhone,
        emergency_contact_relationship: formData.emergencyRelationship,
        student_id_number: formData.studentId,
        university: formData.university,
        program: formData.program,
        payment_method: formData.paymentMethod || payment.channel || 'paystack',
        special_requests: formData.extraRequests,
        metadata: {
          booking_source: 'web',
          property_title: property.title,
          student_verification_status: formData.verified ? 'verified' : 'pending',
          furnishing: formData.furnishing,
          floor: formData.floor,
          preferences: {
            studyHabits: formData.studyHabits,
            sleepSchedule: formData.sleepSchedule,
            cleanliness: formData.cleanliness,
            socialPreference: formData.socialPreference,
            hobbies: formData.hobbies,
            dietary: formData.dietary,
            smoking: formData.smoking,
            noiseSensitivity: formData.noiseSensitivity
          },
          payment_reference: payment.reference
        }
      };

      const { booking_id } = await BookingService.createBooking(bookingData, formData.roommates);

      // Immediately mark as paid and confirmed using payment reference
      await BookingService.updateBookingPayment(booking_id, {
        payment_status: 'paid',
        status: 'confirmed',
        transaction_reference: payment.reference,
        paystack_reference: payment.id ? String(payment.id) : undefined,
        payment_reference: payment.reference,
        metadata: {
          ...(bookingData.metadata || {}),
          paystack_verification: payment.metadata || {}
        }
      });

      setState(prev => ({
        ...prev,
        loading: false,
        bookingId: booking_id
      }));

      toast({
        title: 'Booking Confirmed',
        description: 'Your booking has been created and payment verified.',
      });

      return booking_id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking after payment';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      toast({
        title: 'Booking Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return null;
    }
  }, [user, state, property, toast]);


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
        duration: 'one_semester',
        roomType: '',
        furnishing: '',
        floor: '',
        extraRequests: '',
        // Mobile preferences (optional)
        studyHabits: '',
        sleepSchedule: '',
        cleanliness: '',
        socialPreference: '',
        hobbies: [],
        dietary: '',
        smoking: '',
        noiseSensitivity: '',
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
    recomputePricing,

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

    // Actions
    createBooking,
    createBookingWithPayment,
    resetForm
  };
};

export default useEnhancedBooking;
