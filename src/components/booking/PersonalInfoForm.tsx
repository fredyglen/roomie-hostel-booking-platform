
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  firstName,
  lastName,
  email,
  phone,
  onInputChange,
  onNext
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <Input
          type="text"
          name="firstName"
          value={firstName}
          onChange={onInputChange}
          placeholder="Your first name"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <Input
          type="text"
          name="lastName"
          value={lastName}
          onChange={onInputChange}
          placeholder="Your last name"
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
      
      <div className="mt-6">
        <Button type="button" onClick={onNext} className="w-full">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
