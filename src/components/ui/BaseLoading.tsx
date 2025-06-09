import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseLoadingProps {
  message?: string;
  className?: string;
}

export const BaseLoading: React.FC<BaseLoadingProps> = ({ message, className }) => (
  <div className={cn('flex flex-col items-center justify-center p-8', className)}>
    <Loader2 className="animate-spin text-primary w-8 h-8" />
    {message && (
      <p className="text-muted-foreground mt-4 text-sm text-center">{message}</p>
    )}
  </div>
); 