
import { useState } from 'react';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone: string;
}

export const useEmergencyContactForm = (initialData?: Partial<EmergencyContact>) => {
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    name: initialData?.name || '',
    relationship: initialData?.relationship || 'parent',
    phone: initialData?.phone || '',
    alternatePhone: initialData?.alternatePhone || ''
  });
  
  const handleEmergencyContactAdapter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmergencyContact(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRelationshipChange = (value: string) => {
    setEmergencyContact(prev => ({
      ...prev,
      relationship: value
    }));
  };

  return {
    emergencyContact,
    setEmergencyContact,
    handleEmergencyContactAdapter,
    handleRelationshipChange
  };
};
