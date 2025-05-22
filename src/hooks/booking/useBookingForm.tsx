
import { useState } from 'react';
import { usePersonalInfoForm } from './usePersonalInfoForm';
import { useDatesForm } from './useDatesForm';
import { useRoomOptionsForm } from './useRoomOptionsForm';
import { useRoommatesForm } from './useRoommatesForm';
import { useEmergencyContactForm } from './useEmergencyContactForm';
import { useStudentVerificationForm } from './useStudentVerificationForm';
import { usePaymentForm } from './usePaymentForm';

export const useBookingForm = () => {
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const personalInfoForm = usePersonalInfoForm();
  const datesForm = useDatesForm();
  const roomOptionsForm = useRoomOptionsForm();
  const roommatesForm = useRoommatesForm();
  const emergencyContactForm = useEmergencyContactForm();
  const studentVerificationForm = useStudentVerificationForm();
  const paymentForm = usePaymentForm();
  
  return {
    // Personal Info
    personalInfo: personalInfoForm.personalInfo,
    handlePersonalInfoAdapter: personalInfoForm.handlePersonalInfoAdapter,
    
    // Booking Dates
    bookingDates: datesForm.bookingDates,
    handleMoveInDateAdapter: datesForm.handleMoveInDateAdapter,
    handleMoveOutDateAdapter: datesForm.handleMoveOutDateAdapter,
    handleDateChange: datesForm.handleDateChange,
    
    // Room Options
    roomOptions: roomOptionsForm.roomOptions,
    handleRoomOptionChange: roomOptionsForm.handleRoomOptionChange,
    
    // Roommates
    roommates: roommatesForm.roommates,
    handleRoommateChange: roommatesForm.handleRoommateChange,
    addRoommate: roommatesForm.addRoommate,
    removeRoommate: roommatesForm.removeRoommate,
    
    // Emergency Contact
    emergencyContact: emergencyContactForm.emergencyContact,
    handleEmergencyContactAdapter: emergencyContactForm.handleEmergencyContactAdapter,
    handleRelationshipChange: emergencyContactForm.handleRelationshipChange,
    
    // Student Verification
    studentVerification: studentVerificationForm.studentVerification,
    handleVerificationChange: studentVerificationForm.handleVerificationChange,
    handleIdUpload: studentVerificationForm.handleIdUpload,
    handleVerifyStudent: studentVerificationForm.handleVerifyStudent,
    loading: studentVerificationForm.loading,
    
    // Payment Info
    paymentInfo: paymentForm.paymentInfo,
    setPaymentInfo: paymentForm.setPaymentInfo,
    
    // Booking Status
    bookingComplete,
    setBookingComplete
  };
};
