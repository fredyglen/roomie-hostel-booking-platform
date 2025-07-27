
import React from 'react';
import { 
  PersonalInfoStep,
  DateSelectionStep,
  RoomSelectionStep,
  RoommatesStep,
  EmergencyContactStep,
  VerificationStep
} from './steps';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Property } from '@/types/property';

interface StepDisplayProps {
  currentStep: number;
  property: Property;
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
        firstName={formData.personalInfo.firstName}
        lastName={formData.personalInfo.lastName}
        email={formData.personalInfo.email}
        phone={formData.personalInfo.phone}
        onInputChange={handlers.handlePersonalInfoAdapter}
        onNext={handlers.handleNextStep}
      />
    ),
    2: (
      <DateSelectionStep
        startDate={formData.bookingDates.moveIn}
        endDate={formData.bookingDates.moveOut}
        selectedDuration={formData.bookingDates.duration}
        onStartDateChange={handlers.handleMoveInDateAdapter}
        onEndDateChange={handlers.handleMoveOutDateAdapter}
        onDurationChange={(value) => handlers.handleDateChange('duration', value)}
        onPrevious={handlers.handlePreviousStep}
        onNext={handlers.handleNextStep}
      />
    ),
    3: (
      <RoomSelectionStep
        selectedRoomType={formData.roomOptions.roomType}
        selectedFloor={formData.roomOptions.floor}
        extraRequests={formData.roomOptions.extraRequests}
        onRoomTypeChange={(value) => handlers.handleRoomOptionChange('roomType', value)}
        onFloorChange={(value) => handlers.handleRoomOptionChange('floor', value)}
        onRequestsChange={(value) => handlers.handleRoomOptionChange('extraRequests', value)}
        onPrevious={handlers.handlePreviousStep}
        onNext={handlers.handleNextStep}
        // ✅ PRODUCTION-GRADE: Dynamic room types from owner configuration
        propertyId={property.id}
        propertyCategory={property.property_category || property.propertyCategory}
      />
    ),
    4: (
      <RoommatesStep
        roommatesList={formData.roommates}
        onRoommateChange={handlers.handleRoommateChange}
        onAddRoommate={handlers.addRoommate}
        onRemoveRoommate={handlers.removeRoommate}
        onPrevious={handlers.handlePreviousStep}
        onNext={handlers.handleNextStep}
      />
    ),
    5: (
      <EmergencyContactStep
        name={formData.emergencyContact.name}
        relationship={formData.emergencyContact.relationship}
        phone={formData.emergencyContact.phone}
        alternatePhone={formData.emergencyContact.alternatePhone}
        onInputChange={handlers.handleEmergencyContactAdapter}
        onRelationshipChange={handlers.handleRelationshipChange}
        onPrevious={handlers.handlePreviousStep}
        onNext={handlers.handleNextStep}
      />
    ),
    6: (
      <VerificationStep
        idType={formData.studentVerification.idType}
        studentId={formData.studentVerification.studentId}
        university={formData.studentVerification.university}
        program={formData.studentVerification.program}
        onInputChange={handlers.handleVerificationChange}
        onFileUpload={handlers.handleIdUpload}
        onVerify={handlers.handleVerifyStudent}
        isVerifying={handlers.loading}
        verified={formData.studentVerification.verified}
        onPrevious={handlers.handlePreviousStep}
        onNext={handlers.handleNextStep}
      />
    )
  };

  const handleStepChange = (step: number) => {
    try {
      // Implement the logic to handle step change
    } catch (error) {
      ErrorHandler.handle(error, 'StepDisplay.handleStepChange');
    }
  };

  return stepComponents[currentStep as keyof typeof stepComponents] || <div>Invalid step</div>;
};

export default StepDisplay;
