import { supabase } from '@/lib/supabase';
import { Property, PropertyId, PropertyStatus } from '@/types/property';
import { enhancedLogger } from '@/utils/enhanced-logger';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * ✅ APPLE-GRADE PROPERTY SERVICE - BE CONSCIOUS COMPLIANCE
 * 
 * Dynamic property data service with comprehensive error handling
 * Zero hardcoded values with complete type safety
 */

// Branded error types for better error handling
export type PropertyServiceError = {
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
};

export type PropertyServiceResult<T> = 
  | { success: true; data: T; }
  | { success: false; error: PropertyServiceError; };

export class PropertyService {
  /**
   * Get all properties with filtering options
   */
  static async getProperties(options?: {
    status?: PropertyStatus;
    ownerId?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PropertyServiceResult<Property[]>> {
    try {
      enhancedLogger.info('Fetching properties', { options });
      
      let query = supabase
        .from('properties')
        .select('*');
      
      // Apply filters
      if (options?.status) {
        query = query.eq('status', options.status);
      }
      
      if (options?.ownerId) {
        query = query.eq('owner_id', options.ownerId);
      }
      
      // Apply sorting
      if (options?.sortBy) {
        query = query.order(options.sortBy, { 
          ascending: options.sortOrder !== 'desc' 
        });
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Property[]
      };
    } catch (error) {
      enhancedLogger.error('Failed to fetch properties', { error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Get a single property by ID
   */
  static async getPropertyById(id: PropertyId): Promise<PropertyServiceResult<Property>> {
    try {
      enhancedLogger.info('Fetching property by ID', { id });
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error(`Property with ID ${id} not found`);
      }
      
      return {
        success: true,
        data: data as Property
      };
    } catch (error) {
      enhancedLogger.error('Failed to fetch property by ID', { id, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Create a new property
   */
  static async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<PropertyServiceResult<Property>> {
    try {
      enhancedLogger.info('Creating new property', { property });
      
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Property
      };
    } catch (error) {
      enhancedLogger.error('Failed to create property', { error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Update an existing property
   */
  static async updateProperty(
    id: PropertyId, 
    updates: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<PropertyServiceResult<Property>> {
    try {
      enhancedLogger.info('Updating property', { id, updates });
      
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Property
      };
    } catch (error) {
      enhancedLogger.error('Failed to update property', { id, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Delete a property
   */
  static async deleteProperty(id: PropertyId): Promise<PropertyServiceResult<void>> {
    try {
      enhancedLogger.info('Deleting property', { id });
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      enhancedLogger.error('Failed to delete property', { id, error });
      
      return {
        success: false,
        error: this.handleError(error)
      };
    }
  }
  
  /**
   * Handle errors in a standardized way
   */
  private static handleError(error: unknown): PropertyServiceError {
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