
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import { useBookingState } from '@/hooks/booking/useBookingState';
import { useBookingViewModel } from '@/hooks/booking/useBookingViewModel';
import BookingSteps from './BookingSteps';
import StepDisplay from './StepDisplay';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModernPaystackPayment } from '@/components/payment/ModernPaystackPayment';
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

  // New payment integration using useBookingViewModel
  const {
    processPayment,
    showPaymentModal,
    setShowPaymentModal,
    isCreatingBooking,
    handlePaymentSuccess,
    handlePaymentError,
    handlePaymentModalClose,
    paymentDistribution,
    formData
  } = useBookingViewModel(property, id || '');
  
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
  
  const handleProcessPayment = async () => {
    try {
      await processPayment();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    }
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

  // For payment step, we'll render a custom component with real payment integration
  if (currentStep === 7) {
    return (
      <>
        <div className="container mx-auto p-4 md:p-8 max-w-3xl">
          <BookingSteps
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />

          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold mb-4">Payment</h2>

            {/* Enhanced Booking Summary with Payment Breakdown */}
            <div className="border p-4 rounded-lg space-y-2">
              <p className="font-medium text-lg mb-3">Booking Summary</p>
              <p className="flex justify-between"><span>Property:</span> <span className="font-medium">{property?.title}</span></p>
              <p className="flex justify-between"><span>Room Type:</span> <span>{bookingState.roomOptions.roomType}</span></p>
              <p className="flex justify-between"><span>Duration:</span> <span>{bookingState.bookingDates.duration}</span></p>
              <p className="flex justify-between"><span>Move In:</span> <span>{formatDate(bookingState.bookingDates.moveIn)}</span></p>
              <p className="flex justify-between"><span>Move Out:</span> <span>{formatDate(bookingState.bookingDates.moveOut)}</span></p>

              <hr className="my-3" />
              <p className="font-medium text-lg mb-2">Payment Breakdown</p>
              <p className="flex justify-between"><span>Property Rent:</span> <span>GH₵{paymentDistribution.basePrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Platform Commission (5%):</span> <span>GH₵{paymentDistribution.platformCommission.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Platform Fee:</span> <span>GH₵{paymentDistribution.platformFee.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Processing Fee:</span> <span>GH₵{paymentDistribution.paystackFee.toFixed(2)}</span></p>
              <p className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span className="text-green-600">GH₵{paymentDistribution.totalAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleProcessPayment}
                disabled={isCreatingBooking}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingBooking ? 'Creating Booking...' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <Dialog open={showPaymentModal} onOpenChange={handlePaymentModalClose}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Payment Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Property Rent:</span>
                      <span>GH₵{paymentDistribution.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Commission (5%):</span>
                      <span>GH₵{paymentDistribution.platformCommission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>GH₵{paymentDistribution.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>GH₵{paymentDistribution.paystackFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Total Amount:</span>
                      <span>GH₵{paymentDistribution.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Component */}
                <ModernPaystackPayment
                  amount={paymentDistribution.totalAmount}
                  email={formData.email}
                  firstName={formData.fullName.split(' ')[0]}
                  lastName={formData.fullName.split(' ').slice(1).join(' ')}
                  phone={formData.phone}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  title="Pay for Accommodation"
                  description="Secure payment via Paystack"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
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
