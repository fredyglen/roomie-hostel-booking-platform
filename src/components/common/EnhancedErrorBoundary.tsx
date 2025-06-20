/**
 * Enhanced Error Boundary with better error reporting and user experience
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/utils/enhanced-logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Log error with context
    logger.error(`ErrorBoundary (${level}): Caught an error`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      level,
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // This would integrate with your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level: this.props.level,
    };

    // In development, use logger instead of console
    if (import.meta.env.DEV) {
      import('@/utils/enhanced-logger').then(({ logger }) => {
        logger.error('Error Report', errorReport);
      });
    }
    
    // TODO: Implement actual error reporting service
    // Example: Sentry.captureException(error, { extra: errorReport });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorId } = this.state;
    const subject = `Bug Report - Error ID: ${errorId}`;
    const body = `
Error Details:
- Error ID: ${errorId}
- Message: ${error?.message}
- URL: ${window.location.href}
- Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]
    `.trim();

    const mailtoUrl = `mailto:support@roomi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showErrorDetails = false, level = 'component' } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Different error UIs based on level
      if (level === 'critical') {
        return this.renderCriticalError();
      }

      if (level === 'page') {
        return this.renderPageError();
      }

      return this.renderComponentError();
    }

    return children;
  }

  private renderCriticalError() {
    const { error, errorId } = this.state;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-600">
              Critical Application Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              We're sorry, but something went wrong. The application needs to be restarted.
            </p>
            
            <div className="text-xs text-gray-400 text-center">
              Error ID: {errorId}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart Application
              </Button>
              
              <Button variant="outline" onClick={this.handleReportBug} className="w-full">
                <Bug className="h-4 w-4 mr-2" />
                Report Bug
              </Button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Developer Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {error?.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderPageError() {
    const { error, errorId } = this.state;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-lg text-orange-600">
              Page Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              This page encountered an error and couldn't load properly.
            </p>
            
            <div className="text-xs text-gray-400 text-center">
              Error ID: {errorId}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={this.handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {error?.message}
                  {error?.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  private renderComponentError() {
    const { error, errorId } = this.state;
    
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-red-800">
              Component Error
            </h4>
            <p className="text-sm text-red-700 mt-1">
              This component encountered an error and couldn't render.
            </p>
            
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={this.handleRetry}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-red-600">
                  Error Details (Dev)
                </summary>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">
                  {error?.message}
                </pre>
              </details>
            )}
            
            <div className="text-xs text-red-500 mt-2">
              Error ID: {errorId}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EnhancedErrorBoundary;
