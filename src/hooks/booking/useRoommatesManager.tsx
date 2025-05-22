import { useState, useEffect } from 'react';

export interface RoommateInfo {
  name: string;
  email: string;
  phone: string;
}

export const useRoommatesManager = (
  splitPayment: boolean,
  numberOfRoommates: number,
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
  }
) => {
  const [roommatesInfo, setRoommatesInfo] = useState<RoommateInfo[]>([]);
  
  // Initialize roommate info when numberOfRoommates changes
  useEffect(() => {
    if (splitPayment && numberOfRoommates > 1) {
      // Always keep roommate at index 0 as the current user
      const currentUser = roommatesInfo[0] || {
        name: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone
      };
      
      const newRoommatesInfo = [currentUser];
      
      // Add/remove additional roommates as needed
      for (let i = 1; i < numberOfRoommates; i++) {
        newRoommatesInfo[i] = roommatesInfo[i] || { name: '', email: '', phone: '' };
      }
      
      setRoommatesInfo(newRoommatesInfo);
    }
  }, [numberOfRoommates, splitPayment, userInfo.fullName, userInfo.email, userInfo.phone]);
  
  const handleRoommateChange = (index: number, field: string, value: string) => {
    const updatedRoommates = [...roommatesInfo];
    updatedRoommates[index] = { 
      ...updatedRoommates[index], 
      [field]: value 
    };
    setRoommatesInfo(updatedRoommates);
  };
  
  // Update first roommate info when user info changes
  useEffect(() => {
    if (splitPayment && roommatesInfo.length > 0) {
      handleRoommateChange(0, 'name', userInfo.fullName);
      handleRoommateChange(0, 'email', userInfo.email);
      handleRoommateChange(0, 'phone', userInfo.phone);
    }
  }, [userInfo.fullName, userInfo.email, userInfo.phone, splitPayment]);

  return {
    roommatesInfo,
    setRoommatesInfo,
    handleRoommateChange
  };
};
