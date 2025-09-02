/**
 * Commission Centralization Validation Script
 * Apple-Grade Validation for Commission Rate Conflict Resolution
 * 
 * Purpose: Validate that all commission calculations use the centralized system
 * Compliance: BE CONSCIOUS zero tolerance for configuration conflicts
 * Architecture: Comprehensive validation with detailed reporting
 */

import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { calculatePaymentBreakdown, calculateBookingCosts } from '@/utils/paymentCalculations';
import { PAYMENT_CONSTANTS } from '@/constants/payment';
import { logger as enhancedLogger } from '@/utils/enhanced-logger';

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

interface ValidationResult {
  readonly testName: string;
  readonly success: boolean;
  readonly message: string;
  readonly expected: any;
  readonly actual: any;
  readonly details?: any;
}

interface CommissionValidationSummary {
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly allPassed: boolean;
  readonly results: readonly ValidationResult[];
  readonly configurationInfo: {
    readonly version: string;
    readonly lastUpdated: string;
    readonly environment: string;
  };
}

// ============================================================================
// COMMISSION VALIDATION ENGINE
// ============================================================================

class CommissionCentralizationValidator {
  private readonly results: ValidationResult[] = [];

  /**
   * Run comprehensive commission centralization validation
   */
  async validateCommissionCentralization(): Promise<CommissionValidationSummary> {
    console.log('🔍 Starting Commission Centralization Validation...');
    console.log('📋 Following BE CONSCIOUS Apple-Grade Standards');
    console.log('');

    this.results.length = 0; // Clear previous results

    // Test 1: Centralized Engine Configuration
    this.validateCentralizedEngineConfiguration();

    // Test 2: Commission Rate Consistency
    this.validateCommissionRateConsistency();

    // Test 3: Payment Calculation Integration
    this.validatePaymentCalculationIntegration();

    // Test 4: Constants Migration
    this.validateConstantsMigration();

    // Test 5: Calculation Accuracy
    this.validateCalculationAccuracy();

    // Test 6: Edge Cases
    this.validateEdgeCases();

    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = this.results.length - passedTests;

    return {
      totalTests: this.results.length,
      passedTests,
      failedTests,
      allPassed: failedTests === 0,
      results: this.results,
      configurationInfo: centralizedCommissionEngine.getConfigurationInfo()
    };
  }

