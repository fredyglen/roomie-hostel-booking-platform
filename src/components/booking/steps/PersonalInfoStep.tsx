
import React from 'react';
import PersonalInfoForm from '../PersonalInfoForm';

interface PersonalInfoStepProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  firstName,
  lastName,
  email,
  phone,
  onInputChange,
  onNext
}) => {
  return (
    <PersonalInfoForm
      firstName={firstName}
      lastName={lastName}
      email={email}
      phone={phone}
      onInputChange={onInputChange}
      onNext={onNext}
    />
  );
};

export default PersonalInfoStep;
