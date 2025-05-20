import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import BookingSteps from '@/components/booking/BookingSteps';
import RoomTypeSelection from '@/components/booking/RoomTypeSelection';
import DurationSelection from '@/components/booking/DurationSelection';
import PersonalInfoForm from '@/components/booking/PersonalInfoForm';
import EmergencyContactForm from '@/components/booking/EmergencyContactForm';
import StudentVerification from '@/components/booking/StudentVerification';
import BookingSummary from '@/components/booking/BookingSummary';
import PaymentOptions from '@/components/booking/PaymentOptions';
import { useBookingViewModel, STEP_LABELS } from '@/components/booking/BookingViewModel';

const BookingStepsContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    property,
    currentStep,
    formData,
    selectedPaymentMethod,
    selectedPrice,
    selectedUnit,
    totalPrice,
    handleInputChange,
    handleCheckboxChange,
    handleNext,
    handleBack,
    setSelectedPaymentMethod
  } = useBookingViewModel();
  
  if (!property) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/student/properties')}>
          Browse Properties
        </Button>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Choose Room Type</h2>
            <RoomTypeSelection 
              roomTypes={property.roomTypes || []}
              selectedRoomType={formData.roomType}
              onSelectRoomType={(roomTypeName) => {
                handleInputChange({
                  target: { name: 'roomType', value: roomTypeName }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
          </div>
        );
      
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Select Duration and Date</h2>
            <DurationSelection 
              duration={formData.duration}
              durationType={formData.durationType}
              checkInDate={formData.checkInDate}
              onInputChange={handleInputChange}
            />
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <PersonalInfoForm 
              fullName={formData.fullName}
              phone={formData.phone}
              email={formData.email}
              onInputChange={handleInputChange}
            />
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Emergency Contact</h2>
            <EmergencyContactForm 
              emergencyContact={formData.emergencyContact}
              emergencyPhone={formData.emergencyPhone}
              onInputChange={handleInputChange}
            />
          </div>
        );
      
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Student Verification</h2>
            <StudentVerification 
              idType={formData.idType}
              onInputChange={handleInputChange}
            />
          </div>
        );
      
      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <BookingSummary 
              propertyTitle={property.title}
              propertyImage={property.image || ''}
              roomType={formData.roomType}
              duration={formData.duration}
              durationType={formData.durationType}
              checkInDate={formData.checkInDate}
              fullName={formData.fullName}
              price={selectedPrice}
              priceUnit={selectedUnit}
              termsAgreed={formData.termsAgreed}
              onCheckboxChange={(name, checked) => {
                handleCheckboxChange({
                  target: { name, checked }
                } as React.ChangeEvent<HTMLInputElement>)
              }}
            />
          </div>
        );
      
      case 7:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            <PaymentOptions 
              totalPrice={totalPrice}
              selectedPaymentMethod={selectedPaymentMethod}
              onSelectPaymentMethod={setSelectedPaymentMethod}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Book {property.title}</h1>
        <p className="text-gray-600">{property.address}</p>
      </div>
      
      {/* Progress Steps */}
      <BookingSteps 
        currentStep={currentStep}
        totalSteps={7}
        stepLabels={STEP_LABELS}
      />
      
      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={currentStep === 6 && !formData.termsAgreed}
          >
            {currentStep === 7 ? 'Make Payment' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingStepsContainer;
