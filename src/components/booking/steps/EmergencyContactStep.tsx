
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmergencyContactStepProps {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRelationshipChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  name,
  relationship,
  phone,
  alternatePhone,
  onInputChange,
  onRelationshipChange,
  onPrevious,
  onNext
}) => {
  const isValid = name && relationship && phone;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Emergency Contact</h2>
      <p className="text-gray-600">Please provide emergency contact information for safety purposes.</p>
      
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          placeholder="Emergency contact full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="relationship">Relationship</Label>
        <Select value={relationship} onValueChange={onRelationshipChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Parent">Parent</SelectItem>
            <SelectItem value="Guardian">Guardian</SelectItem>
            <SelectItem value="Sibling">Sibling</SelectItem>
            <SelectItem value="Relative">Relative</SelectItem>
            <SelectItem value="Friend">Friend</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="phone">Primary Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={onInputChange}
          placeholder="+233 XX XXX XXXX"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="alternatePhone">Alternate Phone Number (Optional)</Label>
        <Input
          id="alternatePhone"
          name="alternatePhone"
          type="tel"
          value={alternatePhone}
          onChange={onInputChange}
          placeholder="+233 XX XXX XXXX"
        />
      </div>
      
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

export default EmergencyContactStep;
