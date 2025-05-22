
import { useState } from 'react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const usePersonalInfoForm = (initialData?: Partial<PersonalInfo>) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });
  
  const handlePersonalInfoAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    personalInfo,
    setPersonalInfo,
    handlePersonalInfoAdapter
  };
};
