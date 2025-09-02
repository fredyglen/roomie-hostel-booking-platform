/**
 * Migration Execution Script
 * Apple-Grade Migration Orchestrator for ROOMi Platform
 * 
 * Purpose: Execute complete hardcoded data migration with validation and safety checks
 * Compliance: BE CONSCIOUS zero tolerance for data loss, comprehensive validation
 * Architecture: Multi-phase migration with rollback capabilities
 */

import { logger as enhancedLogger } from '@/utils/enhanced-logger';
import { databaseSchemaChecker } from './check-database-schema';
import { hardcodedDataMigrationService } from './migrate-hardcoded-data';

// ============================================================================
// INTERFACES
// ============================================================================

interface MigrationExecutionResult {
  readonly success: boolean;
  readonly phase: string;
  readonly message: string;
  readonly details: {
    readonly schemaValidation: boolean;
    readonly migrationCompleted: boolean;
    readonly dataValidated: boolean;
    readonly migratedCount: number;
    readonly skippedCount: number;
    readonly errorCount: number;
  };
  readonly errors: readonly string[];
  readonly recommendations: readonly string[];
}

// ============================================================================
// MIGRATION ORCHESTRATOR
// ============================================================================

class MigrationOrchestrator {
  private readonly migrationId = `migration_${Date.now()}`;

  /**
   * Execute complete migration process with all safety checks
   */
  async executeMigration(): Promise<MigrationExecutionResult> {
    enhancedLogger.info('Starting migration execution', { migrationId: this.migrationId });

    try {
      // Phase 1: Pre-migration validation
      const validationResult = await this.validatePreMigration();
      if (!validationResult.success) {
        return {
          success: false,
          phase: 'Pre-migration Validation',
          message: 'Pre-migration validation failed',
          details: {
            schemaValidation: false,
            migrationCompleted: false,
            dataValidated: false,
            migratedCount: 0,
            skippedCount: 0,
            errorCount: 1
          },
          errors: validationResult.errors,
          recommendations: validationResult.recommendations
        };
      }

      // Phase 2: Execute data migration
      const migrationResult = await this.executeDataMigration();
      if (!migrationResult.success) {
        return {
          success: false,
          phase: 'Data Migration',
          message: 'Data migration failed',
          details: {
            schemaValidation: true,
            migrationCompleted: false,
            dataValidated: false,
            migratedCount: migrationResult.migratedCount,
            skippedCount: migrationResult.skippedCount,
            errorCount: migrationResult.errorCount
          },
          errors: migrationResult.errors,
          recommendations: ['Review migration logs and fix data issues']
        };
      }

      // Phase 3: Post-migration validation
      const postValidationResult = await this.validatePostMigration();
      if (!postValidationResult.success) {
        return {
          success: false,
          phase: 'Post-migration Validation',
          message: 'Post-migration validation failed',
          details: {
            schemaValidation: true,
            migrationCompleted: true,
            dataValidated: false,
            migratedCount: migrationResult.migratedCount,
            skippedCount: migrationResult.skippedCount,
            errorCount: migrationResult.errorCount
          },
          errors: [postValidationResult.message],
          recommendations: ['Verify data integrity manually']
        };
      }

      // Success!
      enhancedLogger.info('Migration completed successfully', {
        migrationId: this.migrationId,
        migratedCount: migrationResult.migratedCount,
        skippedCount: migrationResult.skippedCount
      });

      return {
        success: true,
        phase: 'Completed',
        message: 'Migration completed successfully',
        details: {
          schemaValidation: true,
          migrationCompleted: true,
          dataValidated: true,
          migratedCount: migrationResult.migratedCount,
          skippedCount: migrationResult.skippedCount,
          errorCount: 0
        },
        errors: [],
        recommendations: [
          'Test dynamic data loading in components',
          'Remove deprecated hardcoded files',
          'Update component imports'
        ]
      };

    } catch (error) {
      enhancedLogger.error('Critical migration error', { error, migrationId: this.migrationId });
      
      return {
        success: false,
        phase: 'Critical Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: {
          schemaValidation: false,
          migrationCompleted: false,
          dataValidated: false,
          migratedCount: 0,
          skippedCount: 0,
          errorCount: 1
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Check logs and database connection']
      };
    }
  }

