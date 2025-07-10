/**
 * Dynamic Data Loading Test Component
 * Apple-Grade Testing Component for Migration Validation
 * 
 * Purpose: Test dynamic data loading system after migration
 * Compliance: BE CONSCIOUS zero tolerance for any types, comprehensive error handling
 * Architecture: Real-time testing with detailed reporting
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useDynamicProperties, 
  useFeaturedProperties,
  usePropertySearch,
  useAvailableProperties 
} from '@/hooks/property/useDynamicProperties';
import { logger as enhancedLogger } from '@/utils/enhanced-logger';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Search, 
  Star,
  Eye,
  RefreshCw
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface TestResult {
  readonly testName: string;
  readonly success: boolean;
  readonly message: string;
  readonly dataCount: number;
  readonly executionTime: number;
}

// ============================================================================
// DYNAMIC DATA TEST COMPONENT
// ============================================================================

const DynamicDataTest: React.FC = () => {
  const [testResults, setTestResults] = useState<readonly TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Test hooks
  const allPropertiesTest = useDynamicProperties();
  const featuredPropertiesTest = useFeaturedProperties(6);
  const searchTest = usePropertySearch('hostel');
  const availablePropertiesTest = useAvailableProperties();

  /**
   * Run comprehensive dynamic data tests
   */
  const runDynamicDataTests = async (): Promise<void> => {
    setIsRunningTests(true);
    setTestResults([]);
    
    enhancedLogger.info('Starting dynamic data loading tests');

    const results: TestResult[] = [];

    try {
      // Test 1: All Properties Loading
      const startTime1 = Date.now();
      const test1Success = !allPropertiesTest.isLoading && !allPropertiesTest.isError;
      results.push({
        testName: 'All Properties Loading',
        success: test1Success,
        message: test1Success 
          ? 'Successfully loaded all properties'
          : allPropertiesTest.error?.message || 'Failed to load properties',
        dataCount: allPropertiesTest.properties.length,
        executionTime: Date.now() - startTime1
      });

      // Test 2: Featured Properties Loading
      const startTime2 = Date.now();
      const test2Success = !featuredPropertiesTest.isLoading && !featuredPropertiesTest.isError;
      results.push({
        testName: 'Featured Properties Loading',
        success: test2Success,
        message: test2Success 
          ? 'Successfully loaded featured properties'
          : featuredPropertiesTest.error?.message || 'Failed to load featured properties',
        dataCount: featuredPropertiesTest.properties.length,
        executionTime: Date.now() - startTime2
      });

      // Test 3: Property Search
      const startTime3 = Date.now();
      const test3Success = !searchTest.isLoading && !searchTest.isError;
      results.push({
        testName: 'Property Search (hostel)',
        success: test3Success,
        message: test3Success 
          ? 'Successfully executed property search'
          : searchTest.error?.message || 'Failed to execute search',
        dataCount: searchTest.properties.length,
        executionTime: Date.now() - startTime3
      });

      // Test 4: Available Properties Filter
      const startTime4 = Date.now();
      const test4Success = !availablePropertiesTest.isLoading && !availablePropertiesTest.isError;
      results.push({
        testName: 'Available Properties Filter',
        success: test4Success,
        message: test4Success 
          ? 'Successfully loaded available properties'
          : availablePropertiesTest.error?.message || 'Failed to load available properties',
        dataCount: availablePropertiesTest.properties.length,
        executionTime: Date.now() - startTime4
      });

      setTestResults(results);
      
      const successCount = results.filter(r => r.success).length;
      enhancedLogger.info('Dynamic data tests completed', {
        totalTests: results.length,
        successCount,
        failureCount: results.length - successCount
      });

    } catch (error) {
      enhancedLogger.error('Error running dynamic data tests', { error });
      results.push({
        testName: 'Test Execution',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0,
        executionTime: 0
      });
      setTestResults(results);
    } finally {
      setIsRunningTests(false);
    }
  };

  /**
   * Get test status summary
   */
  const getTestSummary = () => {
    if (testResults.length === 0) return null;
    
    const successCount = testResults.filter(r => r.success).length;
    const totalCount = testResults.length;
    const totalDataCount = testResults.reduce((sum, r) => sum + r.dataCount, 0);
    
    return {
      successCount,
      totalCount,
      totalDataCount,
      allPassed: successCount === totalCount
    };
  };

  const summary = getTestSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Dynamic Data Loading Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Test the dynamic data loading system after migration
            </div>
            <Button 
              onClick={runDynamicDataTests}
              disabled={isRunningTests}
              className="flex items-center"
            >
              {isRunningTests ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRunningTests ? 'Running Tests...' : 'Run Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Summary */}
      {summary && (
        <Alert className={summary.allPassed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className="flex items-center">
            {summary.allPassed ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 mr-2 text-red-600" />
            )}
            <span className="font-medium">
              {summary.successCount}/{summary.totalCount} tests passed
            </span>
            <span className="ml-2 text-sm">
              • {summary.totalDataCount} total properties loaded
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Individual Test Results */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testResults.map((result, index) => (
            <Card key={index} className={result.success ? 'border-green-200' : 'border-red-200'}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    )}
                    {result.testName}
                  </span>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{result.message}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Data Count: {result.dataCount}</span>
                    <span>Time: {result.executionTime}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Live Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Live Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* All Properties */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {allPropertiesTest.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  allPropertiesTest.properties.length
                )}
              </div>
              <div className="text-sm text-gray-600">All Properties</div>
            </div>

            {/* Featured Properties */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {featuredPropertiesTest.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  featuredPropertiesTest.properties.length
                )}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>

            {/* Search Results */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {searchTest.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  searchTest.properties.length
                )}
              </div>
              <div className="text-sm text-gray-600">Search: "hostel"</div>
            </div>

            {/* Available Properties */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {availablePropertiesTest.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  availablePropertiesTest.properties.length
                )}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicDataTest;
