
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RoomOptionsStepProps {
  selectedRoomType: string;
  selectedFurnishing: string;
  selectedFloor: string;
  extraRequests: string;
  onRoomTypeChange: (value: string) => void;
  onFurnishingChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  onRequestsChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  availableRoomTypes: string[];
}

const RoomOptionsStep: React.FC<RoomOptionsStepProps> = ({
  selectedRoomType,
  selectedFurnishing,
  selectedFloor,
  extraRequests,
  onRoomTypeChange,
  onFurnishingChange,
  onFloorChange,
  onRequestsChange,
  onPrevious,
  onNext,
  availableRoomTypes
}) => {
  const roomOptions = [
    { value: "single", label: "1 in a room", price: "₵6,000" },
    { value: "double", label: "2 in a room", price: "₵4,500" },
    { value: "triple", label: "3 in a room", price: "₵3,600" },
    { value: "quad", label: "4 in a room", price: "₵2,700" },
  ];
  
  // ✅ REMOVED: Furnishing options removed as per Ghana hostel standards
  // Students don't choose furnishing - they see what's provided by owner
  
  const floorOptions = [
    { value: "1st", label: "1st Floor" },
    { value: "2nd", label: "2nd Floor" },
    { value: "3rd", label: "3rd Floor" },
    { value: "4th", label: "4th Floor" },
  ];
  
  const handleRequestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onRequestsChange(e.target.value);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Select Room Type</h2>
        <p className="text-gray-600 mb-4">Choose your preferred room arrangement.</p>
        
        <RadioGroup 
          value={selectedRoomType} 
          onValueChange={onRoomTypeChange}
          className="space-y-3"
        >
          {roomOptions.filter(option => 
            availableRoomTypes.includes(option.value)
          ).map((option) => (
            <div key={option.value} className="flex items-center justify-between space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
              </div>
              <span className="font-semibold text-blue-600">{option.price}</span>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* ✅ REMOVED: Furnishing selection removed as per Ghana hostel standards */}
      {/* Students will see owner-provided furnishing details as read-only information */}
      
      <Separator />
      
      <div>
        <h2 className="text-xl font-bold mb-2">Select Floor</h2>
        <p className="text-gray-600 mb-4">Choose your preferred floor.</p>
        
        <RadioGroup 
          value={selectedFloor} 
          onValueChange={onFloorChange}
          className="space-y-3"
        >
          {floorOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={option.value} id={`floor-${option.value}`} />
              <Label htmlFor={`floor-${option.value}`} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-2">Special Requests</h2>
        <p className="text-gray-600 mb-4">Any special requirements or preferences?</p>
        
        <Textarea
          value={extraRequests}
          onChange={handleRequestsChange}
          placeholder="E.g., I need a room close to the elevator, specific furniture arrangements, etc."
          className="h-24"
        />
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

export default RoomOptionsStep;
