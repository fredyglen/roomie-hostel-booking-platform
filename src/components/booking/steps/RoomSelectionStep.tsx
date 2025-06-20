
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface RoomSelectionStepProps {
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

const RoomSelectionStep: React.FC<RoomSelectionStepProps> = ({
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
  const isValid = selectedRoomType && selectedFurnishing;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Room Selection</h2>
      
      <div>
        <Label htmlFor="roomType">Room Type</Label>
        <Select value={selectedRoomType} onValueChange={onRoomTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {availableRoomTypes.length > 0 ? (
              availableRoomTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="1_in_room">1 in a room</SelectItem>
                <SelectItem value="2_in_room">2 in a room</SelectItem>
                <SelectItem value="3_in_room">3 in a room</SelectItem>
                <SelectItem value="4_in_room">4 in a room</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="furnishing">Furnishing Option</Label>
        <Select value={selectedFurnishing} onValueChange={onFurnishingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select furnishing option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="furnished">Fully Furnished</SelectItem>
            <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
            <SelectItem value="unfurnished">Unfurnished</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="floor">Preferred Floor</Label>
        <Select value={selectedFloor} onValueChange={onFloorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select preferred floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ground">Ground Floor</SelectItem>
            <SelectItem value="first">First Floor</SelectItem>
            <SelectItem value="second">Second Floor</SelectItem>
            <SelectItem value="third">Third Floor</SelectItem>
            <SelectItem value="any">Any Floor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="extraRequests">Special Requests (Optional)</Label>
        <Textarea
          id="extraRequests"
          value={extraRequests}
          onChange={(e) => onRequestsChange(e.target.value)}
          placeholder="Any special requests or requirements..."
          rows={3}
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

export default RoomSelectionStep;
