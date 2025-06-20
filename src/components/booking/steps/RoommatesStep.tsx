
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

import { RoommateData } from '@/services/bookingService';

interface RoommatesStepProps {
  roommates: RoommateData[];
  onRoommatesChange: (roommates: RoommateData[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const RoommatesStep: React.FC<RoommatesStepProps> = ({
  roommates,
  onRoommatesChange,
  onPrevious,
  onNext
}) => {
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommates];
    updatedRoommates[index] = {
      ...updatedRoommates[index],
      [field]: value
    };
    onRoommatesChange(updatedRoommates);
  };

  const handleAddRoommate = () => {
    const newRoommate: RoommateData = {
      roommate_name: '',
      roommate_email: '',
      roommate_phone: '',
      is_primary_booker: false,
      payment_responsibility: 'individual'
    };
    onRoommatesChange([...roommates, newRoommate]);
  };

  const handleRemoveRoommate = (index: number) => {
    const updatedRoommates = roommates.filter((_, i) => i !== index);
    onRoommatesChange(updatedRoommates);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Roommate Information (Optional)</h2>
      <p className="text-gray-600">Add roommates who will be sharing this accommodation with you.</p>
      
      {roommates.map((roommate, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Roommate {index + 1}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveRoommate(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`roommate-name-${index}`}>Full Name</Label>
              <Input
                id={`roommate-name-${index}`}
                value={roommate.roommate_name}
                onChange={(e) => handleRoommateChange(index, 'roommate_name', e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div>
              <Label htmlFor={`roommate-email-${index}`}>Email</Label>
              <Input
                id={`roommate-email-${index}`}
                type="email"
                value={roommate.roommate_email || ''}
                onChange={(e) => handleRoommateChange(index, 'roommate_email', e.target.value)}
                placeholder="Email address"
              />
            </div>

            <div>
              <Label htmlFor={`roommate-phone-${index}`}>Phone</Label>
              <Input
                id={`roommate-phone-${index}`}
                type="tel"
                value={roommate.roommate_phone || ''}
                onChange={(e) => handleRoommateChange(index, 'roommate_phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={handleAddRoommate} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Roommate
      </Button>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default RoommatesStep;
