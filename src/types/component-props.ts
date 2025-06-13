import { ReactNode } from 'react';

// Common props shared across multiple components
export interface BaseComponentProps {
  className?: string;
  id?: string;
}

export interface WithChildrenProps extends BaseComponentProps {
  children: ReactNode;
}

export interface WithLoadingProps extends BaseComponentProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface WithErrorProps extends BaseComponentProps {
  error?: Error | null;
  onRetry?: () => void;
}

// Button props
export interface ButtonProps extends BaseComponentProps, WithLoadingProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}

// Card props
export interface CardProps extends WithChildrenProps {
  header?: ReactNode;
  footer?: ReactNode;
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Form props
export interface FormProps extends WithChildrenProps {
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

// Table props
export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => ReactNode;
  className?: string;
}