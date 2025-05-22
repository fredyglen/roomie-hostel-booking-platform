
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmergencyContactFormProps {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRelationshipChange?: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  name,
  relationship,
  phone,
  alternatePhone,
  onInputChange,
  onRelationshipChange,
  onPrevious,
  onNext
}) => {
  const relationships = [
    "Parent", "Guardian", "Sibling", "Relative", "Spouse", "Friend", "Other"
  ];

  // Handler for relationship selection
  const handleRelationshipChange = (value: string) => {
    if (onRelationshipChange) {
      onRelationshipChange(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Emergency Contact</h2>
        <p className="text-gray-600 mb-4">Please provide details of someone we can contact in case of emergency.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            type="text"
            name="name"
            value={name}
            onChange={onInputChange}
            placeholder="Contact person's full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <Select value={relationship} onValueChange={handleRelationshipChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map((rel) => (
                <SelectItem key={rel} value={rel.toLowerCase()}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <Input
            type="tel"
            name="phone"
            value={phone}
            onChange={onInputChange}
            placeholder="Primary contact number"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone Number (Optional)</label>
          <Input
            type="tel"
            name="alternatePhone"
            value={alternatePhone}
            onChange={onInputChange}
            placeholder="Secondary contact number"
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default EmergencyContactForm;
