
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Roommate {
  name: string;
  email: string;
  phone: string;
}

export const useRoommatesForm = (initialRoommates?: Roommate[]) => {
  const { toast } = useToast();
  const [roommates, setRoommates] = useState<Roommate[]>(
    initialRoommates || [{ name: '', email: '', phone: '' }]
  );
  
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommates];
    updatedRoommates[index] = {
      ...updatedRoommates[index],
      [field]: value
    };
    setRoommates(updatedRoommates);
  };
  
  const addRoommate = () => {
    if (roommates.length < 3) {
      setRoommates([...roommates, { name: '', email: '', phone: '' }]);
    } else {
      toast({
        title: "Maximum roommates reached",
        description: "You can add a maximum of 3 roommates.",
        variant: "destructive"
      });
    }
  };
  
  const removeRoommate = (index: number) => {
    if (index > 0) {
      setRoommates(roommates.filter((_, i) => i !== index));
    }
  };

  return {
    roommates,
    setRoommates,
    handleRoommateChange,
    addRoommate,
    removeRoommate
  };
};
