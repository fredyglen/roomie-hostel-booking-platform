import React from 'react';
import { cn } from '@/lib/utils';

interface BaseErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const BaseError: React.FC<BaseErrorProps> = ({ message, onRetry, className }) => (
  <div className={cn('p-4 bg-red-100 text-red-800 rounded flex flex-col items-start', className)}>
    <div className="font-semibold mb-2">Error</div>
    <div className="mb-2">{message}</div>
    {onRetry && (
      <button
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={onRetry}
      >
        Try Again
      </button>
    )}
  </div>
); 