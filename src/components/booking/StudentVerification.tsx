
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface StudentVerificationProps {
  idType: string;
  studentId?: string;
  university?: string;
  program?: string;
  onInputChange: (name: string, value: string) => void;
  onFileUpload: (file: File) => void;
  onVerify: () => void;
  isVerifying?: boolean;
}

const StudentVerification: React.FC<StudentVerificationProps> = ({
  idType,
  studentId,
  university,
  program,
  onInputChange,
  onFileUpload,
  onVerify,
  isVerifying = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [idNumber, setIdNumber] = useState<string>(studentId || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onInputChange(name, value);
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    onInputChange(name, value);
    
    // Clear errors when user selects
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
      
      // Pass the file to parent component
      onFileUpload(selectedFile);
      
      // Clear file error if exists
      if (errors.file) {
        setErrors(prev => ({...prev, file: ''}));
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!university) {
      newErrors.university = "Please select your university";
    }
    
    if (!program) {
      newErrors.program = "Please enter your program of study";
    }
    
    if (!studentId) {
      newErrors.studentId = "Please enter your Student ID number";
    }
    
    if (!file) {
      newErrors.file = "Please upload your ID document";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onVerify();
    } else {
      // Show first error as toast
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
    }
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIdNumber(value);
    onInputChange('studentId', value);
    
    // Clear error when user types
    if (errors.studentId) {
      setErrors(prev => ({...prev, studentId: ''}));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="university">University</Label>
          <Select 
            value={university} 
            onValueChange={(value) => handleSelectChange('university', value)}
          >
            <SelectTrigger id="university" className={`mt-1 ${errors.university ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select your university" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uofg">University of Ghana</SelectItem>
              <SelectItem value="knust">KNUST</SelectItem>
              <SelectItem value="upsa">UPSA</SelectItem>
              <SelectItem value="ucc">University of Cape Coast</SelectItem>
              <SelectItem value="central">Central University</SelectItem>
              <SelectItem value="ashesi">Ashesi University</SelectItem>
            </SelectContent>
          </Select>
          {errors.university && <p className="text-sm text-red-500 mt-1">{errors.university}</p>}
        </div>
        
        <div>
          <Label htmlFor="program">Program of Study</Label>
          <Input
            id="program"
            name="program"
            value={program}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            className={`mt-1 ${errors.program ? 'border-red-500' : ''}`}
          />
          {errors.program && <p className="text-sm text-red-500 mt-1">{errors.program}</p>}
        </div>
        
        <div>
          <Label htmlFor="studentId">Student ID Number</Label>
          <Input
            id="studentId"
            name="studentId"
            value={idNumber}
            onChange={handleIdNumberChange}
            placeholder="e.g. 10012345"
            className={`mt-1 ${errors.studentId ? 'border-red-500' : ''}`}
          />
          {errors.studentId && <p className="text-sm text-red-500 mt-1">{errors.studentId}</p>}
          <p className="text-xs text-gray-500 mt-1">Enter your student ID number as shown on your ID card</p>
        </div>
      
        <div>
          <Label htmlFor="idType">ID Type</Label>
          <Select 
            value={idType} 
            onValueChange={(value) => handleSelectChange('idType', value)}
          >
            <SelectTrigger id="idType" className="mt-1">
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studentId">Student ID</SelectItem>
              <SelectItem value="nationalId">National ID</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driverLicense">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
        <div className="mt-4">
          <Label htmlFor="idUpload" className="block mb-2">Upload ID Document</Label>
          <div className={`mt-1 border-2 border-dashed ${errors.file ? 'border-red-500' : 'border-gray-300'} rounded-md p-6 flex flex-col items-center`}>
            <div className="flex flex-col items-center space-y-2 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="ID Preview" 
                    className="h-40 object-contain mb-2" 
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setFile(null);
                      if (errors.file) {
                        setErrors(prev => ({...prev, file: 'Please upload your ID document'}));
                      }
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1 inline">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
          {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className={`${isVerifying ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : 'Verify Student Status'}
        </Button>
      </div>
    </form>
  );
};

export default StudentVerification;
