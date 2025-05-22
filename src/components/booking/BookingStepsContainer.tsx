
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyLoader } from '@/hooks/property';
import { useBookingForm } from '@/hooks/booking';
import BookingSteps from './BookingSteps';
import StepDisplay from './StepDisplay';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const BookingStepsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(7);
  const [stepLabels] = useState([
    'Personal Info',
    'Dates',
    'Room Type',
    'Roommates',
    'Emergency',
    'Verification', 
    'Payment'
  ]);
  
  // Property data
  const { data: property, isLoading: propertyLoading } = usePropertyLoader({
    propertyId: id || '',
    forOwner: false,
    enabled: !!id
  });
  
  // Use our custom hook for form state and handlers
  const bookingForm = useBookingForm();
  
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
  
  const handleProcessPayment = () => {
    bookingForm.setPaymentInfo({
      ...bookingForm.paymentInfo,
      isProcessing: true,
    });
    
    // Simulate payment processing
    setTimeout(() => {
      bookingForm.setPaymentInfo({
        ...bookingForm.paymentInfo,
        isProcessing: false,
        isComplete: true,
      });
      
      bookingForm.setBookingComplete(true);
      
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
  
  // Prepare the form data object to pass to StepDisplay
  const formData = {
    personalInfo: bookingForm.personalInfo,
    bookingDates: bookingForm.bookingDates,
    roomOptions: bookingForm.roomOptions,
    roommates: bookingForm.roommates,
    emergencyContact: bookingForm.emergencyContact,
    studentVerification: bookingForm.studentVerification,
    paymentInfo: bookingForm.paymentInfo
  };
  
  // Prepare handlers to pass to StepDisplay
  const handlers = {
    handlePreviousStep,
    handleNextStep,
    handlePersonalInfoAdapter: bookingForm.handlePersonalInfoAdapter,
    handleMoveInDateAdapter: bookingForm.handleMoveInDateAdapter,
    handleMoveOutDateAdapter: bookingForm.handleMoveOutDateAdapter,
    handleDateChange: bookingForm.handleDateChange,
    handleRoomOptionChange: bookingForm.handleRoomOptionChange,
    handleRoommateChange: bookingForm.handleRoommateChange,
    addRoommate: bookingForm.addRoommate,
    removeRoommate: bookingForm.removeRoommate,
    handleEmergencyContactAdapter: bookingForm.handleEmergencyContactAdapter,
    handleRelationshipChange: bookingForm.handleRelationshipChange,
    handleVerificationChange: bookingForm.handleVerificationChange,
    handleIdUpload: bookingForm.handleIdUpload,
    handleVerifyStudent: bookingForm.handleVerifyStudent,
    handleProcessPayment,
    loading: bookingForm.loading
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
            <p className="flex justify-between"><span>Room Type:</span> <span>{bookingForm.roomOptions.roomType}</span></p>
            <p className="flex justify-between"><span>Duration:</span> <span>{bookingForm.bookingDates.duration}</span></p>
            <p className="flex justify-between"><span>Move In:</span> <span>{formatDate(bookingForm.bookingDates.moveIn)}</span></p>
            <p className="flex justify-between"><span>Move Out:</span> <span>{formatDate(bookingForm.bookingDates.moveOut)}</span></p>
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button 
              type="button" 
              onClick={handleProcessPayment}
              disabled={bookingForm.paymentInfo.isProcessing}
            >
              {bookingForm.paymentInfo.isProcessing ? 'Processing...' : 'Complete Payment'}
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
          formData={formData}
          handlers={handlers}
        />
      </div>
    </div>
  );
};

export default BookingStepsContainer;
