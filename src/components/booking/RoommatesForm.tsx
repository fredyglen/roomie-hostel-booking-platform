
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface RoommatesFormProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  numberOfRoommates: number;
  setNumberOfRoommates: (num: number) => void;
  roommatesInfo: Array<{ name: string; email: string; phone: string }>;
  onRoommateChange: (index: number, field: string, value: string) => void;
  individualPrice: number;
  priceUnit: string;
}

const RoommatesForm: React.FC<RoommatesFormProps> = ({
  enabled,
  setEnabled,
  numberOfRoommates,
  setNumberOfRoommates,
  roommatesInfo,
  onRoommateChange,
  individualPrice,
  priceUnit
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Split Payment</h3>
          <p className="text-sm text-gray-600">Share the rent with roommates</p>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled}
        />
      </div>
      
      {enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Roommates (including you)
            </label>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => numberOfRoommates > 1 && setNumberOfRoommates(numberOfRoommates - 1)}
                disabled={numberOfRoommates <= 1}
              >
                -
              </Button>
              <span className="mx-4">{numberOfRoommates}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setNumberOfRoommates(numberOfRoommates + 1)}
                disabled={numberOfRoommates >= 6}
              >
                +
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Each roommate will pay: <span className="font-semibold">${individualPrice.toFixed(2)}</span>/{priceUnit}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Roommate Information</h4>
            
            {roommatesInfo.map((roommate, index) => (
              <div key={index} className="p-3 border rounded-md">
                <h5 className="font-medium mb-2">
                  {index === 0 ? 'You (Primary Tenant)' : `Roommate ${index}`}
                </h5>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                    <Input
                      type="text"
                      value={roommate.name}
                      onChange={(e) => onRoommateChange(index, 'name', e.target.value)}
                      placeholder="Full Name"
                      disabled={index === 0} // Disable for primary tenant as it's linked to their personal info
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <Input
                      type="email"
                      value={roommate.email}
                      onChange={(e) => onRoommateChange(index, 'email', e.target.value)}
                      placeholder="Email Address"
                      disabled={index === 0} // Disable for primary tenant
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <Input
                      type="tel"
                      value={roommate.phone}
                      onChange={(e) => onRoommateChange(index, 'phone', e.target.value)}
                      placeholder="Phone Number"
                      disabled={index === 0} // Disable for primary tenant
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoommatesForm;
