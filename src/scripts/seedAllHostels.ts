/**
 * Comprehensive Hostel Database Seeding Script
 * Apple-Grade TypeScript script for populating Supabase with all Ghana hostels
 * Following BE CONSCIOUS architectural guidelines for full-stack development
 * 
 * @fileoverview Complete hostel database population script
 * @author ROOMi Development Team
 * @version 1.0.0
 * @since 2025-06-21
 */

import { supabase } from '@/integrations/supabase/client';
import { hostelDataTransformationService } from '@/services/hostelDataTransformationService';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';

/**
 * Default owner profile for hostels
 */
const DEFAULT_OWNER_PROFILE = {
  id: 'default-owner-id',
  email: 'hostel.owner@roomi.com',
  role: 'owner',
  first_name: 'ROOMi',
  last_name: 'Platform',
  phone: '+233 20 000 0000',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

/**
 * Hostel Database Seeding Service
 * Comprehensive service for populating database with all available hostels
 */
export class HostelSeedingService {
  private static instance: HostelSeedingService;

  private constructor() {}

  static getInstance(): HostelSeedingService {
    if (!HostelSeedingService.instance) {
      HostelSeedingService.instance = new HostelSeedingService();
    }
    return HostelSeedingService.instance;
  }

  /**
   * Ensure default owner profile exists
   */
  private async ensureDefaultOwnerExists(): Promise<boolean> {
    try {
      logger.info('Checking for default owner profile');

      // Check if default owner exists
      const { data: existingOwner, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', DEFAULT_OWNER_PROFILE.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingOwner) {
        logger.info('Default owner profile already exists');
        return true;
      }

      // Create default owner profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([DEFAULT_OWNER_PROFILE]);

      if (insertError) {
        throw insertError;
      }

      logger.info('Successfully created default owner profile');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to ensure default owner exists');
      return false;
    }
  }

  /**
   * Get current database statistics
   */
  private async getDatabaseStats(): Promise<{
    totalProperties: number;
    hostelProperties: number;
    availableProperties: number;
  }> {
    try {
      // Total properties
      const { count: totalCount, error: totalError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Hostel properties
      const { count: hostelCount, error: hostelError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('property_type', 'hostel');

      if (hostelError) throw hostelError;

      // Available properties
      const { count: availableCount, error: availableError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true);

      if (availableError) throw availableError;

      return {
        totalProperties: totalCount || 0,
        hostelProperties: hostelCount || 0,
        availableProperties: availableCount || 0
      };
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get database statistics');
      return {
        totalProperties: 0,
        hostelProperties: 0,
        availableProperties: 0
      };
    }
  }

  /**
   * Validate database connection and permissions
   */
  private async validateDatabaseConnection(): Promise<boolean> {
    try {
      logger.info('Validating database connection and permissions');

      // Test basic read access
      const { error: readError } = await supabase
        .from('properties')
        .select('id')
        .limit(1);

      if (readError) {
        throw new Error(`Database read access failed: ${readError.message}`);
      }

      // Test profiles table access
      const { error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (profileError) {
        throw new Error(`Profiles table access failed: ${profileError.message}`);
      }

      logger.info('Database connection and permissions validated successfully');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Database validation failed');
      return false;
    }
  }

  /**
   * Execute comprehensive hostel seeding
   */
  async seedAllHostels(): Promise<{
    success: boolean;
    beforeStats: any;
    afterStats: any;
    seedingResults: any;
    transformationStats: any;
  }> {
    try {
      logger.info('🚀 Starting comprehensive hostel database seeding');

      // Step 1: Validate database connection
      const connectionValid = await this.validateDatabaseConnection();
      if (!connectionValid) {
        throw new Error('Database connection validation failed');
      }

      // Step 2: Get initial statistics
      const beforeStats = await this.getDatabaseStats();
      logger.info('Database statistics before seeding:', beforeStats);

      // Step 3: Ensure default owner exists
      const ownerCreated = await this.ensureDefaultOwnerExists();
      if (!ownerCreated) {
        throw new Error('Failed to create default owner profile');
      }

      // Step 4: Get transformation statistics
      const transformationStats = hostelDataTransformationService.getTransformationStats();
      logger.info('Transformation statistics:', transformationStats);

      // Step 5: Execute database population
      logger.info('🏠 Starting hostel data transformation and insertion');
      const seedingResults = await hostelDataTransformationService.populateDatabase();
      
      // Step 6: Get final statistics
      const afterStats = await this.getDatabaseStats();
      logger.info('Database statistics after seeding:', afterStats);

      // Step 7: Validate results
      const expectedIncrease = seedingResults.success;
      const actualIncrease = afterStats.hostelProperties - beforeStats.hostelProperties;
      
      if (actualIncrease !== expectedIncrease) {
        logger.warn(`Expected ${expectedIncrease} new hostels, but database shows ${actualIncrease} increase`);
      }

      const result = {
        success: true,
        beforeStats,
        afterStats,
        seedingResults,
        transformationStats
      };

      logger.info('✅ Comprehensive hostel seeding completed successfully', result);
      return result;

    } catch (error) {
      ErrorHandler.handle(error, 'Comprehensive hostel seeding failed');
      
      return {
        success: false,
        beforeStats: await this.getDatabaseStats(),
        afterStats: await this.getDatabaseStats(),
        seedingResults: { success: 0, failed: 0, total: 0 },
        transformationStats: hostelDataTransformationService.getTransformationStats()
      };
    }
  }

  /**
   * Quick validation of seeded data
   */
  async validateSeededData(): Promise<{
    isValid: boolean;
    issues: string[];
    sampleHostels: Record<string, unknown>[];
  }> {
    try {
      const issues: string[] = [];
      
      // Check for hostels with missing required fields
      const { data: invalidHostels, error } = await supabase
        .from('properties')
        .select('id, title, description, address, rent')
        .or('title.is.null,description.is.null,address.is.null,rent.is.null');

      if (error) throw error;

      if (invalidHostels && invalidHostels.length > 0) {
        issues.push(`Found ${invalidHostels.length} hostels with missing required fields`);
      }

      // Get sample of seeded hostels
      const { data: sampleHostels, error: sampleError } = await supabase
        .from('properties')
        .select('id, title, rent, city, property_type, amenities')
        .eq('property_type', 'hostel')
        .limit(5);

      if (sampleError) throw sampleError;

      return {
        isValid: issues.length === 0,
        issues,
        sampleHostels: sampleHostels || []
      };
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to validate seeded data');
      return {
        isValid: false,
        issues: ['Validation failed due to database error'],
        sampleHostels: []
      };
    }
  }
}

/**
 * Main seeding execution function
 */
export async function executeHostelSeeding(): Promise<void> {
  try {
    const seedingService = HostelSeedingService.getInstance();
    
    console.log('🏠 ROOMi Platform - Comprehensive Hostel Database Seeding');
    console.log('=' .repeat(60));
    
    const results = await seedingService.seedAllHostels();
    
    if (results.success) {
      console.log('✅ Seeding completed successfully!');
      console.log(`📊 Results:`);
      console.log(`   • Before: ${results.beforeStats.hostelProperties} hostels`);
      console.log(`   • After: ${results.afterStats.hostelProperties} hostels`);
      console.log(`   • Added: ${results.seedingResults.success} hostels`);
      console.log(`   • Failed: ${results.seedingResults.failed} hostels`);
      console.log(`   • Total processed: ${results.seedingResults.total} hostels`);
      
      // Validate seeded data
      const validation = await seedingService.validateSeededData();
      if (validation.isValid) {
        console.log('✅ Data validation passed');
      } else {
        console.log('⚠️  Data validation issues:', validation.issues);
      }
    } else {
      console.log('❌ Seeding failed');
      console.log('Check logs for detailed error information');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during hostel seeding:', error);
    process.exit(1);
  }
}

// Export singleton instance
export const hostelSeedingService = HostelSeedingService.getInstance();
export default hostelSeedingService;

// Execute if run directly
if (require.main === module) {
  executeHostelSeeding();
}
