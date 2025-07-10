/**
 * Dynamic Data Loading Validation Script
 * Apple-Grade Validation for Migration Completeness
 * 
 * Purpose: Validate that dynamic data loading system works correctly after migration
 * Compliance: BE CONSCIOUS zero tolerance for data integrity issues
 * Architecture: Comprehensive validation with detailed reporting
 */

import { supabase } from '@/lib/supabase-node';
import { logger as enhancedLogger } from '@/utils/enhanced-logger';

// ============================================================================
// INTERFACES
// ============================================================================

interface ValidationResult {
  readonly testName: string;
  readonly success: boolean;
  readonly message: string;
  readonly dataCount: number;
  readonly details?: any;
}

interface ValidationSummary {
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly allPassed: boolean;
  readonly results: readonly ValidationResult[];
}

// ============================================================================
// VALIDATION TESTS
// ============================================================================

class DynamicDataValidator {
  private readonly results: ValidationResult[] = [];

  /**
   * Run all validation tests
   */
  async runAllValidations(): Promise<ValidationSummary> {
    console.log('🔍 Starting Dynamic Data Loading Validation...');
    console.log('📋 Following BE CONSCIOUS Apple-Grade Standards');
    console.log('');

    this.results.length = 0; // Clear previous results

    // Test 1: Database Connection
    await this.testDatabaseConnection();

    // Test 2: Properties Table Structure
    await this.testPropertiesTableStructure();

    // Test 3: Property Data Retrieval
    await this.testPropertyDataRetrieval();

    // Test 4: Property Search Functionality
    await this.testPropertySearchFunctionality();

    // Test 5: Property Filtering
    await this.testPropertyFiltering();

    // Test 6: Data Integrity
    await this.testDataIntegrity();

    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = this.results.length - passedTests;

    return {
      totalTests: this.results.length,
      passedTests,
      failedTests,
      allPassed: failedTests === 0,
      results: this.results
    };
  }

