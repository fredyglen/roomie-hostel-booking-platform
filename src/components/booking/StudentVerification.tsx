
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VerificationStatus } from './StudentVerificationStatus';

interface StudentVerificationProps {
  idType: string;
  studentId: string;
  university: string;
  program: string;
  onInputChange: (name: string, value: string) => void;
  onFileUpload: (file: File) => void;
  onVerify: () => void;
  isVerifying: boolean;
  onPrevious: () => void;
  onNext: () => void;
  verified?: boolean;
  status?: VerificationStatus;
}

const StudentVerification: React.FC<StudentVerificationProps> = ({
  idType,
  studentId,
  university,
  program,
  onInputChange,
  onFileUpload,
  onVerify,
  isVerifying,
  onPrevious,
  onNext,
  verified = false,
  status = 'pending'
}) => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onInputChange(e.target.name, e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      onFileUpload(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been successfully uploaded.`,
      });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Student Verification</h2>
      <p className="text-gray-600 mb-6">
        Please provide your student details for verification.
      </p>
      
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
            <select
              name="idType"
              value={idType}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="studentId">Student ID</option>
              <option value="nationalId">National ID</option>
              <option value="passport">Passport</option>
              <option value="driversLicense">Driver's License</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <Input
              type="text"
              name="studentId"
              value={studentId}
              onChange={handleChange}
              placeholder="Enter your ID number"
            />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University/Institution</label>
            <Input
              type="text"
              name="university"
              value={university}
              onChange={handleChange}
              placeholder="Enter your institution"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program/Course</label>
            <Input
              type="text"
              name="program"
              value={program}
              onChange={handleChange}
              placeholder="Enter your program"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID/Document</label>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="border border-gray-300 rounded-md p-2"
            disabled={verified}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a clear image of your student ID or other verification document.
          </p>
        </div>
        
        {verified && (
          <div className={`flex items-center p-3 rounded-md ${getStatusColor()}`}>
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span>Your student status has been verified!</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onVerify}
            disabled={isVerifying || !uploadedFile || verified}
          >
            {isVerifying ? 'Verifying...' : verified ? 'Verified' : 'Verify Student Status'}
          </Button>
          <Button 
            type="button" 
            onClick={onNext}
            disabled={!verified && !uploadedFile}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentVerification;
