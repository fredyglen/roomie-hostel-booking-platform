
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateSelectionStepProps {
  startDate: Date;
  endDate: Date;
  selectedDuration: string;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onDurationChange: (duration: string) => void;
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
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartDateChange(new Date(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndDateChange(new Date(e.target.value));
  };

  const isValid = startDate && endDate && selectedDuration;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Select Dates & Duration</h2>
      
      <div>
        <Label htmlFor="duration">Accommodation Duration</Label>
        <Select value={selectedDuration} onValueChange={onDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semester">One Semester (4 months)</SelectItem>
            <SelectItem value="academic_year">Academic Year (8 months)</SelectItem>
            <SelectItem value="short_term">Short Term (1-3 months)</SelectItem>
            <SelectItem value="custom">Custom Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Move-in Date</Label>
          <input
            id="startDate"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">Move-out Date</Label>
          <input
            id="endDate"
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={formatDateForInput(startDate)}
          />
        </div>
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

export default DateSelectionStep;
