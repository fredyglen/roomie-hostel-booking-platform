
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorDisplayProps {
  error?: string | Error | null;
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
  const errorMessage = error
    ? (typeof error === 'string' ? error : error.message || 'An unknown error occurred')
    : 'An unknown error occurred';

  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle
        className="h-12 w-12 text-red-500 mb-4"
        aria-hidden="true"
      />
      <h3
        className="text-lg font-semibold text-gray-900 mb-2"
        id="error-title"
      >
        {title}
      </h3>
      <p
        className="text-gray-600 mb-4"
        id="error-message"
        aria-describedby="error-title"
      >
        {errorMessage}
      </p>
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Retry the failed operation"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