  /**
   * Test 1: Database Connection
   */
  private async testDatabaseConnection(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

      if (error) {
        this.results.push({
          testName: 'Database Connection',
          success: false,
          message: `Connection failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      this.results.push({
        testName: 'Database Connection',
        success: true,
        message: 'Successfully connected to database',
        dataCount: data?.length || 0
      });

    } catch (error) {
      this.results.push({
        testName: 'Database Connection',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Test 2: Properties Table Structure
   */
  private async testPropertiesTableStructure(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(1);

      if (error) {
        this.results.push({
          testName: 'Properties Table Structure',
          success: false,
          message: `Table access failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      const requiredFields = [
        'id', 'title', 'description', 'price', 'address', 
        'city', 'state', 'type', 'property_category',
        'bedrooms', 'bathrooms', 'is_available'
      ];

      if (data && data.length > 0) {
        const property = data[0];
        const missingFields = requiredFields.filter(field => !(field in property));

        if (missingFields.length === 0) {
          this.results.push({
            testName: 'Properties Table Structure',
            success: true,
            message: 'All required fields present in properties table',
            dataCount: Object.keys(property).length,
            details: { availableFields: Object.keys(property) }
          });
        } else {
          this.results.push({
            testName: 'Properties Table Structure',
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`,
            dataCount: Object.keys(property).length,
            details: { missingFields, availableFields: Object.keys(property) }
          });
        }
      } else {
        this.results.push({
          testName: 'Properties Table Structure',
          success: false,
          message: 'No properties found in database',
          dataCount: 0
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Properties Table Structure',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Test 3: Property Data Retrieval
   */
  private async testPropertyDataRetrieval(): Promise<void> {
    try {
      const { data, error, count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' });

      if (error) {
        this.results.push({
          testName: 'Property Data Retrieval',
          success: false,
          message: `Data retrieval failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      const propertyCount = count || 0;
      const dataCount = data?.length || 0;

      this.results.push({
        testName: 'Property Data Retrieval',
        success: propertyCount > 0,
        message: propertyCount > 0 
          ? `Successfully retrieved ${propertyCount} properties`
          : 'No properties found in database',
        dataCount: propertyCount,
        details: { retrievedCount: dataCount, totalCount: propertyCount }
      });

    } catch (error) {
      this.results.push({
        testName: 'Property Data Retrieval',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Test 4: Property Search Functionality
   */
  private async testPropertySearchFunctionality(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or('title.ilike.%hostel%,description.ilike.%hostel%')
        .limit(10);

      if (error) {
        this.results.push({
          testName: 'Property Search Functionality',
          success: false,
          message: `Search failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      const searchResults = data?.length || 0;

      this.results.push({
        testName: 'Property Search Functionality',
        success: true,
        message: `Search functionality working - found ${searchResults} results for 'hostel'`,
        dataCount: searchResults
      });

    } catch (error) {
      this.results.push({
        testName: 'Property Search Functionality',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Test 5: Property Filtering
   */
  private async testPropertyFiltering(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .limit(10);

      if (error) {
        this.results.push({
          testName: 'Property Filtering',
          success: false,
          message: `Filtering failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      const availableProperties = data?.length || 0;

      this.results.push({
        testName: 'Property Filtering',
        success: true,
        message: `Filtering working - found ${availableProperties} available properties`,
        dataCount: availableProperties
      });

    } catch (error) {
      this.results.push({
        testName: 'Property Filtering',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Test 6: Data Integrity
   */
  private async testDataIntegrity(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, price, bedrooms, bathrooms')
        .not('title', 'is', null)
        .not('price', 'is', null)
        .limit(10);

      if (error) {
        this.results.push({
          testName: 'Data Integrity',
          success: false,
          message: `Integrity check failed: ${error.message}`,
          dataCount: 0
        });
        return;
      }

      const validProperties = data?.filter(p => 
        p.title && 
        p.price && 
        p.bedrooms !== null && 
        p.bathrooms !== null
      ).length || 0;

      const totalProperties = data?.length || 0;

      this.results.push({
        testName: 'Data Integrity',
        success: validProperties === totalProperties,
        message: validProperties === totalProperties
          ? `All ${totalProperties} properties have valid required data`
          : `${validProperties}/${totalProperties} properties have valid data`,
        dataCount: validProperties,
        details: { validCount: validProperties, totalCount: totalProperties }
      });

    } catch (error) {
      this.results.push({
        testName: 'Data Integrity',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        dataCount: 0
      });
    }
  }

  /**
   * Generate validation report
   */
  generateReport(summary: ValidationSummary): string {
    const timestamp = new Date().toISOString();
    
    return `
# 🔍 DYNAMIC DATA LOADING VALIDATION REPORT

**Timestamp**: ${timestamp}
**Status**: ${summary.allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
**Tests**: ${summary.passedTests}/${summary.totalTests} passed

## 📊 VALIDATION SUMMARY

- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passedTests}
- **Failed**: ${summary.failedTests}
- **Success Rate**: ${Math.round((summary.passedTests / summary.totalTests) * 100)}%

## 📋 DETAILED RESULTS

${summary.results.map(result => `
### ${result.success ? '✅' : '❌'} ${result.testName}
- **Status**: ${result.success ? 'PASSED' : 'FAILED'}
- **Message**: ${result.message}
- **Data Count**: ${result.dataCount}
${result.details ? `- **Details**: ${JSON.stringify(result.details, null, 2)}` : ''}
`).join('')}

## 🎯 CONCLUSION

${summary.allPassed 
  ? '🎉 All validation tests passed! Dynamic data loading system is working correctly.'
  : '⚠️ Some tests failed. Please review the failed tests and address the issues before proceeding.'
}

---
Generated by ROOMi Dynamic Data Validator
Following BE CONSCIOUS Apple-Grade Standards
    `.trim();
  }
}

// ============================================================================
// EXPORT VALIDATOR
// ============================================================================

export const dynamicDataValidator = new DynamicDataValidator();

// Export for CLI usage
export const validateDynamicLoading = async (): Promise<void> => {
  const summary = await dynamicDataValidator.runAllValidations();
  const report = dynamicDataValidator.generateReport(summary);
  
  console.log(report);
  
  if (summary.allPassed) {
    console.log('\n🎉 Validation completed successfully!');
    console.log('✅ Dynamic data loading system is ready for production use');
  } else {
    console.log('\n❌ Validation failed!');
    console.log('🔧 Please address the failed tests before proceeding');
    process.exit(1);
  }
};

// Auto-execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDynamicLoading();
}