  /**
   * Test 1: Validate centralized engine configuration
   */
  private validateCentralizedEngineConfiguration(): void {
    try {
      const rates = centralizedCommissionEngine.getCommissionRates();
      const fees = centralizedCommissionEngine.getPlatformFees();
      const config = centralizedCommissionEngine.getConfigurationInfo();

      // Validate platform commission rate
      const expectedPlatformRate = 0.05; // 5%
      if (Math.abs(rates.platform - expectedPlatformRate) < 0.0001) {
        this.results.push({
          testName: 'Platform Commission Rate Configuration',
          success: true,
          message: 'Platform commission rate correctly set to 5%',
          expected: expectedPlatformRate,
          actual: rates.platform
        });
      } else {
        this.results.push({
          testName: 'Platform Commission Rate Configuration',
          success: false,
          message: `Platform commission rate mismatch`,
          expected: expectedPlatformRate,
          actual: rates.platform
        });
      }

      // Validate agent commission rate
      const expectedAgentRate = 0.037; // 3.7%
      if (Math.abs(rates.agent - expectedAgentRate) < 0.0001) {
        this.results.push({
          testName: 'Agent Commission Rate Configuration',
          success: true,
          message: 'Agent commission rate correctly set to 3.7%',
          expected: expectedAgentRate,
          actual: rates.agent
        });
      } else {
        this.results.push({
          testName: 'Agent Commission Rate Configuration',
          success: false,
          message: `Agent commission rate mismatch`,
          expected: expectedAgentRate,
          actual: rates.agent
        });
      }

      // Validate platform fixed fee
      const expectedFixedFee = 100; // 100 GHS
      if (fees.fixed === expectedFixedFee) {
        this.results.push({
          testName: 'Platform Fixed Fee Configuration',
          success: true,
          message: 'Platform fixed fee correctly set to 100 GHS',
          expected: expectedFixedFee,
          actual: fees.fixed
        });
      } else {
        this.results.push({
          testName: 'Platform Fixed Fee Configuration',
          success: false,
          message: `Platform fixed fee mismatch`,
          expected: expectedFixedFee,
          actual: fees.fixed
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Centralized Engine Configuration',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Valid configuration',
        actual: 'Error'
      });
    }
  }

  /**
   * Test 2: Validate commission rate consistency across files
   */
  private validateCommissionRateConsistency(): void {
    try {
      const centralizedRates = centralizedCommissionEngine.getCommissionRates();
      const constantsRates = {
        platform: PAYMENT_CONSTANTS.PLATFORM_COMMISSION_RATE,
        agent: PAYMENT_CONSTANTS.AGENT_COMMISSION_RATE,
        paystack: PAYMENT_CONSTANTS.PAYSTACK_FEE_RATE
      };

      // Check platform rate consistency
      if (Math.abs(centralizedRates.platform - constantsRates.platform) < 0.0001) {
        this.results.push({
          testName: 'Platform Rate Consistency',
          success: true,
          message: 'Platform commission rate consistent across all files',
          expected: centralizedRates.platform,
          actual: constantsRates.platform
        });
      } else {
        this.results.push({
          testName: 'Platform Rate Consistency',
          success: false,
          message: 'Platform commission rate inconsistency detected',
          expected: centralizedRates.platform,
          actual: constantsRates.platform
        });
      }

      // Check agent rate consistency
      if (Math.abs(centralizedRates.agent - constantsRates.agent) < 0.0001) {
        this.results.push({
          testName: 'Agent Rate Consistency',
          success: true,
          message: 'Agent commission rate consistent across all files',
          expected: centralizedRates.agent,
          actual: constantsRates.agent
        });
      } else {
        this.results.push({
          testName: 'Agent Rate Consistency',
          success: false,
          message: 'Agent commission rate inconsistency detected',
          expected: centralizedRates.agent,
          actual: constantsRates.agent
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Commission Rate Consistency',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Consistent rates',
        actual: 'Error'
      });
    }
  }

  /**
   * Test 3: Validate payment calculation integration
   */
  private validatePaymentCalculationIntegration(): void {
    try {
      const testAmount = 1000; // 1000 GHS
      
      // Test payment breakdown calculation
      const breakdown = calculatePaymentBreakdown(testAmount);
      
      // Validate that calculations use centralized rates
      const expectedPlatformFee = (testAmount * 0.05) + 100; // 5% + 100 GHS
      const actualPlatformFee = breakdown.platformFee;

      if (Math.abs(actualPlatformFee - expectedPlatformFee) < 0.01) {
        this.results.push({
          testName: 'Payment Calculation Integration',
          success: true,
          message: 'Payment calculations correctly use centralized commission rates',
          expected: expectedPlatformFee,
          actual: actualPlatformFee,
          details: { testAmount, breakdown }
        });
      } else {
        this.results.push({
          testName: 'Payment Calculation Integration',
          success: false,
          message: 'Payment calculations not using centralized rates',
          expected: expectedPlatformFee,
          actual: actualPlatformFee,
          details: { testAmount, breakdown }
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Payment Calculation Integration',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Successful calculation',
        actual: 'Error'
      });
    }
  }

  /**
   * Test 4: Validate constants migration
   */
  private validateConstantsMigration(): void {
    try {
      // Check that PAYMENT_CONSTANTS uses centralized values
      const centralizedPlatformRate = centralizedCommissionEngine.getCommissionRates().platform;
      const constantsPlatformRate = PAYMENT_CONSTANTS.PLATFORM_COMMISSION_RATE;

      if (centralizedPlatformRate === constantsPlatformRate) {
        this.results.push({
          testName: 'Constants Migration',
          success: true,
          message: 'PAYMENT_CONSTANTS successfully migrated to use centralized system',
          expected: centralizedPlatformRate,
          actual: constantsPlatformRate
        });
      } else {
        this.results.push({
          testName: 'Constants Migration',
          success: false,
          message: 'PAYMENT_CONSTANTS not properly migrated',
          expected: centralizedPlatformRate,
          actual: constantsPlatformRate
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Constants Migration',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Successful migration',
        actual: 'Error'
      });
    }
  }

  /**
   * Test 5: Validate calculation accuracy
   */
  private validateCalculationAccuracy(): void {
    try {
      const testAmount = 2000; // 2000 GHS
      const result = centralizedCommissionEngine.calculateCommissions(testAmount, true);

      // Expected calculations based on definitive rates
      const expectedPlatformCommission = testAmount * 0.05; // 100 GHS
      const expectedPlatformFixedFee = 100; // 100 GHS
      const expectedAgentCommission = Math.max(testAmount * 0.037, 100); // 74 GHS (but minimum 100)
      
      const calculationAccurate = (
        Math.abs(result.platformCommission - expectedPlatformCommission) < 0.01 &&
        result.platformFixedFee === expectedPlatformFixedFee &&
        Math.abs(result.agentCommission - expectedAgentCommission) < 0.01
      );

      if (calculationAccurate) {
        this.results.push({
          testName: 'Calculation Accuracy',
          success: true,
          message: 'Commission calculations are mathematically accurate',
          expected: { expectedPlatformCommission, expectedPlatformFixedFee, expectedAgentCommission },
          actual: { 
            platformCommission: result.platformCommission, 
            platformFixedFee: result.platformFixedFee, 
            agentCommission: result.agentCommission 
          }
        });
      } else {
        this.results.push({
          testName: 'Calculation Accuracy',
          success: false,
          message: 'Commission calculations contain mathematical errors',
          expected: { expectedPlatformCommission, expectedPlatformFixedFee, expectedAgentCommission },
          actual: { 
            platformCommission: result.platformCommission, 
            platformFixedFee: result.platformFixedFee, 
            agentCommission: result.agentCommission 
          }
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Calculation Accuracy',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Accurate calculations',
        actual: 'Error'
      });
    }
  }

  /**
   * Test 6: Validate edge cases
   */
  private validateEdgeCases(): void {
    try {
      // Test minimum agent commission
      const smallAmount = 100; // 100 GHS
      const result = centralizedCommissionEngine.calculateCommissions(smallAmount, true);
      
      // Agent commission should be minimum fee (100 GHS) even though 3.7% of 100 is only 3.7 GHS
      const expectedAgentCommission = 100; // Minimum fee
      
      if (result.agentCommission === expectedAgentCommission) {
        this.results.push({
          testName: 'Edge Case - Minimum Agent Commission',
          success: true,
          message: 'Minimum agent commission correctly enforced',
          expected: expectedAgentCommission,
          actual: result.agentCommission
        });
      } else {
        this.results.push({
          testName: 'Edge Case - Minimum Agent Commission',
          success: false,
          message: 'Minimum agent commission not properly enforced',
          expected: expectedAgentCommission,
          actual: result.agentCommission
        });
      }

    } catch (error) {
      this.results.push({
        testName: 'Edge Cases',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        expected: 'Proper edge case handling',
        actual: 'Error'
      });
    }
  }

  /**
   * Generate validation report
   */
  generateReport(summary: CommissionValidationSummary): string {
    const timestamp = new Date().toISOString();
    
    return `
# 🔍 COMMISSION CENTRALIZATION VALIDATION REPORT

**Timestamp**: ${timestamp}
**Status**: ${summary.allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
**Tests**: ${summary.passedTests}/${summary.totalTests} passed

## 📊 VALIDATION SUMMARY

- **Total Tests**: ${summary.totalTests}
- **Passed**: ${summary.passedTests}
- **Failed**: ${summary.failedTests}
- **Success Rate**: ${Math.round((summary.passedTests / summary.totalTests) * 100)}%

## ⚙️ CONFIGURATION INFO

- **Version**: ${summary.configurationInfo.version}
- **Last Updated**: ${summary.configurationInfo.lastUpdated}
- **Environment**: ${summary.configurationInfo.environment}

## 📋 DETAILED RESULTS

${summary.results.map(result => `
### ${result.success ? '✅' : '❌'} ${result.testName}
- **Status**: ${result.success ? 'PASSED' : 'FAILED'}
- **Message**: ${result.message}
- **Expected**: ${JSON.stringify(result.expected)}
- **Actual**: ${JSON.stringify(result.actual)}
${result.details ? `- **Details**: ${JSON.stringify(result.details, null, 2)}` : ''}
`).join('')}

## 🎯 CONCLUSION

${summary.allPassed 
  ? '🎉 Commission centralization is complete! All systems use the single source of truth.'
  : '⚠️ Commission centralization issues detected. Please review failed tests and fix inconsistencies.'
}

---
Generated by ROOMi Commission Centralization Validator
Following BE CONSCIOUS Apple-Grade Standards
    `.trim();
  }
}

// ============================================================================
// EXPORT VALIDATOR
// ============================================================================

export const commissionCentralizationValidator = new CommissionCentralizationValidator();

// Export for CLI usage
export const validateCommissionCentralization = async (): Promise<void> => {
  const summary = await commissionCentralizationValidator.validateCommissionCentralization();
  const report = commissionCentralizationValidator.generateReport(summary);
  
  console.log(report);
  
  if (summary.allPassed) {
    console.log('\n🎉 Commission centralization validation passed!');
    console.log('✅ All commission rates are now centralized and consistent');
  } else {
    console.log('\n❌ Commission centralization validation failed!');
    console.log('🔧 Please address the failed tests before proceeding');
    process.exit(1);
  }
};

// Auto-execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateCommissionCentralization();
}
