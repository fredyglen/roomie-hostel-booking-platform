
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/common/Button';
import { Separator } from '@/components/ui/separator';
import StudentVerification from './StudentVerification';
import { toast } from 'sonner';

interface StudentVerificationStepsProps {
  studentData: any;
  onDataChange: (data: any) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

type VerificationFormData = {
  fullName: string;
  university: string;
  program: string;
  year: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  idType: string;
  idFile: File | null;
  additionalNotes: string;
  studentId: string;
};

const StudentVerificationSteps: React.FC<StudentVerificationStepsProps> = ({ 
  studentData, 
  onDataChange,
  onNextStep,
  onPrevStep
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VerificationFormData>({
    defaultValues: {
      ...studentData,
      idType: studentData.idType || 'studentId'
    }
  });

  const idFile = watch('idFile');
  const allValues = watch();

  // Mock university options
  const universities = [
    "University of Ghana",
    "KNUST",
    "UPSA",
    "University of Cape Coast",
    "Central University",
    "Ashesi University",
  ];

  // Mock year options
  const yearOptions = [
    "First Year",
    "Second Year",
    "Third Year",
    "Final Year",
    "Postgraduate"
  ];

  const handleFileChange = (file: File) => {
    setValue('idFile', file);
  };

  const handleInputChange = (name: string, value: string) => {
    setValue(name as any, value);
  };

  const handleSubStepNext = () => {
    if (currentSubStep < 4) {
      setCurrentSubStep(currentSubStep + 1);
    }
  };

  const handleSubStepBack = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1);
    } else {
      onPrevStep();
    }
  };

  const onSubmit = (data: VerificationFormData) => {
    onDataChange(data);
    onNextStep();
  };

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("Student verification successful!");
      handleSubStepNext();
    }, 2000);
  };

  // Render the appropriate sub-step
  const renderSubStep = () => {
    switch (currentSubStep) {
      case 1: // Personal Info
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <p className="text-gray-600 mb-4">Please provide your personal details.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName"
                  {...register('fullName', { required: "Full name is required" })}
                  className="mt-1"
                  placeholder="e.g. John Doe"
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="university">University</Label>
                <Select 
                  value={allValues.university} 
                  onValueChange={(value) => setValue('university', value)}
                >
                  <SelectTrigger id="university" className="mt-1">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.university && <p className="text-sm text-red-500 mt-1">{errors.university.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="program">Program of Study</Label>
                <Input 
                  id="program"
                  {...register('program', { required: "Program is required" })}
                  className="mt-1"
                  placeholder="e.g. Computer Science"
                />
                {errors.program && <p className="text-sm text-red-500 mt-1">{errors.program.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="year">Year of Study</Label>
                <Select 
                  value={allValues.year} 
                  onValueChange={(value) => setValue('year', value)}
                >
                  <SelectTrigger id="year" className="mt-1">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>}
              </div>
            </div>
          </div>
        );
        
      case 2: // Emergency Contact
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
            <p className="text-gray-600 mb-4">Please provide emergency contact details.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input 
                  id="emergencyContactName"
                  {...register('emergencyContactName', { required: "Emergency contact name is required" })}
                  className="mt-1"
                  placeholder="e.g. Jane Doe"
                />
                {errors.emergencyContactName && <p className="text-sm text-red-500 mt-1">{errors.emergencyContactName.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input 
                  id="emergencyContactPhone"
                  {...register('emergencyContactPhone', { required: "Emergency contact phone is required" })}
                  className="mt-1"
                  placeholder="e.g. +233 50 123 4567"
                />
                {errors.emergencyContactPhone && <p className="text-sm text-red-500 mt-1">{errors.emergencyContactPhone.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="emergencyRelationship">Relationship to Emergency Contact</Label>
                <Input 
                  id="emergencyRelationship"
                  {...register('emergencyRelationship', { required: "Relationship is required" })}
                  className="mt-1"
                  placeholder="e.g. Parent, Sibling, Spouse"
                />
                {errors.emergencyRelationship && <p className="text-sm text-red-500 mt-1">{errors.emergencyRelationship.message}</p>}
              </div>
            </div>
          </div>
        );
        
      case 3: // Student Verification
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Verification</h3>
            <p className="text-gray-600 mb-4">Please verify your student status by uploading your ID document.</p>
            
            <StudentVerification
              idType={allValues.idType || 'studentId'}
              studentId={allValues.studentId}
              university={allValues.university}
              program={allValues.program}
              onInputChange={handleInputChange}
              onFileUpload={handleFileChange}
              onVerify={handleVerify}
              isVerifying={isVerifying}
            />
          </div>
        );
        
      case 4: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <p className="text-gray-600 mb-4">Please review your information before submitting.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <p>Full Name: <span className="font-medium">{allValues.fullName}</span></p>
                <p>University: <span className="font-medium">{allValues.university}</span></p>
                <p>Program: <span className="font-medium">{allValues.program}</span></p>
                <p>Year of Study: <span className="font-medium">{allValues.year}</span></p>
                <p>Student ID: <span className="font-medium">{allValues.studentId}</span></p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Emergency Contact</h4>
                <p>Name: <span className="font-medium">{allValues.emergencyContactName}</span></p>
                <p>Phone: <span className="font-medium">{allValues.emergencyContactPhone}</span></p>
                <p>Relationship: <span className="font-medium">{allValues.emergencyRelationship}</span></p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Verification Document</h4>
                <p>ID Type: <span className="font-medium">
                  {allValues.idType === 'studentId' ? 'Student ID Card' :
                   allValues.idType === 'nationalId' ? 'National ID' :
                   allValues.idType === 'passport' ? 'Passport' : 
                   allValues.idType === 'driverLicense' ? 'Driver\'s License' : 'Not selected'}
                </span></p>
                <p>Document: <span className="font-medium">{idFile ? idFile.name : 'No file uploaded'}</span></p>
                {allValues.additionalNotes && (
                  <>
                    <h5 className="font-medium mt-2">Additional Notes:</h5>
                    <p className="text-gray-600 text-sm">{allValues.additionalNotes}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Sub-steps progress indicator */}
      <div className="flex justify-between mb-6">
        {['Personal Info', 'Emergency Contact', 'Verification', 'Review'].map((step, index) => (
          <div 
            key={index} 
            className={`flex items-center ${index < currentSubStep ? 'text-roomi-blue' : 'text-gray-400'}`}
            onClick={() => index + 1 <= currentSubStep && setCurrentSubStep(index + 1)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 === currentSubStep ? 'bg-roomi-blue text-white' : 
              index + 1 < currentSubStep ? 'bg-roomi-teal text-white' : 'bg-gray-200'
            }`}>
              {index + 1 < currentSubStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`ml-2 text-sm ${index + 1 === currentSubStep ? 'font-medium' : ''} hidden md:inline`}>{step}</span>
          </div>
        ))}
      </div>
      
      {/* Current sub-step content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderSubStep()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleSubStepBack}
          >
            Back
          </Button>
          
          {currentSubStep === 3 ? (
            null // Button is handled by StudentVerification component
          ) : currentSubStep < 4 ? (
            <Button 
              type="button" 
              variant="primary"
              onClick={handleSubStepNext}
            >
              Continue
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="primary"
            >
              Submit & Continue
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentVerificationSteps;
