// Enhanced Booking Hook for ROOMi Ghana Hostel Bookings
// Integrates with BookingService and provides comprehensive state management

import { useState, useCallback } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { createPendingBooking, getServerQuote, waitForBookingSettlement, type ServerQuote } from '@/services/payment/serverPricing';
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
  serverQuote: ServerQuote | null;
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
    serverQuote: null,
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

  // ---------------------------------------------------------------------------
  // SERVER-AUTHORITATIVE BOOKING LIFECYCLE
  // The browser no longer inserts bookings or writes payment state.
  //  1. ensurePendingBooking(): a server RPC creates the booking as a
  //     'pending' hold (one bed atomically reserved, price captured
  //     server-side) and the server quote becomes the ONLY pricing shown.
  //  2. PaymentStep initializes the charge with booking_id; Paystack charges.
  //  3. The SERVER (webhook / verify-payment settlement) confirms the
  //     booking. createBookingWithPayment() only waits to observe that.
  // ---------------------------------------------------------------------------

  const ensurePendingBooking = useCallback(async (): Promise<string | null> => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to complete your booking.', variant: 'destructive' });
      return null;
    }
    if (state.bookingId) return state.bookingId;

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { formData } = state;
      const created = await createPendingBooking({
        propertyId: property.id,
        checkIn: formData.startDate.toISOString().split('T')[0],
        checkOut: formData.endDate.toISOString().split('T')[0],
        roomType: formData.roomType || null,
        semesterPeriod: formData.duration || null,
        roommatesCount: formData.roommates.length + 1,
        specialRequests: formData.extraRequests || null,
        emergencyContactName: formData.emergencyName || null,
        emergencyContactPhone: formData.emergencyPhone || null,
        emergencyContactRelationship: formData.emergencyRelationship || null,
        studentIdNumber: formData.studentId || null,
        university: formData.university || null,
        program: formData.program || null,
        metadata: {
          booking_source: 'web',
          property_title: property.title,
          student_verification_status: formData.verified ? 'verified' : 'pending',
          furnishing: formData.furnishing,
          floor: formData.floor,
        },
      });

      const quote = await getServerQuote({
        email: formData.email || user.email || '',
        bookingId: created.booking_id,
        kind: 'full',
      });

      setState(prev => ({
        ...prev,
        loading: false,
        bookingId: created.booking_id,
        serverQuote: quote,
        // Display pricing is now the server quote — the client engine result
        // it replaces was only ever an estimate.
        pricing: {
          propertyRent: quote.breakdown.baseAmount,
          platformCommission: quote.breakdown.platformCommission,
          platformFixedFee: quote.breakdown.platformFixedFee,
          agentFee: quote.breakdown.agentCommission,
          totalPlatformFee: Math.max(0, Math.round((quote.total_amount - quote.breakdown.baseAmount) * 100) / 100),
          totalAmount: quote.total_amount,
          ownerReceives: quote.breakdown.ownerReceives,
        },
      }));
      return created.booking_id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start your booking.';
      setState(prev => ({ ...prev, loading: false, error: message }));
      toast({ title: 'Booking Unavailable', description: message, variant: 'destructive' });
      return null;
    }
  }, [user, state, property, toast]);

  // Back-compat: older call sites used createBooking() to insert a booking.
  const createBooking = ensurePendingBooking;

  const createBookingWithPayment = useCallback(async (
    payment: { reference: string; amount?: number; channel?: string; id?: number; metadata?: Record<string, unknown> }
  ): Promise<string | null> => {
    const bookingId = state.bookingId
      ?? ((payment.metadata?.booking_id as string | undefined) ?? null);
    if (!bookingId) {
      toast({
        title: 'Booking Error',
        description: 'Payment received but no booking is attached. Please contact support with reference ' + payment.reference,
        variant: 'destructive',
      });
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    const result = await waitForBookingSettlement(bookingId);
    setState(prev => ({ ...prev, loading: false, bookingId }));

    if (result.settled && result.payment_status === 'partially_paid') {
      toast({ title: 'Deposit Received', description: 'Your room is reserved. Pay the balance before the deadline to confirm your booking.' });
    } else if (result.settled) {
      toast({ title: 'Booking Confirmed', description: 'Your payment has been verified and your booking is confirmed.' });
    } else {
      toast({ title: 'Payment Received', description: 'Your booking is being confirmed — this can take a moment. You can check its status in My Bookings.' });
    }
    return bookingId;
  }, [state, toast]);

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

    // Server-authoritative booking
    ensurePendingBooking,

    // Actions
    createBooking,
    createBookingWithPayment,
    resetForm
  };
};

export default useEnhancedBooking;
