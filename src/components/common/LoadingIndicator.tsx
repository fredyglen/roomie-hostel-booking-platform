
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  'data-testid'?: string;
}

/**
 * A reusable loading indicator component with optional message
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'md',
  message,
  className,
  'data-testid': testId,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4", className)}
      data-testid={testId}
    >
      <Loader className={cn("animate-spin text-primary", sizeMap[size])} />
      {message && (
        <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingIndicator;
