
import React from 'react';
import EmergencyContactForm from '../EmergencyContactForm';

interface EmergencyContactStepProps {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRelationshipChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  name,
  relationship,
  phone,
  alternatePhone,
  onInputChange,
  onRelationshipChange,
  onPrevious,
  onNext
}) => {
  return (
    <EmergencyContactForm
      name={name}
      relationship={relationship}
      phone={phone}
      alternatePhone={alternatePhone}
      onInputChange={onInputChange}
      onRelationshipChange={onRelationshipChange}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
};

export default EmergencyContactStep;
