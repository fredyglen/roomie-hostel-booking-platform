
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface BookingState {
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
    method: string;
    momoNumber: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    isProcessing: boolean;
    isComplete: boolean;
  };
}

const initialState: BookingState = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  bookingDates: {
    moveIn: new Date(),
    moveOut: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    duration: '1 semester'
  },
  roomOptions: {
    roomType: 'single',
    furnishingOption: 'fully_furnished',
    floor: '1st',
    extraRequests: ''
  },
  roommates: [],
  emergencyContact: {
    name: '',
    relationship: 'parent',
    phone: '',
    alternatePhone: ''
  },
  studentVerification: {
    idType: 'studentId',
    studentId: '',
    university: '',
    program: '',
    idImage: null,
    verified: false
  },
  paymentInfo: {
    method: '',
    momoNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    isProcessing: false,
    isComplete: false
  }
};

export const useBookingState = (propertyId?: string) => {
  const [bookingState, setBookingState] = useLocalStorage<BookingState>(
    `booking_${propertyId}`, 
    initialState
  );
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const updatePersonalInfo = (field: string, value: string) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateBookingDates = (field: string, value: Date | string) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      bookingDates: { ...prev.bookingDates, [field]: value }
    }));
  };

  const updateRoomOptions = (field: string, value: string) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      roomOptions: { ...prev.roomOptions, [field]: value }
    }));
  };

  const updateRoommate = (index: number, field: string, value: string) => {
    setBookingState((prev: BookingState) => {
      const updatedRoommates = [...prev.roommates];
      updatedRoommates[index] = { ...updatedRoommates[index], [field]: value };
      return { ...prev, roommates: updatedRoommates };
    });
  };

  const addRoommate = () => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      roommates: [...prev.roommates, { name: '', email: '', phone: '' }]
    }));
  };

  const removeRoommate = (index: number) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      roommates: prev.roommates.filter((_, i) => i !== index)
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  const updateStudentVerification = (field: string, value: string | File | boolean) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      studentVerification: { ...prev.studentVerification, [field]: value }
    }));
  };

  const updatePaymentInfo = (updates: Partial<BookingState['paymentInfo']>) => {
    setBookingState((prev: BookingState) => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, ...updates }
    }));
  };

  return {
    bookingState,
    setBookingState,
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
    updatePaymentInfo
  };
};
