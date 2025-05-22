
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useBookingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Personal info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  // Booking dates
  const [bookingDates, setBookingDates] = useState({
    moveIn: new Date(),
    moveOut: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    duration: '1 semester',
  });
  
  // Room options
  const [roomOptions, setRoomOptions] = useState({
    roomType: 'single',
    furnishingOption: 'fully_furnished',
    floor: '1st',
    extraRequests: '',
  });
  
  // Roommates
  const [roommates, setRoommates] = useState([
    { name: '', email: '', phone: '' },
  ]);
  
  // Emergency contact
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    alternatePhone: '',
  });
  
  // Student verification
  const [studentVerification, setStudentVerification] = useState({
    idType: '',
    studentId: '',
    university: '',
    program: '',
    idImage: null as File | null,
    verified: false,
  });
  
  // Payment info
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'momo',
    momoNumber: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    isProcessing: false,
    isComplete: false,
  });

  // Handle personal info form changes
  const handlePersonalInfoChange = (name: string, value: string) => {
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };
  
  // Adapter for converting event-based onChange to our name/value pattern
  const handlePersonalInfoAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePersonalInfoChange(e.target.name, e.target.value);
  };
  
  // Handle date changes
  const handleDateChange = (name: string, value: Date | string) => {
    setBookingDates({
      ...bookingDates,
      [name]: value,
    });
  };
  
  // Adapter for date picker
  const handleMoveInDateAdapter = (date: Date) => {
    handleDateChange('moveIn', date);
  };
  
  const handleMoveOutDateAdapter = (date: Date) => {
    handleDateChange('moveOut', date);
  };
  
  // Handle room option changes
  const handleRoomOptionChange = (name: string, value: string) => {
    setRoomOptions({
      ...roomOptions,
      [name]: value,
    });
  };
  
  // Handle roommate changes
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommates];
    updatedRoommates[index] = {
      ...updatedRoommates[index],
      [field]: value,
    };
    setRoommates(updatedRoommates);
  };
  
  const addRoommate = () => {
    if (roommates.length < 3) {
      setRoommates([...roommates, { name: '', email: '', phone: '' }]);
    }
  };
  
  const removeRoommate = (index: number) => {
    const updatedRoommates = roommates.filter((_, i) => i !== index);
    setRoommates(updatedRoommates);
  };
  
  // Handle emergency contact changes
  const handleEmergencyContactChange = (name: string, value: string) => {
    setEmergencyContact({
      ...emergencyContact,
      [name]: value,
    });
  };
  
  // Adapter for emergency contact
  const handleEmergencyContactAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleEmergencyContactChange(e.target.name, e.target.value);
  };
  
  // Handle relationship change for emergency contact
  const handleRelationshipChange = (value: string) => {
    handleEmergencyContactChange('relationship', value);
  };
  
  // Handle student verification changes
  const handleVerificationChange = (name: string, value: string) => {
    setStudentVerification({
      ...studentVerification,
      [name]: value,
    });
  };
  
  const handleIdUpload = (file: File) => {
    setStudentVerification({
      ...studentVerification,
      idImage: file,
    });
  };
  
  const handleVerifyStudent = () => {
    setLoading(true);
    
    // Simulate verification process
    setTimeout(() => {
      setStudentVerification({
        ...studentVerification,
        verified: true,
      });
      setLoading(false);
      toast({
        title: "Verification Successful",
        description: "Your student status has been verified successfully.",
      });
    }, 2000);
  };
  
  // Handle payment method changes
  const handlePaymentChange = (name: string, value: string) => {
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  return {
    loading,
    setLoading,
    bookingComplete,
    setBookingComplete,
    personalInfo,
    bookingDates,
    roomOptions,
    roommates,
    emergencyContact,
    studentVerification,
    paymentInfo,
    handlePersonalInfoChange,
    handlePersonalInfoAdapter,
    handleDateChange,
    handleMoveInDateAdapter,
    handleMoveOutDateAdapter,
    handleRoomOptionChange,
    handleRoommateChange,
    addRoommate,
    removeRoommate,
    handleEmergencyContactChange,
    handleEmergencyContactAdapter,
    handleRelationshipChange,
    handleVerificationChange,
    handleIdUpload,
    handleVerifyStudent,
    handlePaymentChange,
    setPaymentInfo
  };
}
