
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, GraduationCap, Info, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
    <div className="space-y-6 px-4 md:px-0 pb-24 md:pb-0">
      {/* Sticky Mobile Header + Progress */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-white border-b border-gray-200">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button type="button" onClick={onPrevious} aria-label="Back" className="flex size-12 shrink-0 items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Step 2/5: Select Dates</h2>
          <div className="size-12 shrink-0"></div>
        </div>
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-primary h-1" style={{ width: '40%' }}></div>
        </div>
      </div>

      {/* Page Title */}
      <div className="pt-4">
        <h1 className="text-[#111318] tracking-tight text-[32px] font-bold leading-tight text-left">Booking Duration</h1>
      </div>

      {/* Semester Information (optional card) */}
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

      {/* Duration Selection - EXACT layout */}
      <div>
        <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] text-left pb-2 pt-4">How long are you staying?</h2>
        <div className="flex py-3">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 p-1">
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-[#616e89] text-sm font-medium leading-normal transition-all duration-200 ${selectedDuration === 'one_semester' ? 'bg-primary shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white' : ''}`}>
              <span className="truncate">One Semester</span>
              <input
                className="sr-only"
                type="radio"
                name="duration-selection"
                value="one_semester"
                checked={selectedDuration === 'one_semester'}
                onChange={() => handleDurationChange('one_semester')}
              />
            </label>
            <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-[#616e89] text-sm font-medium leading-normal transition-all duration-200 ${selectedDuration === 'full_academic_year' ? 'bg-primary shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white' : ''}`}>
              <span className="truncate">Full Academic Year</span>
              <input
                className="sr-only"
                type="radio"
                name="duration-selection"
                value="full_academic_year"
                checked={selectedDuration === 'full_academic_year'}
                onChange={() => handleDurationChange('full_academic_year')}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Move-in Date */}
      <div>
        <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] text-left pb-2 pt-4">When will you move in?</h2>
        <div className="relative mt-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="moveInDate"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleMoveInDateChange}
            className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 bg-gray-100 text-[#111318] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-base"
            min={new Date().toISOString().split('T')[0]}
            placeholder="Select Date"
          />
        </div>
      </div>

      {/* Summary Card */}
      {calculatedDuration && (
        <div className="mt-8 rounded-xl bg-primary/10 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Move-in Date</span>
            <span className="font-semibold text-[#111318]">{calculatedDuration.moveInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Move-out Date</span>
            <span className="font-semibold text-[#111318]">{calculatedDuration.moveOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <hr className="border-t border-primary/20" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Duration</span>
            <span className="font-semibold text-[#111318]">{calculatedDuration.durationInMonths} Months</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Semester Status</span>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${semesterInfo?.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="font-semibold text-[#111318]">{semesterInfo?.isActive ? 'Active' : 'Upcoming'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop actions */}
      <div className="hidden md:flex justify-between">
        <Button variant="outline" onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext} disabled={!isValid}>Next</Button>
      </div>
      {/* Mobile sticky footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30 w-full bg-white p-4 border-t border-gray-200">
        <Button onClick={onNext} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </footer>
    </div>
  );
};

export default DateSelectionStep;
