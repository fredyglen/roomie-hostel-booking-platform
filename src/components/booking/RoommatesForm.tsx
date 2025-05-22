
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BaseRoommateInfo {
  name: string;
  email: string;
  phone: string;
}

// For standalone mode in the booking flow
interface StandaloneRoommatesFormProps {
  roommatesList: Array<BaseRoommateInfo>;
  onRoommateChange: (index: number, field: string, value: string) => void;
  onAddRoommate: () => void;
  onRemoveRoommate: (index: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  
  // These props are only for embedded mode and should be undefined when in standalone mode
  enabled?: undefined;
  setEnabled?: undefined;
  numberOfRoommates?: undefined;
  setNumberOfRoommates?: undefined;
  individualPrice?: undefined;
  priceUnit?: undefined;
  roommatesInfo?: undefined;
}

// For embedded mode in DurationSelection
interface EmbeddedRoommatesFormProps {
  // These props are only for standalone mode and should be undefined when in embedded mode
  roommatesList?: undefined;
  onAddRoommate?: undefined;
  onRemoveRoommate?: undefined;
  onPrevious?: undefined;
  onNext?: undefined;
  
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  numberOfRoommates: number;
  setNumberOfRoommates: (num: number) => void;
  roommatesInfo: Array<BaseRoommateInfo>;
  onRoommateChange: (index: number, field: string, value: string) => void;
  individualPrice: number;
  priceUnit: string;
}

// Union type that can represent either usage
type RoommatesFormProps = StandaloneRoommatesFormProps | EmbeddedRoommatesFormProps;

const RoommatesForm: React.FC<RoommatesFormProps> = (props) => {
  // Check if being used in standalone mode (in booking flow) or embedded mode (in DurationSelection)
  const isStandalone = 'roommatesList' in props;
  
  if (!isStandalone) {
    // Embedded mode in DurationSelection
    const {
      enabled,
      setEnabled,
      numberOfRoommates,
      setNumberOfRoommates,
      roommatesInfo,
      onRoommateChange,
      individualPrice,
      priceUnit
    } = props;
    
    return (
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Split Payment with Roommates</h3>
            <p className="text-sm text-gray-500">Share the cost with others</p>
          </div>
          <Switch 
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
        
        {enabled && (
          <div className="space-y-4">
            <div>
              <Label>Number of Roommates (including you)</Label>
              <select 
                value={numberOfRoommates}
                onChange={(e) => setNumberOfRoommates(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md mt-1"
              >
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              
              {individualPrice > 0 && (
                <p className="text-sm mt-2">
                  Each person pays: <span className="font-semibold">₵{individualPrice.toLocaleString()}</span>/{priceUnit}
                </p>
              )}
            </div>
            
            {numberOfRoommates > 1 && Array.from({ length: numberOfRoommates - 1 }).map((_, index) => (
              <div key={index} className="border p-3 rounded-md">
                <h4 className="font-medium mb-2">Roommate {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={roommatesInfo[index + 1]?.name || ''}
                      onChange={(e) => onRoommateChange(index + 1, 'name', e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={roommatesInfo[index + 1]?.email || ''}
                      onChange={(e) => onRoommateChange(index + 1, 'email', e.target.value)}
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={roommatesInfo[index + 1]?.phone || ''}
                      onChange={(e) => onRoommateChange(index + 1, 'phone', e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    // Standalone mode in booking flow
    const {
      roommatesList,
      onRoommateChange,
      onAddRoommate,
      onRemoveRoommate,
      onPrevious,
      onNext
    } = props;
    
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
  }
};

export default RoommatesForm;
