
import React, { Suspense, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorMessage?: string;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback = <LoadingSpinner />,
  errorMessage = 'Failed to load component'
}) => {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary errorMessage={errorMessage}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  errorMessage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Lazy loading error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-600">{this.props.errorMessage}</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading with error boundaries
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyLoadWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  );
};
