// Enhanced Booking Form for ROOMi Ghana Hostel Bookings
// Integrates with BookingService and Paystack payment processing

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { useEnhancedBooking } from '@/hooks/booking/useEnhancedBooking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, CreditCard, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

// Import step components
import PersonalInfoStep from './steps/PersonalInfoStep';
import DateSelectionStep from './steps/DateSelectionStep';
import RoomSelectionStep from './steps/RoomSelectionStep';
import RoommatesStep from './steps/RoommatesStep';
import EmergencyContactStep from './steps/EmergencyContactStep';
import VerificationStep from './steps/VerificationStep';
import PaymentStep from './PaymentStep';

interface EnhancedBookingFormProps {
  property: Property;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
}

// Interface moved to useEnhancedBooking hook

const STEPS = [
  { id: 1, title: 'Personal Info', icon: Users },
  { id: 2, title: 'Dates', icon: Calendar },
  { id: 3, title: 'Room Selection', icon: Users },
  { id: 4, title: 'Roommates', icon: Users },
  { id: 5, title: 'Emergency Contact', icon: Users },
  { id: 6, title: 'Verification', icon: CheckCircle },
  { id: 7, title: 'Payment', icon: CreditCard }
];

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  property,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();

  // Use our enhanced booking hook with Apple-Level payment-first flow
  const {
    formData,
    currentStep,
    loading,
    error,
    pricing,
    updateFormData,
    nextStep,
    previousStep,
    addRoommate,
    removeRoommate,
    updateRoommate,
    validateStep,
    processPaymentFirstBooking
  } = useEnhancedBooking(property);

  const [isVerifying, setIsVerifying] = useState(false);

  // Handler functions
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleDateChange = (field: string, value: Date | string) => {
    updateFormData(field, value);
  };

  const handleRoomOptionChange = (field: string, value: string) => {
    updateFormData(field, value);
  };

  const handleRoommateChange = (roommates: any[]) => {
    updateFormData('roommates', roommates);
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    updateFormData(field, value);
  };

  const handleVerificationChange = (field: string, value: string | File | boolean) => {
    updateFormData(field, value);
  };

  const handleVerifyStudent = async () => {
    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateFormData('verified', true);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  /**
   * Apple-Level Payment Processing Handler
   *
   * Business Purpose: Processes payment BEFORE booking creation to ensure financial integrity
   * This implements the correct flow: Payment Success → Booking Creation → Confirmation
   *
   * Technical Implementation: Uses PaymentFirstBookingService for comprehensive
   * payment processing and booking creation with proper error handling
   *
   * Critical for Revenue Protection: Prevents phantom bookings and ensures audit trails
   */
  const handlePaymentProceed = async () => {
    try {
      // Process payment-first booking with Apple-Level service
      const result = await processPaymentFirstBooking();

      if (result.success && result.bookingId) {
        // Payment successful and booking created
        if (onSuccess) {
          onSuccess(result.bookingId);
        } else {
          navigate(`/student/booking-confirmation?id=${result.bookingId}`, {
            state: {
              confirmationNumber: result.confirmationNumber,
              paymentReference: result.paymentReference
            }
          });
        }
      } else {
        // Payment or booking failed - error already handled by service
        console.error('Payment-first booking failed:', result.error);
      }
    } catch (error) {
      console.error('Critical error in payment processing:', error);
      // Error handling is managed by the service and hook
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            phone={formData.phone}
            onInputChange={handlePersonalInfoChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <DateSelectionStep
            startDate={formData.startDate}
            endDate={formData.endDate}
            selectedDuration={formData.duration}
            onStartDateChange={(date) => handleDateChange('startDate', date)}
            onEndDateChange={(date) => handleDateChange('endDate', date)}
            onDurationChange={(duration) => handleDateChange('duration', duration)}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <RoomSelectionStep
            selectedRoomType={formData.roomType}
            selectedFurnishing={formData.furnishing}
            selectedFloor={formData.floor}
            extraRequests={formData.extraRequests}
            onRoomTypeChange={(value) => handleRoomOptionChange('roomType', value)}
            onFurnishingChange={(value) => handleRoomOptionChange('furnishing', value)}
            onFloorChange={(value) => handleRoomOptionChange('floor', value)}
            onRequestsChange={(value) => handleRoomOptionChange('extraRequests', value)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            availableRoomTypes={[]}
          />
        );
      case 4:
        return (
          <RoommatesStep
            roommates={formData.roommates}
            onRoommatesChange={handleRoommateChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <EmergencyContactStep
            name={formData.emergencyName}
            phone={formData.emergencyPhone}
            relationship={formData.emergencyRelationship}
            onInputChange={handleEmergencyContactChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <VerificationStep
            idType={formData.idType}
            studentId={formData.studentId}
            university={formData.university}
            program={formData.program}
            onInputChange={handleVerificationChange}
            onFileUpload={(file) => updateFormData('idImage', file)}
            onVerify={handleVerifyStudent}
            isVerifying={isVerifying}
            verified={formData.verified}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 7:
        return (
          <PaymentStep
            totalAmount={pricing.totalAmount}
            onPaymentMethodSelect={(method) => updateFormData('paymentMethod', method)}
            termsAgreed={formData.termsAgreed}
            onTermsChange={(agreed) => updateFormData('termsAgreed', agreed)}
            onPaymentProceed={handlePaymentProceed}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Book {property.title}</h1>
            <p className="text-gray-600">{property.address}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle size={20} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Property Rent</span>
                  <span>₵{pricing.propertyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (5%)</span>
                  <span>₵{pricing.platformCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>₵{pricing.platformFixedFee.toLocaleString()}</span>
                </div>
                {pricing.agentFee > 0 && (
                  <div className="flex justify-between">
                    <span>Agent Fee</span>
                    <span>₵{pricing.agentFee.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₵{pricing.totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Duration: {formData.duration}</p>
                {formData.roomType && <p>Room: {formData.roomType}</p>}
                {formData.roommates.length > 0 && (
                  <p>Roommates: {formData.roommates.length}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBookingForm;
