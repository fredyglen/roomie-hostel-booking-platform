
import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import FormField from '../common/form/FormField';

export interface StudentVerificationProps {
  studentId?: string;
  university?: string;
  program?: string;
  idType?: string;
  onInputChange: (name: string, value: string) => void;
  onFileUpload: (file: File) => void;
  onVerify: () => void;
  isVerifying: boolean;
}

const StudentVerification: React.FC<StudentVerificationProps> = ({
  studentId,
  university,
  program,
  idType,
  onInputChange,
  onFileUpload,
  onVerify,
  isVerifying
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Icon icon="solar:user-id-linear" className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-1">Student Verification</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          We need to verify your student status before proceeding with the booking
        </p>
      </div>

      <div className="space-y-4">
        <FormField label="ID Type">
          <Select 
            value={idType} 
            onValueChange={(value) => onInputChange('idType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student_id">Student ID</SelectItem>
              <SelectItem value="national_id">National ID</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Student ID Number">
          <Input 
            type="text"
            placeholder="Enter your student ID number"
            value={studentId}
            onChange={(e) => onInputChange('studentId', e.target.value)}
          />
        </FormField>

        <FormField label="University">
          <Select 
            value={university} 
            onValueChange={(value) => onInputChange('university', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your university" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upsa">UPSA</SelectItem>
              <SelectItem value="legon">University of Ghana, Legon</SelectItem>
              <SelectItem value="knust">KNUST</SelectItem>
              <SelectItem value="central">University of Cape Coast</SelectItem>
              <SelectItem value="gimpa">GIMPA</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Program of Study">
          <Input 
            type="text"
            placeholder="E.g. Computer Science"
            value={program}
            onChange={(e) => onInputChange('program', e.target.value)}
          />
        </FormField>

        <div className="space-y-2">
          <Label htmlFor="id-upload">Upload ID (Front and Back)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
            <input
              id="id-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Label htmlFor="id-upload" className="cursor-pointer">
              <Icon icon="solar:upload-linear" className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF (max. 5MB)</p>
            </Label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          className="w-full"
          onClick={onVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Icon icon="solar:refresh-circle-linear" className="animate-spin w-4 h-4 mr-2" />
              Verifying...
            </>
          ) : (
            'Verify Student Status'
          )}
        </Button>
      </div>
    </div>
  );
};

export default StudentVerification;
