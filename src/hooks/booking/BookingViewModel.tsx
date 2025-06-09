import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useBookingService } from '@/services/booking/useBookingService';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import { logger } from '@/utils/logger';

interface BookingFormData {
  roomType: string;
  duration: string;
  durationType: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  fullName: string;
  phone: string;
  email: string;
  emergencyContact?: EmergencyContact;
  universityName?: string;
  studentId?: string;
  program?: string;
  yearOfStudy?: string;
  roommates?: string[];
  specialRequests?: string;
  termsAgreed?: boolean;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface BookingResult {
  success: boolean;
  message?: string;
  error?: string;
}

const BookingViewModel = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    roomType: '',
    duration: '',
    durationType: '',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    fullName: '',
    phone: '',
    email: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    universityName: '',
    studentId: '',
    program: '',
    yearOfStudy: '',
    roommates: [],
    specialRequests: '',
    termsAgreed: false,
  });

  const { submitBookingForm } = useBookingService();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPropertyById } = usePropertyData();

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const isFormValid = (data: BookingFormData): boolean => {
    if (!data.fullName || !data.email || !data.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const submitBooking = async (formData: BookingFormData) => {
    if (!isFormValid(formData)) {
      logger.error('Form validation failed');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const bookingData = {
        roomType: formData.roomType,
        duration: formData.duration,
        durationType: formData.durationType,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestCount: formData.guestCount,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        emergencyPhone: formData.emergencyContact?.phone || '',
        emergencyContact: JSON.stringify(formData.emergencyContact),
        universityName: formData.universityName || '',
        studentId: formData.studentId || '',
        program: formData.program || '',
        yearOfStudy: formData.yearOfStudy || '',
        roommates: formData.roommates || [],
        specialRequests: formData.specialRequests || '',
        termsAgreed: formData.termsAgreed || false
      };

      const result = await submitBookingForm(bookingData);
      
      if (result.success) {
        logger.info('Booking submitted successfully', result);
        setBookingResult(result);
        setCurrentStep(6); // Success step
      } else {
        throw new Error(result.error || 'Booking submission failed');
      }
    } catch (error) {
      logger.error('Error submitting booking:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setIsSubmitting(false);
    setError(null);
    setBookingResult(null);
    setFormData({
      roomType: '',
      duration: '',
      durationType: '',
      checkInDate: '',
      checkOutDate: '',
      guestCount: 1,
      fullName: '',
      phone: '',
      email: '',
      emergencyContact: { name: '', phone: '', relationship: '' },
      universityName: '',
      studentId: '',
      program: '',
      yearOfStudy: '',
      roommates: [],
      specialRequests: '',
      termsAgreed: false,
    });
  };

  return {
    currentStep,
    isSubmitting,
    error,
    bookingResult,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    submitBooking,
    resetBooking,
  };
};

export default BookingViewModel;
