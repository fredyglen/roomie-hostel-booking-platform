
import React from 'react';
import { Input } from '@/components/ui/input';
import RoommatesForm from './RoommatesForm';

interface DurationSelectionProps {
  duration: string;
  durationType: string;
  checkInDate: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  property?: {
    propertyCategory?: 'Hostel' | 'Homestel' | 'Apartment';
  };
  splitPayment?: boolean;
  setSplitPayment?: (enabled: boolean) => void;
  numberOfRoommates?: number;
  setNumberOfRoommates?: (num: number) => void;
  roommatesInfo?: Array<{name: string, email: string, phone: string}>;
  handleRoommateChange?: (index: number, field: string, value: string) => void;
  individualPrice?: number;
  selectedUnit?: string;
}

const DurationSelection: React.FC<DurationSelectionProps> = ({
  duration,
  durationType,
  checkInDate,
  onInputChange,
  property,
  splitPayment = false,
  setSplitPayment = () => {},
  numberOfRoommates = 1,
  setNumberOfRoommates = () => {},
  roommatesInfo = [],
  handleRoommateChange = () => {},
  individualPrice = 0,
  selectedUnit = 'month'
}) => {
  const isApartment = property?.propertyCategory === 'Apartment';
  
  return (
    <div className="space-y-6">
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
            <option value="week">Week(s)</option>
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
      
      {/* Split Payment Option (only for Apartments) */}
      {isApartment && (
        <div className="mt-6">
          <RoommatesForm
            enabled={splitPayment}
            setEnabled={setSplitPayment}
            numberOfRoommates={numberOfRoommates}
            setNumberOfRoommates={setNumberOfRoommates}
            roommatesInfo={roommatesInfo}
            onRoommateChange={handleRoommateChange}
            individualPrice={individualPrice}
            priceUnit={selectedUnit}
          />
        </div>
      )}
    </div>
  );
};

export default DurationSelection;
