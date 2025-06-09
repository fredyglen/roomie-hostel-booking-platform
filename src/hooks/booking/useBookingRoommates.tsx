
import { useState, useEffect } from 'react';
import { RoommateInfo } from '@/types/common';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PrimaryStudent {
  fullName: string;
  email: string;
  phone: string;
}

export const useRoommatesManager = (
  splitPayment: boolean,
  numberOfRoommates: number,
  primaryStudent: PrimaryStudent
) => {
  const [roommatesInfo, setRoommatesInfo] = useState<RoommateInfo[]>([]);

  useEffect(() => {
    try {
      if (splitPayment && numberOfRoommates > 1) {
        // Initialize roommates array with primary student as first roommate
        const initialRoommates: RoommateInfo[] = [{
          id: '1',
          name: primaryStudent.fullName,
          email: primaryStudent.email,
          phone: primaryStudent.phone,
          university: '',
          studentId: '',
          program: '',
          yearOfStudy: ''
        }];
        
        // Add empty roommate objects for additional roommates
        for (let i = 1; i < numberOfRoommates; i++) {
          initialRoommates.push({
            id: (i + 1).toString(),
            name: '',
            email: '',
            phone: '',
            university: '',
            studentId: '',
            program: '',
            yearOfStudy: ''
          });
        }
        
        setRoommatesInfo(initialRoommates);
      } else {
        setRoommatesInfo([]);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'useRoommatesManager.useEffect');
    }
  }, [splitPayment, numberOfRoommates, primaryStudent.fullName, primaryStudent.email, primaryStudent.phone]);

  const handleRoommateChange = (index: number, field: keyof RoommateInfo, value: string) => {
    setRoommatesInfo(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  return {
    roommatesInfo,
    handleRoommateChange
  };
};
