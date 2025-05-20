
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface RoommatesFormProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  numberOfRoommates: number;
  setNumberOfRoommates: (num: number) => void;
  roommatesInfo: Array<{name: string, email: string, phone: string}>;
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
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="split-payment" 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <div>
          <Label 
            htmlFor="split-payment" 
            className="text-sm font-medium flex items-center"
          >
            <Users className="h-4 w-4 mr-2 text-roomi-blue" />
            Split Payment with Roommates
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            Share the cost with roommates and each person pays their share
          </p>
        </div>
      </div>
      
      {enabled && (
        <Card className="p-4 border border-roomi-blue/20 bg-roomi-blue/5">
          <div className="space-y-4">
            <div>
              <Label htmlFor="numberOfRoommates" className="block text-sm font-medium mb-1">
                Number of Roommates (including you)
              </Label>
              <select
                id="numberOfRoommates"
                value={numberOfRoommates}
                onChange={(e) => setNumberOfRoommates(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between font-medium mb-2">
                <span>Individual Price (per person):</span>
                <span className="text-roomi-blue">GH₵ {individualPrice.toFixed(2)} / {priceUnit}</span>
              </div>
            </div>
            
            {numberOfRoommates > 1 && (
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Roommate Information</h3>
                
                {/* Skip the first roommate (it's the current user) */}
                {Array.from({length: numberOfRoommates - 1}, (_, i) => i + 1).map((index) => (
                  <div key={index} className="border-t pt-4">
                    <h4 className="font-medium mb-3">Roommate #{index + 1}</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`roommate-name-${index}`} className="block text-sm mb-1">
                          Full Name
                        </Label>
                        <Input
                          id={`roommate-name-${index}`}
                          value={roommatesInfo[index]?.name || ''}
                          onChange={(e) => onRoommateChange(index, 'name', e.target.value)}
                          placeholder="Enter roommate's full name"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`roommate-email-${index}`} className="block text-sm mb-1">
                          Email Address
                        </Label>
                        <Input
                          id={`roommate-email-${index}`}
                          type="email"
                          value={roommatesInfo[index]?.email || ''}
                          onChange={(e) => onRoommateChange(index, 'email', e.target.value)}
                          placeholder="Enter roommate's email"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`roommate-phone-${index}`} className="block text-sm mb-1">
                          Phone Number
                        </Label>
                        <Input
                          id={`roommate-phone-${index}`}
                          value={roommatesInfo[index]?.phone || ''}
                          onChange={(e) => onRoommateChange(index, 'phone', e.target.value)}
                          placeholder="Enter roommate's phone number"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoommatesForm;
