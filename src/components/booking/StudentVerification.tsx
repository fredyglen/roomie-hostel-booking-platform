
import React from 'react';

interface StudentVerificationProps {
  idType: string;
  onInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StudentVerification: React.FC<StudentVerificationProps> = ({
  idType,
  onInputChange
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
        <select
          name="idType"
          value={idType}
          onChange={onInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="studentId">Student ID</option>
          <option value="nationalId">National ID</option>
          <option value="passport">Passport</option>
          <option value="driverLicense">Driver's License</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID</label>
        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="mt-4 text-sm text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-roomi-blue hover:text-roomi-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-roomi-blue">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </label>
              <p className="pt-1">or drag and drop</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentVerification;
