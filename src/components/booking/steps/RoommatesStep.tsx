
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface Roommate {
  name: string;
  email: string;
  phone: string;
}

interface RoommatesStepProps {
  roommatesList: Roommate[];
  onRoommateChange: (index: number, field: string, value: string) => void;
  onAddRoommate: () => void;
  onRemoveRoommate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const RoommatesStep: React.FC<RoommatesStepProps> = ({
  roommatesList,
  onRoommateChange,
  onAddRoommate,
  onRemoveRoommate,
  onPrevious,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Roommate Information (Optional)</h2>
      <p className="text-gray-600">Add roommates who will be sharing this accommodation with you.</p>
      
      {roommatesList.map((roommate, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Roommate {index + 1}</h3>
            {roommatesList.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveRoommate(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`roommate-name-${index}`}>Full Name</Label>
              <Input
                id={`roommate-name-${index}`}
                value={roommate.name}
                onChange={(e) => onRoommateChange(index, 'name', e.target.value)}
                placeholder="Full name"
              />
            </div>
            
            <div>
              <Label htmlFor={`roommate-email-${index}`}>Email</Label>
              <Input
                id={`roommate-email-${index}`}
                type="email"
                value={roommate.email}
                onChange={(e) => onRoommateChange(index, 'email', e.target.value)}
                placeholder="Email address"
              />
            </div>
            
            <div>
              <Label htmlFor={`roommate-phone-${index}`}>Phone</Label>
              <Input
                id={`roommate-phone-${index}`}
                type="tel"
                value={roommate.phone}
                onChange={(e) => onRoommateChange(index, 'phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button variant="outline" onClick={onAddRoommate} className="w-full">
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
