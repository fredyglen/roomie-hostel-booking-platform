import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Groups related property-form fields under a section heading.
 *
 * Unlike the shared component in `@/components/common/form/FormSection`, this one
 * does not impose a grid on its children -- every caller in this directory supplies
 * its own layout wrapper (see LocationFields, VerificationFields).
 */
export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {children}
    </div>
  );
};

export default FormSection;
