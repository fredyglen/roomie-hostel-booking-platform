
import React from 'react';
import { Input } from '@/components/ui/input';

interface PersonalInfoFormProps {
  fullName: string;
  phone: string;
  email: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  fullName,
  phone,
  email,
  onInputChange
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <Input
          type="text"
          name="fullName"
          value={fullName}
          onChange={onInputChange}
          placeholder="Your full name"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <Input
          type="tel"
          name="phone"
          value={phone}
          onChange={onInputChange}
          placeholder="Your phone number"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={onInputChange}
          placeholder="Your email address"
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
