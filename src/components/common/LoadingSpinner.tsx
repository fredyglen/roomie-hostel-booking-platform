
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-8", className)}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading content"}
    >
      <Loader2
        className={cn("animate-spin text-primary", sizeMap[size])}
        aria-hidden="true"
      />
      {message && (
        <p className="text-muted-foreground mt-4 text-sm text-center" id="loading-message">
          {message}
        </p>
      )}
      {/* Screen reader only text */}
      <span className="sr-only">
        {message || "Loading, please wait..."}
      </span>
    </div>
  );
};

export default LoadingSpinner;
