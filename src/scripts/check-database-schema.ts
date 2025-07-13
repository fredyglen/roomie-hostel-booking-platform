/**
 * Database Schema Checker
 * Apple-Grade Database Validation for Migration Preparation
 * 
 * Purpose: Verify database schema before running hardcoded data migration
 * Compliance: BE CONSCIOUS zero tolerance for data loss, comprehensive validation
 * Architecture: Schema validation with detailed reporting
 */

import { supabase } from '@/lib/supabase-node';
import { logger as enhancedLogger } from '@/utils/enhanced-logger';

// ============================================================================
// INTERFACES
// ============================================================================

interface TableColumn {
  readonly column_name: string;
  readonly data_type: string;
  readonly is_nullable: string;
  readonly column_default: string | null;
}

interface SchemaValidationResult {
  readonly tableExists: boolean;
  readonly requiredColumns: readonly string[];
  readonly missingColumns: readonly string[];
  readonly extraColumns: readonly string[];
  readonly isValid: boolean;
  readonly message: string;
}

// ============================================================================
// DATABASE SCHEMA CHECKER
// ============================================================================

class DatabaseSchemaChecker {
  private readonly requiredPropertiesColumns = [
    'id',
    'title',
    'description', 
    'price',
    'address',
    'city',
    'state',
    'type',
    'property_category',
    'bedrooms',
    'bathrooms',
    'max_occupants',
    'images',
    'amenities',
    'verified',
    'is_available',
    'owner_id',
    'created_at',
    'updated_at'
  ] as const;

  /**
   * Check if properties table exists and has required columns
   */
  async validatePropertiesTable(): Promise<SchemaValidationResult> {
    try {
      enhancedLogger.info('Validating properties table schema');

      // Check if table exists and get column information
      const { data: columns, error } = await supabase
        .rpc('get_table_columns', { table_name: 'properties' });

      if (error) {
        // If RPC doesn't exist, try direct query
        const { data: directColumns, error: directError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_name', 'properties')
          .eq('table_schema', 'public');

        if (directError) {
          enhancedLogger.error('Failed to check properties table schema', { error: directError });
          return {
            tableExists: false,
            requiredColumns: this.requiredPropertiesColumns,
            missingColumns: this.requiredPropertiesColumns,
            extraColumns: [],
            isValid: false,
            message: `Failed to check schema: ${directError.message}`
          };
        }

        const existingColumns = (directColumns || []).map(col => col.column_name);
        const missingColumns = this.requiredPropertiesColumns.filter(
          col => !existingColumns.includes(col)
        );
        const extraColumns = existingColumns.filter(
          col => !this.requiredPropertiesColumns.includes(col as any)
        );

        return {
          tableExists: existingColumns.length > 0,
          requiredColumns: this.requiredPropertiesColumns,
          missingColumns,
          extraColumns,
          isValid: missingColumns.length === 0,
          message: missingColumns.length === 0 
            ? 'Properties table schema is valid'
            : `Missing columns: ${missingColumns.join(', ')}`
        };
      }

      const existingColumns = (columns || []).map((col: unknown) =>
        (col && typeof col === 'object' && 'column_name' in col)
          ? (col as { column_name: string }).column_name
          : ''
      ).filter(Boolean);
      const missingColumns = this.requiredPropertiesColumns.filter(
        col => !existingColumns.includes(col)
      );

      return {
        tableExists: true,
        requiredColumns: this.requiredPropertiesColumns,
        missingColumns,
        extraColumns: [],
        isValid: missingColumns.length === 0,
        message: missingColumns.length === 0 
          ? 'Properties table schema is valid'
          : `Missing columns: ${missingColumns.join(', ')}`
      };

    } catch (error) {
      enhancedLogger.error('Unexpected error validating properties table', { error });
      return {
        tableExists: false,
        requiredColumns: this.requiredPropertiesColumns,
        missingColumns: this.requiredPropertiesColumns,
        extraColumns: [],
        isValid: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check current property count in database
   */
  async getCurrentPropertyCount(): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> {
    try {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (error) {
        enhancedLogger.error('Failed to get property count', { error });
        return {
          success: false,
          count: 0,
          message: `Failed to get property count: ${error.message}`
        };
      }

      enhancedLogger.info('Current property count retrieved', { count });
      return {
        success: true,
        count: count || 0,
        message: `Current properties in database: ${count || 0}`
      };

    } catch (error) {
      enhancedLogger.error('Unexpected error getting property count', { error });
      return {
        success: false,
        count: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Test database connection
   */
  async testDatabaseConnection(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `Database connection failed: ${error.message}`
        };
      }

      return {
        success: true,
        message: 'Database connection successful'
      };

    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
  }

  /**
   * Comprehensive pre-migration validation
   */
  async validateForMigration(): Promise<{
    success: boolean;
    canProceed: boolean;
    issues: readonly string[];
    recommendations: readonly string[];
  }> {
    enhancedLogger.info('Starting comprehensive pre-migration validation');

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Test database connection
    const connectionTest = await this.testDatabaseConnection();
    if (!connectionTest.success) {
      issues.push(`Database connection failed: ${connectionTest.message}`);
      return {
        success: false,
        canProceed: false,
        issues,
        recommendations: ['Fix database connection before proceeding']
      };
    }

    // Validate properties table schema
    const schemaValidation = await this.validatePropertiesTable();
    if (!schemaValidation.isValid) {
      issues.push(`Properties table schema invalid: ${schemaValidation.message}`);
      if (schemaValidation.missingColumns.length > 0) {
        recommendations.push(`Add missing columns: ${schemaValidation.missingColumns.join(', ')}`);
      }
    }

    // Check current property count
    const countCheck = await this.getCurrentPropertyCount();
    if (countCheck.success && countCheck.count > 0) {
      recommendations.push(`Database already contains ${countCheck.count} properties. Migration will skip duplicates.`);
    }

    const canProceed = issues.length === 0;

    enhancedLogger.info('Pre-migration validation completed', {
      canProceed,
      issuesCount: issues.length,
      recommendationsCount: recommendations.length
    });

    return {
      success: true,
      canProceed,
      issues,
      recommendations
    };
  }
}

// ============================================================================
// EXPORT SCHEMA CHECKER
// ============================================================================

export const databaseSchemaChecker = new DatabaseSchemaChecker();

// Export for CLI usage
export const checkDatabaseSchema = async (): Promise<void> => {
  console.log('🔍 Checking database schema for migration...');
  
  const validation = await databaseSchemaChecker.validateForMigration();
  
  if (validation.success) {
    if (validation.canProceed) {
      console.log('✅ Database schema validation passed!');
      console.log('🚀 Ready to proceed with migration');
    } else {
      console.log('❌ Database schema validation failed!');
      console.log('🚨 Issues found:');
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
    if (validation.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      validation.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }
  } else {
    console.log('❌ Failed to validate database schema');
  }
};
