/**
 * Admin Access Test Component
 * Quick verification tool for admin authentication
 * Following BE CONSCIOUS Apple-grade standards
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ensureDemoAdminExists, verifyAdminAccess } from '@/utils/admin-setup';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';

interface AdminTestResult {
  readonly step: string;
  readonly status: 'success' | 'error' | 'warning';
  readonly message: string;
}

export const AdminAccessTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<readonly AdminTestResult[]>([]);

  const runAdminTest = async () => {
    setIsRunning(true);
    setResults([]);
    const testResults: AdminTestResult[] = [];

    try {
      // Step 1: Check admin setup
      testResults.push({
        step: 'Admin Setup Check',
        status: 'success',
        message: 'Starting admin access verification...'
      });

      const setupResult = await ensureDemoAdminExists();
      testResults.push({
        step: 'Admin User Creation',
        status: setupResult.success ? 'success' : 'error',
        message: setupResult.message
      });

      // Step 2: Verify admin access
      const accessVerified = await verifyAdminAccess();
      testResults.push({
        step: 'Admin Access Verification',
        status: accessVerified ? 'success' : 'error',
        message: accessVerified ? 'Admin access verified successfully' : 'Admin access verification failed'
      });

      // Step 3: Test admin login
      testResults.push({
        step: 'Admin Login Test',
        status: 'success',
        message: 'Testing admin login credentials...'
      });

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@roomi.com',
        password: 'password123'
      });

      if (loginError) {
        testResults.push({
          step: 'Admin Login',
          status: 'error',
          message: `Login failed: ${loginError.message}`
        });
      } else if (loginData.user) {
        testResults.push({
          step: 'Admin Login',
          status: 'success',
          message: 'Admin login successful'
        });

        // Step 4: Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, role, first_name, last_name')
          .eq('id', loginData.user.id)
          .single();

        if (profileError) {
          testResults.push({
            step: 'Profile Check',
            status: 'error',
            message: `Profile fetch failed: ${profileError.message}`
          });
        } else if (profile) {
          testResults.push({
            step: 'Profile Check',
            status: ['admin','supreme_admin','campus_admin'].includes(profile.role) ? 'success' : 'warning',
            message: `Profile found - Role: ${profile.role}, Name: ${profile.first_name} ${profile.last_name}`
          });
        }
      }

      // Final summary
      const hasErrors = testResults.some(r => r.status === 'error');
      const hasWarnings = testResults.some(r => r.status === 'warning');
      
      if (!hasErrors && !hasWarnings) {
        testResults.push({
          step: 'Test Summary',
          status: 'success',
          message: '✅ All admin access checks passed. You can proceed to the Admin Portal.'
        });
      } else if (hasErrors) {
        testResults.push({
          step: 'Test Summary',
          status: 'error',
          message: '❌ Admin access tests failed. Please check the errors above.'
        });
      } else {
        testResults.push({
          step: 'Test Summary',
          status: 'warning',
          message: '⚠️ Admin access tests completed with warnings.'
        });
      }

    } catch (error) {
      testResults.push({
        step: 'Test Execution',
        status: 'error',
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      logger.error('Admin test failed', error);
    } finally {
      setResults(testResults);
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: AdminTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: AdminTestResult['status']) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      warning: 'secondary' as const
    };
    
    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Admin Access Test
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive verification of admin authentication and authorization
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runAdminTest}
          disabled={isRunning}
          className="w-full"
          variant="default"
        >
          {isRunning ? 'Running Tests...' : 'Run Admin Access Test'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Test Results:</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.step}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Admin Credentials:</strong><br />
              Email: admin@roomi.com<br />
              Password: password123
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAccessTest;
