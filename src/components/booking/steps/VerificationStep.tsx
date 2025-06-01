
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Upload } from 'lucide-react';

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const isValid = idType && studentId && university && program && verified;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Student Verification</h2>
      <p className="text-gray-600">Please verify your student status to complete the booking.</p>
      
      <div>
        <Label htmlFor="idType">ID Type</Label>
        <Select value={idType} onValueChange={(value) => onInputChange('idType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select ID type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studentId">Student ID Card</SelectItem>
            <SelectItem value="nationalId">National ID Card</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="studentId">Student ID Number</Label>
        <Input
          id="studentId"
          value={studentId}
          onChange={(e) => onInputChange('studentId', e.target.value)}
          placeholder="Enter your student ID number"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="university">University/Institution</Label>
        <Input
          id="university"
          value={university}
          onChange={(e) => onInputChange('university', e.target.value)}
          placeholder="University of Ghana, KNUST, etc."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="program">Program of Study</Label>
        <Input
          id="program"
          value={program}
          onChange={(e) => onInputChange('program', e.target.value)}
          placeholder="Computer Science, Medicine, etc."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="idImage">Upload ID Document</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">Upload a clear photo of your ID</p>
          <input
            id="idImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('idImage')?.click()}
          >
            Choose File
          </Button>
        </div>
      </div>
      
      {!verified && (
        <Button
          onClick={onVerify}
          disabled={isVerifying || !idType || !studentId || !university || !program}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify Student Status'}
        </Button>
      )}
      
      {verified && (
        <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-700">Student status verified successfully!</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default VerificationStep;
