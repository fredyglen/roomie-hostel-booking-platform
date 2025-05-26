
import React from 'react';
import StudentVerification from '../StudentVerification';

interface VerificationStepProps {
  idType: string;
  studentId: string;
  university: string;
  program: string;
  onInputChange: (name: string, value: string) => void;
  onFileUpload: (file: File) => void;
  onVerify: () => void;
  isVerifying: boolean;
  verified: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  idType,
  studentId,
  university,
  program,
  onInputChange,
  onFileUpload,
  onVerify,
  isVerifying,
  verified,
  onPrevious,
  onNext
}) => {
  return (
    <StudentVerification
      idType={idType}
      studentId={studentId}
      university={university}
      program={program}
      onInputChange={onInputChange}
      onFileUpload={onFileUpload}
      onVerify={onVerify}
      isVerifying={isVerifying}
      verified={verified}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
};

export default VerificationStep;
