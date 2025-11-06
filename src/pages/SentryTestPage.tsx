/**
 * Sentry Test Page
 * 
 * This page is used to test Sentry integration.
 * Access it at: /sentry-test (add route in your router)
 * 
 * IMPORTANT: Remove this page before production deployment!
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { captureSentryException, captureSentryMessage } from '@/config/sentry.config';
import { ErrorHandler } from '@/utils/ErrorHandler';

export default function SentryTestPage() {
  const handleTestError = () => {
    try {
      throw new Error('Test error from Sentry Test Page');
    } catch (error) {
      ErrorHandler.handle(error, 'Testing Sentry integration', {
        showUser: false,
        context: {
          test: true,
          page: 'SentryTestPage',
          timestamp: new Date().toISOString(),
        },
      });
    }
  };

  const handleTestException = () => {
    const testError = new Error('Direct Sentry exception test');
    captureSentryException(testError, {
      test: true,
      method: 'captureSentryException',
      timestamp: new Date().toISOString(),
    });
  };

  const handleTestMessage = () => {
    captureSentryMessage('Test message from Sentry Test Page', 'info');
  };

  const handleTestUncaughtError = () => {
    // This will be caught by Sentry's global error handler
    throw new Error('Uncaught error test - this should appear in Sentry!');
  };

  const handleTestPromiseRejection = () => {
    // This will be caught by Sentry's unhandled rejection handler
    Promise.reject(new Error('Unhandled promise rejection test'));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🔍 Sentry Integration Test Page</CardTitle>
          <CardDescription>
            Test Sentry error monitoring integration. Click the buttons below to trigger different types of errors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> This page is for testing only. Remove it before production deployment!
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">1. Test ErrorHandler Integration</h3>
              <Button onClick={handleTestError} variant="outline" className="w-full">
                Trigger Error via ErrorHandler
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Tests the ErrorHandler.handle() method with Sentry integration
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Test Direct Exception Capture</h3>
              <Button onClick={handleTestException} variant="outline" className="w-full">
                Trigger Direct Sentry Exception
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Tests captureSentryException() directly
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Test Message Capture</h3>
              <Button onClick={handleTestMessage} variant="outline" className="w-full">
                Send Test Message to Sentry
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Tests captureSentryMessage() for info logging
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Test Uncaught Error</h3>
              <Button onClick={handleTestUncaughtError} variant="destructive" className="w-full">
                Throw Uncaught Error
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Tests Sentry's global error handler (will crash the page temporarily)
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. Test Promise Rejection</h3>
              <Button onClick={handleTestPromiseRejection} variant="destructive" className="w-full">
                Trigger Unhandled Promise Rejection
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Tests Sentry's unhandled rejection handler
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">How to Verify:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click any button above to trigger an error</li>
              <li>Go to your Sentry dashboard: <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="underline">sentry.io</a></li>
              <li>Navigate to: Issues → All Issues</li>
              <li>You should see the test error appear within 1-2 seconds</li>
              <li>Click on the error to see full details, stack trace, and breadcrumbs</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Environment:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Mode:</strong> {import.meta.env.MODE}</li>
              <li><strong>Production:</strong> {import.meta.env.PROD ? 'Yes' : 'No'}</li>
              <li><strong>Sentry DSN:</strong> {import.meta.env.VITE_SENTRY_DSN ? '✅ Configured' : '❌ Missing'}</li>
              <li><strong>Sentry Active:</strong> {import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN ? '✅ Yes' : '❌ No (dev mode or DSN missing)'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

