
import { useState } from 'react';

interface BookingDates {
  moveIn: Date;
  moveOut: Date;
  duration: string;
}

export const useDatesForm = (initialData?: Partial<BookingDates>) => {
  const [bookingDates, setBookingDates] = useState<BookingDates>({
    moveIn: initialData?.moveIn || new Date(),
    moveOut: initialData?.moveOut || new Date(new Date().setMonth(new Date().getMonth() + 4)),
    duration: initialData?.duration || '1 semester'
  });
  
  const handleMoveInDateAdapter = (date: Date) => {
    setBookingDates(prev => ({
      ...prev,
      moveIn: date
    }));
  };
  
  const handleMoveOutDateAdapter = (date: Date) => {
    setBookingDates(prev => ({
      ...prev,
      moveOut: date
    }));
  };
  
  const handleDateChange = (name: string, value: Date | string) => {
    setBookingDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    bookingDates,
    setBookingDates,
    handleMoveInDateAdapter,
    handleMoveOutDateAdapter,
    handleDateChange
  };
};
