#!/usr/bin/env node

/**
 * Apple-Grade Hostel Database Seeding Script
 * Following BE CONSCIOUS guidelines with comprehensive error handling and monitoring
 * 
 * @fileoverview Enterprise-level database seeding for ROOMi platform hostel management
 * @author ROOMi Development Team - Apple Standards Implementation
 * @version 2.0.0
 * @since 2025-06-21
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { AppleGradeHostelTransformationService } from '../services/apple-grade-hostel-transformation.service';
import type { HostelOperationResult } from '../types/hostel-management';

// Load environment variables
config();

// ============================================================================
// APPLE-GRADE CONFIGURATION AND CONSTANTS
// ============================================================================

interface SeedingConfiguration {
  readonly supabaseUrl: string;
  readonly supabaseServiceKey: string;
  readonly defaultOwnerId: string;
  readonly dryRun: boolean;
  readonly batchSize: number;
  readonly maxRetries: number;
  readonly retryDelayMs: number;
  readonly enableMetrics: boolean;
  readonly enableLogging: boolean;
}

interface SeedingMetrics {
  readonly startTime: number;
  readonly endTime?: number;
  readonly totalProcessed: number;
  readonly successfullySeeded: number;
  readonly failed: number;
  readonly duplicatesSkipped: number;
  readonly averageProcessingTimeMs: number;
  readonly peakMemoryUsageMB: number;
  readonly errors: ReadonlyArray<SeedingError>;
}

interface SeedingError {
  readonly type: 'validation' | 'database' | 'network' | 'system';
  readonly message: string;
  readonly timestamp: string;
  readonly hostelTitle?: string;
  readonly retryCount: number;
  readonly fatal: boolean;
}

const SEEDING_CONFIG: SeedingConfiguration = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  defaultOwnerId: '8b6ccc62-7653-4729-ba13-b31e679bfa95', // Existing verified owner
  dryRun: process.argv.includes('--dry-run'),
  batchSize: 5,
  maxRetries: 3,
  retryDelayMs: 1000,
  enableMetrics: true,
  enableLogging: true
};

// ============================================================================
// APPLE-GRADE SEEDING ORCHESTRATOR
// ============================================================================

class AppleGradeHostelSeedingOrchestrator {
  private readonly config: SeedingConfiguration;
  private readonly transformationService: AppleGradeHostelTransformationService;
  private readonly metrics: SeedingMetrics;
  private readonly logger: SeedingLogger;

  constructor(config: SeedingConfiguration) {
    this.config = config;
    this.transformationService = new AppleGradeHostelTransformationService(
      config.supabaseUrl,
      config.supabaseServiceKey
    );
    this.metrics = {
      startTime: Date.now(),
      totalProcessed: 0,
      successfullySeeded: 0,
      failed: 0,
      duplicatesSkipped: 0,
      averageProcessingTimeMs: 0,
      peakMemoryUsageMB: 0,
      errors: []
    };
    this.logger = new SeedingLogger(config.enableLogging);
  }

  // ============================================================================
  // MAIN SEEDING ORCHESTRATION
  // ============================================================================

  async executeSeeding(): Promise<SeedingOperationResult> {
    this.logger.info('🍎 Apple-Grade Hostel Seeding Started', {
      config: this.config,
      timestamp: new Date().toISOString()
    });

    try {
      // Pre-flight validation
      const validationResult = await this.performPreflightValidation();
      if (!validationResult.success) {
        return validationResult;
      }

      // Execute seeding with comprehensive monitoring
      const seedingResult = await this.executeSeedingWithMonitoring();
      if (!seedingResult.success) {
        return seedingResult;
      }

      // Post-seeding validation and cleanup
      const postValidationResult = await this.performPostSeedingValidation();
      if (!postValidationResult.success) {
        return postValidationResult;
      }

      // Generate comprehensive report
      const finalMetrics = this.generateFinalMetrics();
      
      this.logger.success('🎯 Apple-Grade Hostel Seeding Completed Successfully', {
        metrics: finalMetrics,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: {
          metrics: finalMetrics,
          summary: this.generateSeedingSummary(finalMetrics),
          recommendations: this.generateRecommendations(finalMetrics)
        }
      };

    } catch (error) {
      const criticalError: SeedingError = {
        type: 'system',
        message: error instanceof Error ? error.message : 'Unknown critical error',
        timestamp: new Date().toISOString(),
        retryCount: 0,
        fatal: true
      };

      this.logger.error('❌ Critical Seeding Failure', {
        error: criticalError,
        stack: error instanceof Error ? error.stack : undefined
      });

      return {
        success: false,
        error: {
          type: 'critical_failure',
          message: 'Seeding process encountered a critical failure',
          details: criticalError
        }
      };
    }
  }

  // ============================================================================
  // PRE-FLIGHT VALIDATION
  // ============================================================================

  private async performPreflightValidation(): Promise<SeedingOperationResult> {
    this.logger.info('🔍 Performing Pre-flight Validation');

    try {
      // Validate environment configuration
      if (!this.config.supabaseUrl || !this.config.supabaseServiceKey) {
        return {
          success: false,
          error: {
            type: 'configuration_error',
            message: 'Missing required Supabase configuration',
            details: {
              hasUrl: !!this.config.supabaseUrl,
              hasServiceKey: !!this.config.supabaseServiceKey
            }
          }
        };
      }

      // Validate database connectivity
      const supabase = createClient(this.config.supabaseUrl, this.config.supabaseServiceKey);
      const { error: connectivityError } = await supabase
        .from('properties')
        .select('count')
        .limit(1);

      if (connectivityError) {
        return {
          success: false,
          error: {
            type: 'database_connectivity',
            message: 'Failed to connect to Supabase database',
            details: connectivityError
          }
        };
      }

      // Validate owner exists
      const { data: ownerData, error: ownerError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('id', this.config.defaultOwnerId)
        .single();

      if (ownerError || !ownerData) {
        return {
          success: false,
          error: {
            type: 'owner_validation',
            message: `Default owner ${this.config.defaultOwnerId} does not exist`,
            details: ownerError
          }
        };
      }

      // Check existing hostel count
      const { count: existingCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_type', 'hostel');

      this.logger.info('✅ Pre-flight Validation Passed', {
        existingHostelCount: existingCount,
        ownerName: ownerData.name,
        dryRun: this.config.dryRun
      });

      return { success: true, data: { existingCount, ownerData } };

    } catch (error) {
      return {
        success: false,
        error: {
          type: 'validation_error',
          message: 'Pre-flight validation failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // ============================================================================
  // SEEDING EXECUTION WITH MONITORING
  // ============================================================================

  private async executeSeedingWithMonitoring(): Promise<SeedingOperationResult> {
    this.logger.info('🚀 Executing Hostel Seeding with Apple-Grade Monitoring');

    try {
      if (this.config.dryRun) {
        this.logger.warn('🧪 DRY RUN MODE - No actual database changes will be made');
        
        // Simulate seeding for dry run
        const simulationResult = await this.simulateSeeding();
        return simulationResult;
      }

      // Execute actual seeding
      const seedingResult = await this.transformationService.seedAllHostelsWithAppleStandards(
        this.config.defaultOwnerId
      );

      if (!seedingResult.success) {
        return {
          success: false,
          error: {
            type: 'seeding_failed',
            message: 'Hostel seeding process failed',
            details: seedingResult.error
          }
        };
      }

      // Update metrics
      const { data: seedingData } = seedingResult;
      Object.assign(this.metrics, {
        totalProcessed: seedingData.totalProcessed,
        successfullySeeded: seedingData.successfullySeeded,
        failed: seedingData.failed,
        duplicatesSkipped: seedingData.duplicatesSkipped,
        errors: seedingData.errors
      });

      this.logger.info('✅ Seeding Execution Completed', {
        metrics: this.metrics,
        qualityReport: seedingData.dataQualityReport
      });

      return { success: true, data: seedingData };

    } catch (error) {
      return {
        success: false,
        error: {
          type: 'execution_error',
          message: 'Seeding execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // ============================================================================
  // POST-SEEDING VALIDATION
  // ============================================================================

  private async performPostSeedingValidation(): Promise<SeedingOperationResult> {
    this.logger.info('🔍 Performing Post-Seeding Validation');

    try {
      const supabase = createClient(this.config.supabaseUrl, this.config.supabaseServiceKey);

      // Verify hostel count
      const { count: finalCount, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_type', 'hostel')
        .eq('is_available', true);

      if (countError) {
        return {
          success: false,
          error: {
            type: 'validation_error',
            message: 'Failed to validate final hostel count',
            details: countError
          }
        };
      }

      // Verify data integrity
      const { data: sampleHostels, error: sampleError } = await supabase
        .from('properties')
        .select('id, title, base_price_per_semester, verification_status')
        .eq('property_type', 'hostel')
        .limit(5);

      if (sampleError) {
        return {
          success: false,
          error: {
            type: 'integrity_check',
            message: 'Data integrity validation failed',
            details: sampleError
          }
        };
      }

      // Validate required fields
      const integrityIssues = sampleHostels?.filter(hostel => 
        !hostel.title || 
        !hostel.base_price_per_semester || 
        !hostel.verification_status
      ) || [];

      if (integrityIssues.length > 0) {
        return {
          success: false,
          error: {
            type: 'data_integrity',
            message: 'Some hostels have missing required fields',
            details: integrityIssues
          }
        };
      }

      this.logger.info('✅ Post-Seeding Validation Passed', {
        finalHostelCount: finalCount,
        sampleValidated: sampleHostels?.length || 0
      });

      return { success: true, data: { finalCount, sampleHostels } };

    } catch (error) {
      return {
        success: false,
        error: {
          type: 'validation_error',
          message: 'Post-seeding validation failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  // ============================================================================
  // DRY RUN SIMULATION
  // ============================================================================

  private async simulateSeeding(): Promise<SeedingOperationResult> {
    this.logger.info('🧪 Simulating Seeding Process');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const simulatedMetrics = {
      totalProcessed: 12,
      successfullySeeded: 10,
      failed: 1,
      duplicatesSkipped: 1,
      processingTimeMs: 2000,
      dataQualityReport: {
        averageQualityScore: 85,
        highQualityCount: 7,
        mediumQualityCount: 3,
        lowQualityCount: 2,
        commonIssues: ['Missing detailed descriptions', 'Limited amenity information'],
        recommendations: ['Enhance property descriptions', 'Add comprehensive amenity lists']
      }
    };

    this.logger.info('✅ Dry Run Simulation Completed', { simulatedMetrics });

    return { success: true, data: simulatedMetrics };
  }

  // ============================================================================
  // METRICS AND REPORTING
  // ============================================================================

  private generateFinalMetrics(): SeedingMetrics {
    const endTime = Date.now();
    const totalTime = endTime - this.metrics.startTime;

    return {
      ...this.metrics,
      endTime,
      averageProcessingTimeMs: this.metrics.totalProcessed > 0 
        ? totalTime / this.metrics.totalProcessed 
        : 0,
      peakMemoryUsageMB: process.memoryUsage().heapUsed / 1024 / 1024
    };
  }

  private generateSeedingSummary(metrics: SeedingMetrics): string {
    const successRate = metrics.totalProcessed > 0 
      ? (metrics.successfullySeeded / metrics.totalProcessed * 100).toFixed(1)
      : '0';

    return `
🎯 Apple-Grade Hostel Seeding Summary
=====================================
✅ Successfully Seeded: ${metrics.successfullySeeded} hostels
❌ Failed: ${metrics.failed} hostels
⏭️  Duplicates Skipped: ${metrics.duplicatesSkipped} hostels
📊 Success Rate: ${successRate}%
⏱️  Total Processing Time: ${((metrics.endTime || Date.now()) - metrics.startTime) / 1000}s
💾 Peak Memory Usage: ${metrics.peakMemoryUsageMB.toFixed(2)} MB
    `.trim();
  }

  private generateRecommendations(metrics: SeedingMetrics): ReadonlyArray<string> {
    const recommendations: string[] = [];

    if (metrics.failed > 0) {
      recommendations.push('Review failed hostel entries and address validation issues');
    }

    if (metrics.peakMemoryUsageMB > 100) {
      recommendations.push('Consider implementing memory optimization for large datasets');
    }

    if (metrics.averageProcessingTimeMs > 1000) {
      recommendations.push('Optimize data transformation pipeline for better performance');
    }

    recommendations.push('Monitor hostel data quality and update descriptions regularly');
    recommendations.push('Implement automated data validation checks');

    return recommendations;
  }
}

// ============================================================================
// SUPPORTING TYPES AND CLASSES
// ============================================================================

type SeedingOperationResult = 
  | { readonly success: true; readonly data: any }
  | { readonly success: false; readonly error: SeedingOperationError };

interface SeedingOperationError {
  readonly type: string;
  readonly message: string;
  readonly details?: any;
}

class SeedingLogger {
  constructor(private readonly enabled: boolean) {}

  info(message: string, context?: any): void {
    if (this.enabled) {
      console.log(`ℹ️  ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }

  success(message: string, context?: any): void {
    if (this.enabled) {
      console.log(`✅ ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }

  warn(message: string, context?: any): void {
    if (this.enabled) {
      console.warn(`⚠️  ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }

  error(message: string, context?: any): void {
    if (this.enabled) {
      console.error(`❌ ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main(): Promise<void> {
  const orchestrator = new AppleGradeHostelSeedingOrchestrator(SEEDING_CONFIG);
  
  try {
    const result = await orchestrator.executeSeeding();
    
    if (result.success) {
      console.log('\n🎉 Seeding completed successfully!');
      console.log(result.data.summary);
      
      if (result.data.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        result.data.recommendations.forEach((rec: string, index: number) => {
          console.log(`${index + 1}. ${rec}`);
        });
      }
      
      process.exit(0);
    } else {
      console.error('\n💥 Seeding failed:', result.error.message);
      if (result.error.details) {
        console.error('Details:', result.error.details);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Critical error:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { AppleGradeHostelSeedingOrchestrator, SEEDING_CONFIG };
