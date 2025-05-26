
import React from 'react';
import DatePickerStep from '../DatePickerStep';

interface DateSelectionStepProps {
  startDate: Date;
  endDate: Date;
  selectedDuration: string;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onDurationChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({
  startDate,
  endDate,
  selectedDuration,
  onStartDateChange,
  onEndDateChange,
  onDurationChange,
  onPrevious,
  onNext
}) => {
  return (
    <DatePickerStep
      startDate={startDate}
      endDate={endDate}
      selectedDuration={selectedDuration}
      onStartDateChange={onStartDateChange}
      onEndDateChange={onEndDateChange}
      onDurationChange={onDurationChange}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );
};

export default DateSelectionStep;
