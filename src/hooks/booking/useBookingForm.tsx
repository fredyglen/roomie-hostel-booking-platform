
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface PaymentInfo {
  method: string;
  momoNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  isProcessing: boolean;
  isComplete: boolean;
}

export const useBookingForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Personal Information
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Dates
  const [bookingDates, setBookingDates] = useState<BookingDates>({
    moveIn: new Date(),
    moveOut: new Date(new Date().setMonth(new Date().getMonth() + 4)), // Default 4 months
    duration: '1 semester'
  });
  
  // Room Options
  const [roomOptions, setRoomOptions] = useState<RoomOptions>({
    roomType: 'single',
    furnishingOption: 'fully_furnished',
    floor: '1st',
    extraRequests: ''
  });
  
  // Roommates
  const [roommates, setRoommates] = useState<Roommate[]>([
    {
      name: '',
      email: '',
      phone: ''
    }
  ]);
  
  // Emergency Contact
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: '',
    relationship: 'parent',
    phone: '',
    alternatePhone: ''
  });
  
  // Student Verification
  const [studentVerification, setStudentVerification] = useState<StudentVerification>({
    idType: 'studentId',
    studentId: '',
    university: '',
    program: '',
    idImage: null,
    verified: false
  });
  
  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: '',
    momoNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    isProcessing: false,
    isComplete: false
  });
  
  // Handlers for Personal Information
  const handlePersonalInfoAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handlers for Dates
  const handleMoveInDateAdapter = (date: Date) => {
    setBookingDates(prev => ({
      ...prev,
      moveIn: date
    }));
  };
  
  const handleMoveOutDateAdapter = (date: Date) => {
    setBookingDates(prev => ({
      ...prev,
      moveOut: date
    }));
  };
  
  const handleDateChange = (name: string, value: Date | string) => {
    setBookingDates(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handlers for Room Options
  const handleRoomOptionChange = (name: string, value: string) => {
    setRoomOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handlers for Roommates
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommates];
    updatedRoommates[index] = {
      ...updatedRoommates[index],
      [field]: value
    };
    setRoommates(updatedRoommates);
  };
  
  const addRoommate = () => {
    if (roommates.length < 3) {
      setRoommates([...roommates, { name: '', email: '', phone: '' }]);
    } else {
      toast({
        title: "Maximum roommates reached",
        description: "You can add a maximum of 3 roommates.",
        variant: "destructive"
      });
    }
  };
  
  const removeRoommate = (index: number) => {
    if (index > 0) {
      setRoommates(roommates.filter((_, i) => i !== index));
    }
  };
  
  // Handlers for Emergency Contact
  const handleEmergencyContactAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmergencyContact(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRelationshipChange = (value: string) => {
    setEmergencyContact(prev => ({
      ...prev,
      relationship: value
    }));
  };
  
  // Handlers for Student Verification
  const handleVerificationChange = (name: string, value: string) => {
    setStudentVerification(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleIdUpload = (file: File) => {
    setStudentVerification(prev => ({
      ...prev,
      idImage: file
    }));
  };
  
  const handleVerifyStudent = async () => {
    setLoading(true);
    
    // Simulate API call for verification
    try {
      // In a real implementation, this would be an API call to verify the student
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStudentVerification(prev => ({
        ...prev,
        verified: true
      }));
      
      toast({
        title: "Verification successful",
        description: "Your student status has been verified.",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Failed to verify your student status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    personalInfo,
    bookingDates,
    roomOptions,
    roommates,
    emergencyContact,
    studentVerification,
    paymentInfo,
    loading,
    bookingComplete,
    setPaymentInfo,
    setBookingComplete,
    handlePersonalInfoAdapter,
    handleMoveInDateAdapter,
    handleMoveOutDateAdapter,
    handleDateChange,
    handleRoomOptionChange,
    handleRoommateChange,
    addRoommate,
    removeRoommate,
    handleEmergencyContactAdapter,
    handleRelationshipChange,
    handleVerificationChange,
    handleIdUpload,
    handleVerifyStudent
  };
};
