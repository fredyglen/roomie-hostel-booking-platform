import { useState, useEffect } from 'react';
import { logger } from '@/utils/enhanced-logger';
import { useErrorHandler } from '@/hooks/common/useErrorHandler';
import type { RoommateInfo } from '@/types/common';

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
}

export const useBookingRoommates = (
  splitPayment: boolean,
  numberOfRoommates: number,
  currentUserInfo: UserInfo
) => {
  const [roommatesInfo, setRoommatesInfo] = useState<RoommateInfo[]>([]);
  const { handleError } = useErrorHandler();

  // Initialize roommate info when numberOfRoommates changes
  useEffect(() => {
    try {
      if (splitPayment && numberOfRoommates > 1) {
        // Always keep roommate at index 0 as the current user
        const currentUser: RoommateInfo = roommatesInfo[0] || {
          name: currentUserInfo.fullName,
          email: currentUserInfo.email,
          phone: currentUserInfo.phone
        };
        
        const newRoommatesInfo: RoommateInfo[] = [currentUser];
        
        // Add/remove additional roommates as needed
        for (let i = 1; i < numberOfRoommates; i++) {
          newRoommatesInfo[i] = roommatesInfo[i] || { name: '', email: '', phone: '' };
        }
        
        setRoommatesInfo(newRoommatesInfo);
        logger.debug('Roommates info updated', { 
          numberOfRoommates, 
          splitPayment,
          roommatesCount: newRoommatesInfo.length 
        });
      }
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to update roommates information' });
    }
  }, [numberOfRoommates, splitPayment, currentUserInfo.fullName, currentUserInfo.email, currentUserInfo.phone, handleError]);

  const handleRoommateChange = (index: number, field: keyof RoommateInfo, value: string) => {
    try {
      if (index < 0 || index >= roommatesInfo.length) {
        logger.warn('Invalid roommate index', { index, totalRoommates: roommatesInfo.length });
        return;
      }

      const updatedRoommates = [...roommatesInfo];
      updatedRoommates[index] = { ...updatedRoommates[index], [field]: value };
      setRoommatesInfo(updatedRoommates);
      
      logger.debug('Roommate info changed', { index, field, value });
    } catch (error) {
      handleError(error, { fallbackMessage: 'Failed to update roommate information' });
    }
  };

  return {
    roommatesInfo,
    handleRoommateChange,
    setRoommatesInfo
  };
};
