
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyLoader } from '@/hooks/property';
import BookingSteps from './BookingSteps';
import PersonalInfoForm from './PersonalInfoForm';
import DatePickerStep from './DatePickerStep';
import RoomOptionsStep from './RoomOptionsStep';
import RoommatesForm from './RoommatesForm';
import EmergencyContactForm from './EmergencyContactForm';
import StudentVerification from './StudentVerification';
import PaymentStep from './PaymentStep';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

// Fixing the BookingStepsContainer component to handle type issues
const BookingStepsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(7);
  
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Property data
  const { data: property, isLoading: propertyLoading } = usePropertyLoader({
    propertyId: id || '',
    forOwner: false,
    enabled: !!id
  });
  
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
  
  // Handle completion of current step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
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
      handleNextStep();
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
  
  const handleProcessPayment = () => {
    setPaymentInfo({
      ...paymentInfo,
      isProcessing: true,
    });
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentInfo({
        ...paymentInfo,
        isProcessing: false,
        isComplete: true,
      });
      
      setBookingComplete(true);
      
      toast({
        title: "Booking Successful!",
        description: "Your booking has been confirmed. You will receive an email with details shortly.",
      });
      
      // Redirect to booking confirmation or dashboard after a delay
      setTimeout(() => {
        navigate('/student/properties');
      }, 3000);
    }, 3000);
  };
  
  // Determine which form to show based on current step
  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            firstName={personalInfo.firstName}
            lastName={personalInfo.lastName}
            email={personalInfo.email}
            phone={personalInfo.phone}
            onInputChange={handlePersonalInfoAdapter}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <DatePickerStep
            moveInDate={bookingDates.moveIn}
            moveOutDate={bookingDates.moveOut}
            duration={bookingDates.duration}
            onMoveInDateChange={handleMoveInDateAdapter}
            onMoveOutDateChange={handleMoveOutDateAdapter}
            onDurationChange={(value) => handleDateChange('duration', value)}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <RoomOptionsStep
            selectedRoomType={roomOptions.roomType}
            selectedFurnishing={roomOptions.furnishingOption}
            selectedFloor={roomOptions.floor}
            extraRequests={roomOptions.extraRequests}
            onRoomTypeChange={(value) => handleRoomOptionChange('roomType', value)}
            onFurnishingChange={(value) => handleRoomOptionChange('furnishingOption', value)}
            onFloorChange={(value) => handleRoomOptionChange('floor', value)}
            onRequestsChange={(value) => handleRoomOptionChange('extraRequests', value)}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            availableRoomTypes={property?.roomTypes || ['single', 'double', 'triple']}
          />
        );
      case 4:
        return (
          <RoommatesForm
            roommatesList={roommates}
            onRoommateChange={handleRoommateChange}
            onAddRoommate={addRoommate}
            onRemoveRoommate={removeRoommate}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        );
      case 5:
        return (
          <EmergencyContactForm
            name={emergencyContact.name}
            relationship={emergencyContact.relationship}
            phone={emergencyContact.phone}
            alternatePhone={emergencyContact.alternatePhone}
            onInputChange={handleEmergencyContactAdapter}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
          />
        );
      case 6:
        return (
          <StudentVerification
            idType={studentVerification.idType}
            studentId={studentVerification.studentId}
            university={studentVerification.university}
            program={studentVerification.program}
            onInputChange={handleVerificationChange}
            onFileUpload={handleIdUpload}
            onVerify={handleVerifyStudent}
            isVerifying={loading}
          />
        );
      case 7:
        return (
          <PaymentStep
            price={property?.price || 0}
            roomType={roomOptions.roomType}
            duration={bookingDates.duration}
            moveInDate={formatDate(bookingDates.moveIn)}
            moveOutDate={formatDate(bookingDates.moveOut)}
            paymentMethod={paymentInfo.method}
            momoNumber={paymentInfo.momoNumber}
            cardNumber={paymentInfo.cardNumber}
            cardExpiry={paymentInfo.cardExpiry}
            cardCvc={paymentInfo.cardCvc}
            onPaymentMethodChange={(value) => handlePaymentChange('method', value)}
            onMomoNumberChange={(value) => handlePaymentChange('momoNumber', value)}
            onCardNumberChange={(value) => handlePaymentChange('cardNumber', value)}
            onCardExpiryChange={(value) => handlePaymentChange('cardExpiry', value)}
            onCardCvcChange={(value) => handlePaymentChange('cardCvc', value)}
            onPrevious={handlePreviousStep}
            onPaymentSubmit={handleProcessPayment}
            isProcessing={paymentInfo.isProcessing}
            isComplete={paymentInfo.isComplete}
          />
        );
      default:
        return <div>Something went wrong</div>;
    }
  };
  
  if (propertyLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <BookingSteps 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        bookingComplete={bookingComplete}
      />
      
      <div className="mt-8">
        {renderCurrentStepContent()}
      </div>
    </div>
  );
};

export default BookingStepsContainer;
