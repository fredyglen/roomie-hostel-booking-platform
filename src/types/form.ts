import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormFieldProps<T extends FieldValues> {
  name: keyof T & string;
  control: UseFormReturn<T>['control'];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
}

export interface FieldRenderProps<T> {
  field: {
    name: string;
    value: T;
    onChange: (value: T) => void;
    onBlur: () => void;
    ref: React.Ref<any>;
  };
}