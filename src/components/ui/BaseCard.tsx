import React from 'react';
import { cn } from '@/lib/utils';

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const BaseCard: React.FC<BaseCardProps> = ({ children, className, ...props }) => (
  <div className={cn('rounded-lg shadow bg-white p-4', className)} {...props}>
    {children}
  </div>
); 