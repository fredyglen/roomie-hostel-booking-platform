
import React from 'react';
import RoomOptionsStep from '../RoomOptionsStep';

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
  return (
    <RoomOptionsStep
      selectedRoomType={selectedRoomType}
      selectedFurnishing={selectedFurnishing}
      selectedFloor={selectedFloor}
      extraRequests={extraRequests}
      onRoomTypeChange={onRoomTypeChange}
      onFurnishingChange={onFurnishingChange}
      onFloorChange={onFloorChange}
      onRequestsChange={onRequestsChange}
      onPrevious={onPrevious}
      onNext={onNext}
      availableRoomTypes={availableRoomTypes}
    />
  );
};

export default RoomSelectionStep;
