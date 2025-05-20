
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface RoomOptionsStepProps {
  selectedRoomOption: string;
  onRoomOptionChange: (value: string) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
}

const RoomOptionsStep: React.FC<RoomOptionsStepProps> = ({
  selectedRoomOption,
  onRoomOptionChange,
  selectedDuration,
  onDurationChange
}) => {
  const roomOptions = [
    { value: "1-in-room", label: "1 in a room", price: "₵6,000" },
    { value: "2-in-room", label: "2 in a room", price: "₵4,500" },
    { value: "3-in-room", label: "3 in a room", price: "₵3,600" },
    { value: "4-in-room", label: "4 in a room", price: "₵2,700" },
  ];
  
  const durationOptions = [
    { value: "1-semester", label: "1 Semester (4 months)" },
    { value: "2-semester", label: "2 Semesters (8 months)" },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Select Room Option</h2>
        <p className="text-gray-600 mb-4">Choose your preferred room arrangement.</p>
        
        <RadioGroup 
          value={selectedRoomOption} 
          onValueChange={onRoomOptionChange}
          className="space-y-3"
        >
          {roomOptions.map((option) => (
            <div key={option.value} className="flex items-center justify-between space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
              </div>
              <span className="font-semibold text-roomi-blue">{option.price}</span>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <Separator />
      
      <div>
        <h2 className="text-xl font-bold mb-2">Select Duration</h2>
        <p className="text-gray-600 mb-4">How long would you like to stay?</p>
        
        <RadioGroup 
          value={selectedDuration} 
          onValueChange={onDurationChange}
          className="space-y-3"
        >
          {durationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default RoomOptionsStep;
