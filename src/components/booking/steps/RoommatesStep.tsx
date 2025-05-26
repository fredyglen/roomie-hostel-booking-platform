
import React from 'react';
import RoommatesForm from '../RoommatesForm';

interface RoommatesStepProps {
  roommatesList: Array<{ name: string; email: string; phone: string }>;
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
    <RoommatesForm
      roommatesList={roommatesList}
      onRoommateChange={onRoommateChange}
      onAddRoommate={onAddRoommate}
      onRemoveRoommate={onRemoveRoommate}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
};

export default RoommatesStep;
