
import React from 'react';
import { Input } from '@/components/ui/input';

interface DurationSelectionProps {
  duration: string;
  durationType: string;
  checkInDate: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const DurationSelection: React.FC<DurationSelectionProps> = ({
  duration,
  durationType,
  checkInDate,
  onInputChange
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
        <div className="flex items-center">
          <select
            name="duration"
            value={duration}
            onChange={onInputChange}
            className="w-24 p-2 border rounded-md mr-2"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          
          <select
            name="durationType"
            value={durationType}
            onChange={onInputChange}
            className="p-2 border rounded-md"
          >
            <option value="month">Month(s)</option>
            <option value="semester">Semester(s)</option>
            <option value="year">Year(s)</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
        <Input
          type="date"
          name="checkInDate"
          value={checkInDate}
          onChange={onInputChange}
          className="w-full"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

export default DurationSelection;
