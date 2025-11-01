import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentInfoStepProps {
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Emergency contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  // Handlers
  onFieldChange: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

const StudentInfoStep: React.FC<StudentInfoStepProps> = ({
  firstName,
  lastName,
  email,
  phone,
  emergencyName,
  emergencyPhone,
  emergencyRelationship,
  onFieldChange,
  onNext,
  onPrevious,
}) => {
  const isValid = Boolean(
    firstName && lastName && email && phone && emergencyName && emergencyPhone && emergencyRelationship
  );

  return (
    <div>
      {/* Mobile sticky header */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-white">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button
            type="button"
            onClick={() => (onPrevious ? onPrevious() : window.history.back())}
            aria-label="Back"
            className="flex size-12 shrink-0 items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Step 1/5: Your Information
          </h2>
          <div className="size-12 shrink-0"></div>
        </div>
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-primary h-1" style={{ width: '20%' }}></div>
        </div>
      </div>

      <div className="space-y-6 px-4 md:px-0 pb-24 md:pb-0">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">Your Information</h2>
          <p className="text-gray-600 mt-1">Tell us about yourself and an emergency contact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            placeholder="+233 XX XXX XXXX"
            required
          />
        </div>

        <div className="pt-2">
          <h3 className="text-base font-semibold mb-2">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyName">Full Name</Label>
              <Input
                id="emergencyName"
                value={emergencyName}
                onChange={(e) => onFieldChange('emergencyName', e.target.value)}
                placeholder="Contact person's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={emergencyPhone}
                onChange={(e) => onFieldChange('emergencyPhone', e.target.value)}
                placeholder="e.g. +233 XX XXX XXXX"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Select value={emergencyRelationship} onValueChange={(v) => onFieldChange('emergencyRelationship', v)}>
              <SelectTrigger id="emergencyRelationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parent">Parent</SelectItem>
                <SelectItem value="Guardian">Guardian</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex justify-end">
          <Button onClick={onNext} disabled={!isValid}>
            Next
          </Button>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30 w-full bg-white p-4 border-t border-gray-200">
        <Button onClick={onNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </footer>
    </div>
  );
};

export default StudentInfoStep;

