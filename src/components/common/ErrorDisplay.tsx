
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  title = 'Something went wrong',
  onRetry, 
  showRetry = true 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{errorMessage}</p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
