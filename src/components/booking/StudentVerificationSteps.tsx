
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/common/Button';
import { Separator } from '@/components/ui/separator';

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
};

const StudentVerificationSteps: React.FC<StudentVerificationStepsProps> = ({ 
  studentData, 
  onDataChange,
  onNextStep,
  onPrevStep
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VerificationFormData>({
    defaultValues: {
      ...studentData
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('idFile', e.target.files[0]);
    }
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
        
      case 3: // Proof
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Student Verification</h3>
            <p className="text-gray-600 mb-4">Please upload your Student ID or proof of registration.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="idType">ID Type</Label>
                <Select 
                  value={allValues.idType} 
                  onValueChange={(value) => setValue('idType', value)}
                >
                  <SelectTrigger id="idType" className="mt-1">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student_id">Student ID Card</SelectItem>
                    <SelectItem value="admission_letter">Admission Letter</SelectItem>
                    <SelectItem value="registration_receipt">Registration Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="idFile">Upload ID Document</Label>
                <div className="mt-1 border-2 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-roomi-blue hover:text-roomi-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-roomi-blue">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*,application/pdf"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
                {idFile && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">File selected: {idFile.name}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea 
                  id="additionalNotes"
                  {...register('additionalNotes')}
                  className="mt-1 h-24"
                  placeholder="Any additional information to help with your verification"
                />
              </div>
            </div>
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
                  {allValues.idType === 'student_id' ? 'Student ID Card' :
                   allValues.idType === 'admission_letter' ? 'Admission Letter' :
                   allValues.idType === 'registration_receipt' ? 'Registration Receipt' : 'Not selected'}
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
        {['Personal Info', 'Emergency Contact', 'Proof', 'Review'].map((step, index) => (
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
          
          {currentSubStep < 4 ? (
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
