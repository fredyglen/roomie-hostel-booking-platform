
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, GraduationCap, Info } from 'lucide-react';
import {
  calculateIntelligentBookingDuration,
  getAvailableDurationOptions,
  getSemesterInfo,
  type BookingDuration
} from '@/services/ghanaUniversityCalendarService';

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
  const [calculatedDuration, setCalculatedDuration] = useState<BookingDuration | null>(null);
  const [semesterInfo, setSemesterInfo] = useState<any>(null);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleMoveInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMoveInDate = new Date(e.target.value);
    onStartDateChange(newMoveInDate);

    // ✅ INTELLIGENT: Auto-calculate move-out date
    const duration = calculateIntelligentBookingDuration(newMoveInDate, selectedDuration as any);
    setCalculatedDuration(duration);
    onEndDateChange(duration.moveOutDate);
  };

  const handleDurationChange = (duration: string) => {
    onDurationChange(duration);

    // ✅ INTELLIGENT: Recalculate move-out date based on new duration
    const newDuration = calculateIntelligentBookingDuration(startDate, duration as any);
    setCalculatedDuration(newDuration);
    onEndDateChange(newDuration.moveOutDate);
  };

  // ✅ INTELLIGENT: Calculate duration on component mount
  useEffect(() => {
    const duration = calculateIntelligentBookingDuration(startDate, selectedDuration as any);
    setCalculatedDuration(duration);
    onEndDateChange(duration.moveOutDate);

    const semInfo = getSemesterInfo(startDate);
    setSemesterInfo(semInfo);
  }, []);

  // ✅ INTELLIGENT: Update semester info when move-in date changes
  useEffect(() => {
    const semInfo = getSemesterInfo(startDate);
    setSemesterInfo(semInfo);
  }, [startDate]);

  const isValid = startDate && calculatedDuration;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Move-in Date
        </h2>
        <p className="text-gray-600 mt-1">
          We'll intelligently calculate your move-out date based on Ghana university calendar
        </p>
      </div>

      {/* Semester Information */}
      {semesterInfo?.semester && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                {semesterInfo.semester.name}
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {semesterInfo.isActive ? 'Active' : 'Upcoming'}
              </Badge>
            </div>
            <p className="text-sm text-blue-700">
              {semesterInfo.isActive
                ? `Semester ends in ${semesterInfo.daysUntilEnd} days`
                : `Semester starts in ${semesterInfo.daysUntilStart} days`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Duration Selection */}
      <div>
        <Label htmlFor="duration" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Accommodation Duration
        </Label>
        <Select value={selectedDuration} onValueChange={handleDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one_semester">One Semester</SelectItem>
            <SelectItem value="full_academic_year">Full Academic Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Move-in Date */}
      <div>
        <Label htmlFor="moveInDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Move-in Date
        </Label>
        <input
          id="moveInDate"
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleMoveInDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Calculated Duration Display */}
      {calculatedDuration && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 mb-1">
                  {calculatedDuration.description}
                </h4>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    <strong>Move-in:</strong> {calculatedDuration.moveInDate.toLocaleDateString('en-GH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    <strong>Move-out:</strong> {calculatedDuration.moveOutDate.toLocaleDateString('en-GH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    <strong>Duration:</strong> {calculatedDuration.durationInMonths} months
                    ({calculatedDuration.durationInWeeks} weeks)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
