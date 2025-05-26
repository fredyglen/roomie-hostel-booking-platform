
import React from 'react';
import { 
  PersonalInfoStep,
  DateSelectionStep,
  RoomSelectionStep,
  RoommatesStep,
  EmergencyContactStep,
  VerificationStep
} from './steps';

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
    studentVerification
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
    loading
  } = handlers;

  const stepComponents = {
    1: (
      <PersonalInfoStep
        firstName={personalInfo.firstName}
        lastName={personalInfo.lastName}
        email={personalInfo.email}
        phone={personalInfo.phone}
        onInputChange={handlePersonalInfoAdapter}
        onNext={handleNextStep}
      />
    ),
    2: (
      <DateSelectionStep
        startDate={bookingDates.moveIn}
        endDate={bookingDates.moveOut}
        selectedDuration={bookingDates.duration}
        onStartDateChange={handleMoveInDateAdapter}
        onEndDateChange={handleMoveOutDateAdapter}
        onDurationChange={(value) => handleDateChange('duration', value)}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
      />
    ),
    3: (
      <RoomSelectionStep
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
    ),
    4: (
      <RoommatesStep
        roommatesList={roommates}
        onRoommateChange={handleRoommateChange}
        onAddRoommate={addRoommate}
        onRemoveRoommate={removeRoommate}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
      />
    ),
    5: (
      <EmergencyContactStep
        name={emergencyContact.name}
        relationship={emergencyContact.relationship}
        phone={emergencyContact.phone}
        alternatePhone={emergencyContact.alternatePhone}
        onInputChange={handleEmergencyContactAdapter}
        onRelationshipChange={handleRelationshipChange}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
      />
    ),
    6: (
      <VerificationStep
        idType={studentVerification.idType}
        studentId={studentVerification.studentId}
        university={studentVerification.university}
        program={studentVerification.program}
        onInputChange={handleVerificationChange}
        onFileUpload={handleIdUpload}
        onVerify={handleVerifyStudent}
        isVerifying={loading}
        verified={studentVerification.verified}
        onPrevious={handlePreviousStep}
        onNext={handleNextStep}
      />
    )
  };

  return stepComponents[currentStep as keyof typeof stepComponents] || <div>Invalid step</div>;
};

export default StepDisplay;
