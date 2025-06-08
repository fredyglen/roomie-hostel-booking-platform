import React from 'react';

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div className="p-4 bg-red-100 text-red-800 rounded flex flex-col items-start">
    <div className="font-semibold mb-2">Error</div>
    <div className="mb-2">{error instanceof Error ? error.message : 'An unknown error occurred.'}</div>
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

export default ErrorDisplay;
