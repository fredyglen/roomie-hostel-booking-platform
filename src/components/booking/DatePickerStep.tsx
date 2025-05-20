
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerStepProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DatePickerStep: React.FC<DatePickerStepProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Select Move-in Date</h2>
        <p className="text-gray-600 mb-4">Choose when you want to move into your new accommodation.</p>
      </div>
      
      <div className="flex flex-col items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => {
                // Disable dates in the past and more than 6 months in the future
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sixMonthsLater = new Date();
                sixMonthsLater.setMonth(today.getMonth() + 6);
                return date < today || date > sixMonthsLater;
              }}
            />
          </PopoverContent>
        </Popover>
        
        {selectedDate && (
          <div className="mt-6 text-center">
            <p>You selected</p>
            <p className="text-xl font-semibold text-roomi-blue">{format(selectedDate, "PPPP")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerStep;
