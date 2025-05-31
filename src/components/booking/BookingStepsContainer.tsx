
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import { useBookingState } from '@/hooks/booking/useBookingState';
import BookingSteps from './BookingSteps';
import StepDisplay from './StepDisplay';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const BookingStepsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const totalSteps = 7;
  const stepLabels = [
    'Personal Info',
    'Dates',
    'Room Type',
    'Roommates',
    'Emergency',
    'Verification', 
    'Payment'
  ];
  
  // Property data - using the correct hook
  const { getPropertyById } = usePropertyData();
  const [property, setProperty] = React.useState(null);
  const [propertyLoading, setPropertyLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadProperty = async () => {
      if (id) {
        setPropertyLoading(true);
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
        setPropertyLoading(false);
      }
    };
    loadProperty();
  }, [id, getPropertyById]);
  
  // Centralized booking state
  const {
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
    updatePaymentInfo
  } = useBookingState(id);
  
  // Handler functions
  const handlePersonalInfoAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo(name, value);
  };
  
  const handleMoveInDateAdapter = (date: Date) => {
    updateBookingDates('moveIn', date);
  };
  
  const handleMoveOutDateAdapter = (date: Date) => {
    updateBookingDates('moveOut', date);
  };
  
  const handleDateChange = (name: string, value: Date | string) => {
    updateBookingDates(name, value);
  };
  
  const handleRoomOptionChange = (name: string, value: string) => {
    updateRoomOptions(name, value);
  };
  
  const handleRoommateChange = (index: number, field: string, value: string) => {
    updateRoommate(index, field, value);
  };
  
  const handleEmergencyContactAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateEmergencyContact(name, value);
  };
  
  const handleRelationshipChange = (value: string) => {
    updateEmergencyContact('relationship', value);
  };
  
  const handleVerificationChange = (name: string, value: string) => {
    updateStudentVerification(name, value);
  };
  
  const handleIdUpload = (file: File) => {
    updateStudentVerification('idImage', file);
  };
  
  const handleVerifyStudent = () => {
    setLoading(true);
    // Simulate verification process
    setTimeout(() => {
      updateStudentVerification('verified', true);
      setLoading(false);
      toast({
        title: "Verification Successful",
        description: "Your student status has been verified.",
      });
    }, 2000);
  };
  
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
  
  const handleProcessPayment = () => {
    updatePaymentInfo({ isProcessing: true });
    
    // Simulate payment processing
    setTimeout(() => {
      updatePaymentInfo({
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
  
  if (propertyLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  // Prepare handlers to pass to StepDisplay
  const handlers = {
    handlePreviousStep,
    handleNextStep,
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
    handleVerifyStudent,
    handleProcessPayment,
    loading
  };

  // For payment step, we'll render a custom component
  if (currentStep === 7) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <BookingSteps 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          stepLabels={stepLabels}
        />
        
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <div className="border p-4 rounded-lg space-y-2">
            <p className="font-medium">Booking Summary</p>
            <p className="flex justify-between"><span>Property:</span> <span className="font-medium">{property?.title}</span></p>
            <p className="flex justify-between"><span>Total Amount:</span> <span className="font-medium">₵{property?.price || 0}</span></p>
            <p className="flex justify-between"><span>Room Type:</span> <span>{bookingState.roomOptions.roomType}</span></p>
            <p className="flex justify-between"><span>Duration:</span> <span>{bookingState.bookingDates.duration}</span></p>
            <p className="flex justify-between"><span>Move In:</span> <span>{formatDate(bookingState.bookingDates.moveIn)}</span></p>
            <p className="flex justify-between"><span>Move Out:</span> <span>{formatDate(bookingState.bookingDates.moveOut)}</span></p>
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button 
              type="button" 
              onClick={handleProcessPayment}
              disabled={bookingState.paymentInfo.isProcessing}
            >
              {bookingState.paymentInfo.isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <BookingSteps 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        stepLabels={stepLabels}
      />
      
      <div className="mt-8">
        <StepDisplay 
          currentStep={currentStep} 
          property={property}
          formData={bookingState}
          handlers={handlers}
        />
      </div>
    </div>
  );
};

export default BookingStepsContainer;
