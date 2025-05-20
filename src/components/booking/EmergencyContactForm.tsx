
import React from 'react';
import { Input } from '@/components/ui/input';

interface EmergencyContactFormProps {
  emergencyContact: string;
  emergencyPhone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  emergencyContact,
  emergencyPhone,
  onInputChange
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
        <Input
          type="text"
          name="emergencyContact"
          value={emergencyContact}
          onChange={onInputChange}
          placeholder="Emergency contact name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
        <Input
          type="tel"
          name="emergencyPhone"
          value={emergencyPhone}
          onChange={onInputChange}
          placeholder="Emergency contact phone"
        />
      </div>
    </div>
  );
};

export default EmergencyContactForm;
