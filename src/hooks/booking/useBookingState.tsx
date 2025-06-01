
import { useState } from 'react';

interface BookingState {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  bookingDates: {
    moveIn: Date;
    moveOut: Date;
    duration: string;
  };
  roomOptions: {
    roomType: string;
    furnishingOption: string;
    floor: string;
    extraRequests: string;
  };
  roommates: Array<{ name: string; email: string; phone: string }>;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    alternatePhone: string;
  };
  studentVerification: {
    idType: string;
    studentId: string;
    university: string;
    program: string;
    idImage: File | null;
    verified: boolean;
  };
  paymentInfo: {
    isProcessing: boolean;
    isComplete: boolean;
  };
}

export const useBookingState = (propertyId?: string) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingState, setBookingState] = useState<BookingState>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    bookingDates: {
      moveIn: new Date(),
      moveOut: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months later
      duration: '',
    },
    roomOptions: {
      roomType: '',
      furnishingOption: '',
      floor: '',
      extraRequests: '',
    },
    roommates: [],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      alternatePhone: '',
    },
    studentVerification: {
      idType: '',
      studentId: '',
      university: '',
      program: '',
      idImage: null,
      verified: false,
    },
    paymentInfo: {
      isProcessing: false,
      isComplete: false,
    },
  });

  const updatePersonalInfo = (field: string, value: string) => {
    setBookingState(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateBookingDates = (field: string, value: Date | string) => {
    setBookingState(prev => ({
      ...prev,
      bookingDates: {
        ...prev.bookingDates,
        [field]: value,
      },
    }));
  };

  const updateRoomOptions = (field: string, value: string) => {
    setBookingState(prev => ({
      ...prev,
      roomOptions: {
        ...prev.roomOptions,
        [field]: value,
      },
    }));
  };

  const updateRoommate = (index: number, field: string, value: string) => {
    setBookingState(prev => {
      const newRoommates = [...prev.roommates];
      if (newRoommates[index]) {
        newRoommates[index] = {
          ...newRoommates[index],
          [field]: value,
        };
      }
      return {
        ...prev,
        roommates: newRoommates,
      };
    });
  };

  const addRoommate = () => {
    setBookingState(prev => ({
      ...prev,
      roommates: [
        ...prev.roommates,
        { name: '', email: '', phone: '' },
      ],
    }));
  };

  const removeRoommate = (index: number) => {
    setBookingState(prev => ({
      ...prev,
      roommates: prev.roommates.filter((_, i) => i !== index),
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setBookingState(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const updateStudentVerification = (field: string, value: string | File | boolean) => {
    setBookingState(prev => ({
      ...prev,
      studentVerification: {
        ...prev.studentVerification,
        [field]: value,
      },
    }));
  };

  const updatePaymentInfo = (updates: Partial<BookingState['paymentInfo']>) => {
    setBookingState(prev => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        ...updates,
      },
    }));
  };

  return {
    bookingState,
    currentStep,
    setCurrentStep,
    bookingComplete,
    setBookingComplete,
    loading,
    setLoading,
    updatePersonalInfo,
    updateBookingDates,
    updateRoomOptions,
    updateRoommate,
    addRoommate,
    removeRoommate,
    updateEmergencyContact,
    updateStudentVerification,
    updatePaymentInfo,
  };
};
