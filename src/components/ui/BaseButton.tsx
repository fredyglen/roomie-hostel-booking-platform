import React from 'react';
import { cn } from '@/lib/utils';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export const BaseButton: React.FC<BaseButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50',
  }[variant];
  return (
    <button className={cn('px-4 py-2 rounded transition', variantClass, className)} {...props}>
      {children}
    </button>
  );
}; 