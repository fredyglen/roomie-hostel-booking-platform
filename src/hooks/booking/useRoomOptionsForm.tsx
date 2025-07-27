
import { useState } from 'react';

interface RoomOptions {
  roomType: string;
  // ✅ REMOVED: furnishingOption - Ghana hostels don't offer furnishing choices
  floor: string;
  extraRequests: string;
}

export const useRoomOptionsForm = (initialData?: Partial<RoomOptions>) => {
  const [roomOptions, setRoomOptions] = useState<RoomOptions>({
    roomType: initialData?.roomType || 'single',
    // ✅ REMOVED: furnishingOption - Ghana hostels don't offer furnishing choices
    floor: initialData?.floor || '1st',
    extraRequests: initialData?.extraRequests || ''
  });
  
  const handleRoomOptionChange = (name: string, value: string) => {
    setRoomOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    roomOptions,
    setRoomOptions,
    handleRoomOptionChange
  };
};
