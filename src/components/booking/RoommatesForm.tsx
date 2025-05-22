
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

interface RoommatesFormProps {
  roommatesList: Array<{ name: string; email: string; phone: string }>;
  onRoommateChange: (index: number, field: string, value: string) => void;
  onAddRoommate: () => void;
  onRemoveRoommate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const RoommatesForm: React.FC<RoommatesFormProps> = ({
  roommatesList,
  onRoommateChange,
  onAddRoommate,
  onRemoveRoommate,
  onPrevious,
  onNext
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Roommates Information</h2>
        <p className="text-gray-600 mb-4">Please provide details for all roommates (if any).</p>
      </div>
      
      {roommatesList.map((roommate, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">
              {index === 0 ? 'Primary Tenant (You)' : `Roommate ${index}`}
            </h3>
            {index > 0 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => onRemoveRoommate(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Icon icon="solar:trash-bin-trash-linear" className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                type="text"
                value={roommate.name}
                onChange={(e) => onRoommateChange(index, 'name', e.target.value)}
                placeholder="Full Name"
                disabled={index === 0} // Primary tenant's info comes from personal info
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={roommate.email}
                onChange={(e) => onRoommateChange(index, 'email', e.target.value)}
                placeholder="Email Address"
                disabled={index === 0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                value={roommate.phone}
                onChange={(e) => onRoommateChange(index, 'phone', e.target.value)}
                placeholder="Phone Number"
                disabled={index === 0}
              />
            </div>
          </div>
        </div>
      ))}
      
      {roommatesList.length < 3 && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={onAddRoommate}
        >
          <Icon icon="solar:user-plus-linear" className="w-4 h-4 mr-2" />
          Add Another Roommate
        </Button>
      )}
      
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

export default RoommatesForm;
