import React, { useState } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/utils/enhanced-logger';

const TestAuth: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    logger.info('Test result', { message });
  };

  const testDemoAccount = async (email: string, password: string, expectedRole: string) => {
    try {
      setIsLoading(true);
      addResult(`Testing ${email}...`);

      // First sign out if already signed in
      await signOut();
      addResult(`Signed out, now attempting login...`);

      // Try to sign in
      await signIn(email, password);
      addResult(`✅ Login successful for ${email}`);

      // Wait a moment for the auth context to update
      setTimeout(() => {
        addResult(`Checking user state...`);
        if (user) {
          const userRole = (user as any).role;
          addResult(`User role detected: ${userRole}`);
          addResult(`User email: ${user.email}`);
          addResult(`User ID: ${user.id}`);

          if (userRole === expectedRole) {
            addResult(`✅ Role matches expected: ${expectedRole}`);
          } else {
            addResult(`❌ Role mismatch. Expected: ${expectedRole}, Got: ${userRole}`);
          }
        } else {
          addResult(`❌ User object is null after login`);
        }
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      addResult(`❌ Error testing ${email}: ${error instanceof Error ? error.message : String(error)}`);
      setIsLoading(false);
    }
  };

  const checkDemoAccountsInDB = async () => {
    try {
      setIsLoading(true);
      addResult('Checking demo accounts in database...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .in('email', ['student@roomi.com', 'owner@roomi.com', 'admin@roomi.com']);
      
      if (error) {
        addResult(`❌ Database error: ${error.message}`);
        return;
      }
      
      if (data && data.length > 0) {
        addResult(`✅ Found ${data.length} demo accounts in database:`);
        data.forEach(account => {
          addResult(`  - ${account.email}: ${account.role}`);
        });
      } else {
        addResult(`❌ No demo accounts found in database`);
      }
      
    } catch (error) {
      addResult(`❌ Error checking database: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const quickLogin = async (email: string) => {
    try {
      setIsLoading(true);
      addResult(`Quick login attempt: ${email}`);

      await signIn(email, 'password123');
      addResult(`✅ Quick login successful`);

      // Wait a moment for auth state to update
      setTimeout(() => {
        if (user) {
          addResult(`User logged in: ${user.email}, Role: ${(user as any).role}`);
        }
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      addResult(`❌ Quick login error: ${error instanceof Error ? error.message : String(error)}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Flow Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current User Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Current User:</h3>
              {user ? (
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {(user as any).role || 'Not set'}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                </div>
              ) : (
                <p className="text-gray-600">Not logged in</p>
              )}
            </div>

            {/* Test Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={checkDemoAccountsInDB}
                  disabled={isLoading}
                  variant="outline"
                >
                  Check DB
                </Button>

                <Button
                  onClick={() => testDemoAccount('student@roomi.com', 'password123', 'student')}
                  disabled={isLoading}
                >
                  Test Student
                </Button>

                <Button
                  onClick={() => testDemoAccount('owner@roomi.com', 'password123', 'owner')}
                  disabled={isLoading}
                >
                  Test Owner
                </Button>

                <Button
                  onClick={() => testDemoAccount('admin@roomi.com', 'password123', 'admin')}
                  disabled={isLoading}
                >
                  Test Admin
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={() => quickLogin('student@roomi.com')}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Quick Student
                </Button>

                <Button
                  onClick={() => quickLogin('owner@roomi.com')}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Quick Owner
                </Button>

                <Button
                  onClick={() => quickLogin('admin@roomi.com')}
                  disabled={isLoading}
                  variant="secondary"
                >
                  Quick Admin
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={signOut}
                disabled={isLoading}
                variant="destructive"
              >
                Sign Out
              </Button>
              
              <Button 
                onClick={clearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            </div>

            {/* Test Results */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <div className="space-y-1 text-sm font-mono max-h-96 overflow-y-auto">
                {testResults.length > 0 ? (
                  testResults.map((result, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {result}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No test results yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAuth;
