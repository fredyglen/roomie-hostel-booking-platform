
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DatePickerStepProps {
  startDate?: Date;
  endDate?: Date;
  selectedDuration?: string;
  onStartDateChange?: (date: Date) => void;
  onEndDateChange?: (date: Date) => void;
  onDurationChange?: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DatePickerStep: React.FC<DatePickerStepProps> = ({
  startDate = new Date(),
  endDate = new Date(new Date().setMonth(new Date().getMonth() + 4)),
  selectedDuration = '1-semester',
  onStartDateChange,
  onEndDateChange,
  onDurationChange,
  onPrevious,
  onNext,
}) => {
  const durations = [
    { value: '1-semester', label: '1 Semester (4 months)' },
    { value: '2-semester', label: '2 Semesters (8 months)' },
    { value: 'full-year', label: 'Full Year (12 months)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Select Duration</h2>
        <p className="text-gray-600 mb-4">How long would you like to stay?</p>
        
        <RadioGroup
          value={selectedDuration}
          onValueChange={onDurationChange}
          className="space-y-3"
        >
          {durations.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-2">Move In Date</h3>
          <div className="border rounded-md p-3">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Move Out Date</h3>
          <div className="border rounded-md p-3">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              disabled={(date) => date <= (startDate || new Date())}
              className="rounded-md border"
            />
          </div>
        </div>
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

export default DatePickerStep;
