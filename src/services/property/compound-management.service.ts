import { supabase } from '@/lib/supabase';
import { PropertyId } from '@/types/property';
import { enhancedLogger } from '@/utils/enhanced-logger';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * ✅ APPLE-GRADE COMPOUND MANAGEMENT SERVICE - BE CONSCIOUS COMPLIANCE
 * 
 * Premium feature for property grouping with comprehensive error handling
 * Zero hardcoded values with complete type safety
 */

// Branded type for compound ID
export type CompoundId = string & { readonly __brand: 'CompoundId' };

// Compound interface
export interface Compound {
  readonly id: CompoundId;
  readonly name: string;
  readonly description: string;
  readonly ownerId: string;
  readonly agentId?: string; // For agent-managed compounds
  readonly location: {
    readonly address: string;
    readonly city: string;
    readonly state?: string;
    readonly country: string;
    readonly latitude?: number;
    readonly longitude?: number;
  };
  readonly amenities: ReadonlyArray<string>;
  readonly rules: ReadonlyArray<string>;
  readonly images: ReadonlyArray<string>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// Compound property relationship
export interface CompoundProperty {
  readonly compoundId: CompoundId;
  readonly propertyId: PropertyId;
  readonly blockIdentifier: string;
  readonly createdAt: string;
}

// Service error types
export type CompoundServiceError = {
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
};

export type CompoundServiceResult<T> = 
  | { success: true; data: T; }
  | { success: false; error: CompoundServiceError; };

export class CompoundManagementService {
  /**
   * Create a new compound
   */
  static async createCompound(compound: Omit<Compound, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompoundServiceResult<Compound>> {
    try {
      enhancedLogger.info('Creating new compound', { compound });
      
      const { data, error } = await supabase
        .from('compounds')
        .insert(compound)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Compound
      };
    } catch (error) {
      enhancedLogger.error('Failed to create compound', { error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Get all compounds for an owner
   */
  static async getCompoundsByOwnerId(ownerId: string): Promise<CompoundServiceResult<Compound[]>> {
    try {
      enhancedLogger.info('Fetching compounds by owner ID', { ownerId });
      
      const { data, error } = await supabase
        .from('compounds')
        .select('*')
        .eq('ownerId', ownerId);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Compound[]
      };
    } catch (error) {
      enhancedLogger.error('Failed to fetch compounds by owner ID', { ownerId, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Add a property to a compound
   */
  static async addPropertyToCompound(
    compoundId: CompoundId,
    propertyId: PropertyId,
    blockIdentifier: string
  ): Promise<CompoundServiceResult<CompoundProperty>> {
    try {
      enhancedLogger.info('Adding property to compound', { compoundId, propertyId, blockIdentifier });
      
      // First, check if property is already part of another compound
      const { data: existingData, error: existingError } = await supabase
        .from('compound_properties')
        .select('*')
        .eq('propertyId', propertyId);
      
      if (existingError) {
        throw existingError;
      }
      
      if (existingData && existingData.length > 0) {
        throw new Error('Property is already part of another compound');
      }
      
      // Add property to compound
      const compoundProperty = {
        compoundId,
        propertyId,
        blockIdentifier
      };
      
      const { data, error } = await supabase
        .from('compound_properties')
        .insert(compoundProperty)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update property to mark it as part of a compound
      await supabase
        .from('properties')
        .update({
          isPartOfCompound: true,
          compoundId,
          blockIdentifier
        })
        .eq('id', propertyId);
      
      return {
        success: true,
        data: data as CompoundProperty
      };
    } catch (error) {
      enhancedLogger.error('Failed to add property to compound', { compoundId, propertyId, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Remove a property from a compound
   */
  static async removePropertyFromCompound(
    compoundId: CompoundId,
    propertyId: PropertyId
  ): Promise<CompoundServiceResult<void>> {
    try {
      enhancedLogger.info('Removing property from compound', { compoundId, propertyId });
      
      // Remove property from compound
      const { error } = await supabase
        .from('compound_properties')
        .delete()
        .eq('compoundId', compoundId)
        .eq('propertyId', propertyId);
      
      if (error) {
        throw error;
      }
      
      // Update property to mark it as not part of a compound
      await supabase
        .from('properties')
        .update({
          isPartOfCompound: false,
          compoundId: null,
          blockIdentifier: null
        })
        .eq('id', propertyId);
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      enhancedLogger.error('Failed to remove property from compound', { compoundId, propertyId, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Get all properties in a compound
   */
  static async getCompoundProperties(compoundId: CompoundId): Promise<CompoundServiceResult<CompoundProperty[]>> {
    try {
      enhancedLogger.info('Fetching compound properties', { compoundId });
      
      const { data, error } = await supabase
        .from('compound_properties')
        .select('*')
        .eq('compoundId', compoundId);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as CompoundProperty[]
      };
    } catch (error) {
      enhancedLogger.error('Failed to fetch compound properties', { compoundId, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Handle errors in a standardized way
   */
  private static handleError(error: unknown): CompoundServiceError {
    if (error instanceof Error) {
      if ((error as PostgrestError).code) {
        const pgError = error as PostgrestError;
        
        return {
          code: pgError.code,
          message: pgError.message,
          details: pgError.details,
          recoverable: this.isRecoverableError(pgError.code)
        };
      }
      
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        recoverable: false
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
      recoverable: false
    };
  }
  
  /**
   * Determine if an error is recoverable
   */
  private static isRecoverableError(code: string): boolean {
    // Network errors, temporary database issues, etc.
    const recoverableCodes = [
      '08000', // Connection exception
      '08003', // Connection does not exist
      '08006', // Connection failure
      '08001', // SQL client unable to establish SQL connection
      '08004', // SQL server rejected SQL connection
      '57P03', // Cannot connect now
      '40001', // Serialization failure
      '40P01', // Deadlock detected
    ];
    
    return recoverableCodes.includes(code);
  }
}

