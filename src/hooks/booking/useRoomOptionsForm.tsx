
import { useState } from 'react';

interface RoomOptions {
  roomType: string;
  furnishingOption: string;
  floor: string;
  extraRequests: string;
}

export const useRoomOptionsForm = (initialData?: Partial<RoomOptions>) => {
  const [roomOptions, setRoomOptions] = useState<RoomOptions>({
    roomType: initialData?.roomType || 'single',
    furnishingOption: initialData?.furnishingOption || 'fully_furnished',
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
