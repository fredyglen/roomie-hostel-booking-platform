import { useState, useEffect } from 'react';

interface RoommateInfo {
  name: string;
  email: string;
  phone: string;
}

export const useBookingRoommates = (
  splitPayment: boolean,
  numberOfRoommates: number,
  currentUserInfo: { fullName: string; email: string; phone: string }
) => {
  const [roommatesInfo, setRoommatesInfo] = useState<RoommateInfo[]>([]);

  // Initialize roommate info when numberOfRoommates changes
  useEffect(() => {
    if (splitPayment && numberOfRoommates > 1) {
      // Always keep roommate at index 0 as the current user
      const currentUser = roommatesInfo[0] || {
        name: currentUserInfo.fullName,
        email: currentUserInfo.email,
        phone: currentUserInfo.phone
      };
      
      const newRoommatesInfo = [currentUser];
      
      // Add/remove additional roommates as needed
      for (let i = 1; i < numberOfRoommates; i++) {
        newRoommatesInfo[i] = roommatesInfo[i] || { name: '', email: '', phone: '' };
      }
      
      setRoommatesInfo(newRoommatesInfo);
    }
  }, [numberOfRoommates, splitPayment, currentUserInfo.fullName, currentUserInfo.email, currentUserInfo.phone]);

  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommatesInfo];
    updatedRoommates[index] = { ...updatedRoommates[index], [field]: value };
    setRoommatesInfo(updatedRoommates);
  };

  return {
    roommatesInfo,
    handleRoommateChange,
    setRoommatesInfo
  };
};
