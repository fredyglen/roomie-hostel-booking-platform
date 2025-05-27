
import React from 'react';
import AmenitiesSelector from './AmenitiesSelector';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormValues } from './PropertyFormSchema';

interface AmenitiesFieldsProps {
  form: UseFormReturn<PropertyFormValues>;
  hasFeatureAccess: (feature: string) => boolean;
}

const AmenitiesFields: React.FC<AmenitiesFieldsProps> = ({ form, hasFeatureAccess }) => {
  return <AmenitiesSelector form={form} />;
};

export default AmenitiesFields;