  /**
   * Phase 1: Pre-migration validation
   */
  private async validatePreMigration(): Promise<{
    success: boolean;
    errors: string[];
    recommendations: string[];
  }> {
    enhancedLogger.info('Phase 1: Pre-migration validation');

    const validation = await databaseSchemaChecker.validateForMigration();
    
    if (!validation.success || !validation.canProceed) {
      return {
        success: false,
        errors: validation.issues,
        recommendations: validation.recommendations
      };
    }

    return {
      success: true,
      errors: [],
      recommendations: validation.recommendations
    };
  }

  /**
   * Phase 2: Execute data migration
   */
  private async executeDataMigration(): Promise<{
    success: boolean;
    migratedCount: number;
    skippedCount: number;
    errorCount: number;
    errors: readonly string[];
  }> {
    enhancedLogger.info('Phase 2: Executing data migration');

    const result = await hardcodedDataMigrationService.migrateAllHardcodedData();
    
    return {
      success: result.success,
      migratedCount: result.migratedCount,
      skippedCount: result.skippedCount,
      errorCount: result.errorCount,
      errors: result.errors
    };
  }

  /**
   * Phase 3: Post-migration validation
   */
  private async validatePostMigration(): Promise<{
    success: boolean;
    message: string;
  }> {
    enhancedLogger.info('Phase 3: Post-migration validation');

    const validation = await hardcodedDataMigrationService.validateMigration();
    
    return {
      success: validation.success,
      message: validation.message
    };
  }

  /**
   * Generate migration report
   */
  generateMigrationReport(result: MigrationExecutionResult): string {
    const timestamp = new Date().toISOString();
    
    return `
# 🚀 MIGRATION EXECUTION REPORT

**Migration ID**: ${this.migrationId}
**Timestamp**: ${timestamp}
**Status**: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
**Phase**: ${result.phase}

## 📊 MIGRATION DETAILS

- **Schema Validation**: ${result.details.schemaValidation ? '✅' : '❌'}
- **Migration Completed**: ${result.details.migrationCompleted ? '✅' : '❌'}
- **Data Validated**: ${result.details.dataValidated ? '✅' : '❌'}
- **Properties Migrated**: ${result.details.migratedCount}
- **Properties Skipped**: ${result.details.skippedCount}
- **Errors**: ${result.details.errorCount}

## 📝 MESSAGE
${result.message}

${result.errors.length > 0 ? `
## ❌ ERRORS
${result.errors.map(error => `- ${error}`).join('\n')}
` : ''}

${result.recommendations.length > 0 ? `
## 💡 RECOMMENDATIONS
${result.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}

---
Generated by ROOMi Migration Orchestrator
Following BE CONSCIOUS Apple-Grade Standards
    `.trim();
  }
}

// ============================================================================
// EXPORT MIGRATION ORCHESTRATOR
// ============================================================================

export const migrationOrchestrator = new MigrationOrchestrator();

// Export for CLI usage
export const executeMigration = async (): Promise<void> => {
  console.log('🚀 Starting ROOMi Platform Data Migration...');
  console.log('📋 Following BE CONSCIOUS Apple-Grade Standards');
  console.log('');

  try {
    const result = await migrationOrchestrator.executeMigration();

    // Generate and display report
    const report = migrationOrchestrator.generateMigrationReport(result);
    console.log(report);

    if (result.success) {
      console.log('');
      console.log('🎉 Migration completed successfully!');
      console.log('🔄 Next steps:');
      console.log('   1. Test dynamic data loading in components');
      console.log('   2. Remove deprecated hardcoded files');
      console.log('   3. Complete Phase 1 validation');
    } else {
      console.log('');
      console.log('❌ Migration failed!');
      console.log('🔧 Please address the issues above and retry');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Critical migration error:', error);
    process.exit(1);
  }
};

// Auto-execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  executeMigration();
}
