import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { Booking } from '@/types/booking';
import { useBookingService } from '@/services/booking/useBookingService';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BookingDates {
  moveIn: Date;
  moveOut: Date;
  duration: string;
}

interface RoomOptions {
  roomType: string;
  furnishingOption: string;
  floor: string;
  extraRequests: string;
}

interface Roommate {
  name: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
}

interface StudentVerification {
  idType: string;
  studentId: string;
  university: string;
  program: string;
  idImage: File | null;
  verified: boolean;
}

interface FormData {
  personalInfo: PersonalInfo;
  bookingDates: BookingDates;
  roomOptions: RoomOptions;
  roommates: Roommate[];
  emergencyContact: EmergencyContact;
  studentVerification: StudentVerification;
}

export const useBookingViewModel = (property: Property) => {
  const { createBooking, isLoading } = useBookingService();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    bookingDates: {
      moveIn: new Date(),
      moveOut: new Date(),
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
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleDateChange = (name: string, value: Date | string) => {
    setFormData(prev => ({
      ...prev,
      bookingDates: {
        ...prev.bookingDates,
        [name]: value,
      },
    }));
  };

  const handleRoomOptionChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      roomOptions: {
        ...prev.roomOptions,
        [name]: value,
      },
    }));
  };

  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...formData.roommates];
    updatedRoommates[index] = { ...updatedRoommates[index], [field]: value };
    setFormData(prev => ({ ...prev, roommates: updatedRoommates }));
  };

  const addRoommate = () => {
    setFormData(prev => ({
      ...prev,
      roommates: [...prev.roommates, { name: '', email: '', phone: '' }],
    }));
  };

  const removeRoommate = (index: number) => {
    const updatedRoommates = [...formData.roommates];
    updatedRoommates.splice(index, 1);
    setFormData(prev => ({ ...prev, roommates: updatedRoommates }));
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };

  const handleRelationshipChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        relationship: value,
      },
    }));
  };

  const handleVerificationChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      studentVerification: {
        ...prev.studentVerification,
        [name]: value,
      },
    }));
  };

  const handleIdUpload = (file: File) => {
    setFormData(prev => ({
      ...prev,
      studentVerification: {
        ...prev.studentVerification,
        idImage: file,
      },
    }));
  };

  const handleVerifyStudent = async () => {
    setIsVerificationLoading(true);
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFormData(prev => ({
      ...prev,
      studentVerification: {
        ...prev.studentVerification,
        verified: true,
      },
    }));
    setIsVerificationLoading(false);
  };

  const validateForm = (): boolean => {
    // Implement your form validation logic here
    return true;
  };

  const calculateTotal = (): number => {
    // Implement your total calculation logic here
    return 1000;
  };

  const handleSubmitBooking = async () => {
    if (!validateForm()) return;

    try {
      const bookingData = {
        property_id: property.id,
        start_date: formData.bookingDates.moveIn.toISOString().split('T')[0],
        end_date: formData.bookingDates.moveOut.toISOString().split('T')[0],
        guest_count: 1,
        special_requests: formData.roomOptions.extraRequests,
        total_amount: calculateTotal()
      };

      await createBooking.mutateAsync(bookingData);
      
      // Handle success
      ErrorHandler.log('Booking created successfully');
      
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to submit booking');
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    submissionError,
    isVerificationLoading,
    nextStep,
    prevStep,
    handlePersonalInfoChange,
    handleDateChange,
    handleRoomOptionChange,
    handleRoommateChange,
    addRoommate,
    removeRoommate,
    handleEmergencyContactChange,
    handleRelationshipChange,
    handleVerificationChange,
    handleIdUpload,
    handleVerifyStudent,
    handleSubmitBooking,
    isLoading
  };
};
