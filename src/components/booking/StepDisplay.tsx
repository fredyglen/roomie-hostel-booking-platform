
import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatDate } from '@/lib/utils';

// Import step components
import PersonalInfoForm from './PersonalInfoForm';
import DatePickerStep from './DatePickerStep';
import RoomOptionsStep from './RoomOptionsStep';
import RoommatesForm from './RoommatesForm';
import EmergencyContactForm from './EmergencyContactForm';
import StudentVerification from './StudentVerification';
import PaymentStep from './PaymentStep';

interface StepDisplayProps {
  currentStep: number;
  property: any;
  formData: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    bookingDates: {
      moveIn: Date;
      moveOut: Date;
      duration: string;
    };
    roomOptions: {
      roomType: string;
      furnishingOption: string;
      floor: string;
      extraRequests: string;
    };
    roommates: Array<{ name: string; email: string; phone: string }>;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      alternatePhone: string;
    };
    studentVerification: {
      idType: string;
      studentId: string;
      university: string;
      program: string;
      idImage: File | null;
      verified: boolean;
    };
    paymentInfo: {
      method: string;
      momoNumber: string;
      cardNumber: string;
      cardExpiry: string;
      cardCvc: string;
      isProcessing: boolean;
      isComplete: boolean;
    };
  };
  handlers: {
    handlePreviousStep: () => void;
    handleNextStep: () => void;
    handlePersonalInfoAdapter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMoveInDateAdapter: (date: Date) => void;
    handleMoveOutDateAdapter: (date: Date) => void;
    handleDateChange: (name: string, value: Date | string) => void;
    handleRoomOptionChange: (name: string, value: string) => void;
    handleRoommateChange: (index: number, field: string, value: string) => void;
    addRoommate: () => void;
    removeRoommate: (index: number) => void;
    handleEmergencyContactAdapter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRelationshipChange: (value: string) => void;
    handleVerificationChange: (name: string, value: string) => void;
    handleIdUpload: (file: File) => void;
    handleVerifyStudent: () => void;
    handleProcessPayment: () => void;
    loading: boolean;
  };
}

const StepDisplay: React.FC<StepDisplayProps> = ({ 
  currentStep, 
  property, 
  formData,
  handlers 
}) => {
  const { 
    personalInfo, 
    bookingDates, 
    roomOptions, 
    roommates, 
    emergencyContact, 
    studentVerification, 
    paymentInfo 
  } = formData;
  
  const {
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
  } = handlers;

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
          startDate={bookingDates.moveIn}
          endDate={bookingDates.moveOut}
          selectedDuration="1-semester"
          onStartDateChange={handleMoveInDateAdapter}
          onEndDateChange={handleMoveOutDateAdapter}
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
          availableRoomTypes={property?.roomTypes?.map((rt: any) => rt.name) || ['single', 'double', 'triple']}
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
          onRelationshipChange={handleRelationshipChange}
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
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
        />
      );
    case 7:
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <div className="border p-4 rounded-lg">
            <p>Total Amount: ₵{property?.price || 0}</p>
            <p>Room Type: {roomOptions.roomType}</p>
            <p>Duration: {bookingDates.duration}</p>
            <p>Move In: {formatDate(bookingDates.moveIn)}</p>
            <p>Move Out: {formatDate(bookingDates.moveOut)}</p>
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button 
              type="button" 
              onClick={handleProcessPayment}
              disabled={paymentInfo.isProcessing}
            >
              {paymentInfo.isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </div>
      );
    default:
      return <div>Something went wrong</div>;
  }
};

export default StepDisplay;
