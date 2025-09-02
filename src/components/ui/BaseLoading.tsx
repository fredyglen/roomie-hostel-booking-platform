import React from 'react';
import { cn } from '@/lib/utils';
import PremiumLoader from './PremiumLoader';

interface BaseLoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const BaseLoading: React.FC<BaseLoadingProps> = ({
  message,
  className,
  size = 'md',
  variant = 'spinner'
}) => (
  <div className={cn('flex flex-col items-center justify-center p-8 animate-fade-in-up', className)}>
    <PremiumLoader
      size={size}
      variant={variant}
      message={message}
    />
  </div>
);