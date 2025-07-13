/**
 * Maintenance Request Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Handles all maintenance request operations with proper
 * validation, RLS enforcement, and cross-portal synchronization
 * 
 * Technical Implementation: Type-safe CRUD operations, comprehensive error
 * handling, and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';
import {
  MaintenanceRequest,
  MaintenanceRequestInsert,
  MaintenanceRequestUpdate,
  MaintenanceRequestResponse,
  MaintenanceRequestListResponse,
  MaintenanceAnalytics,
  createMaintenanceRequestId,
  MaintenanceRequestWithProperty,
  MaintenanceRequestWithStudent
} from '@/types/maintenance';

// ============================================================================
// MAINTENANCE REQUEST SERVICE CLASS
// ============================================================================

export class MaintenanceRequestService {
  
  // --------------------------------------------------------------------------
  // CREATE MAINTENANCE REQUEST
  // --------------------------------------------------------------------------
  
  static async createMaintenanceRequest(
    requestData: MaintenanceRequestInsert
  ): Promise<MaintenanceRequestResponse> {
    try {
      logger.info('Creating maintenance request', { 
        studentId: requestData.student_id,
        propertyId: requestData.property_id,
        category: requestData.category
      });

      // Validate student has active booking for property
      const bookingValidation = await this.validateStudentBooking(
        requestData.student_id, 
        requestData.property_id
      );

      if (!bookingValidation.isValid) {
        return {
          success: false,
          error: bookingValidation.reason || 'You can only request maintenance for properties you currently have bookings for'
        };
      }

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create maintenance request', { error, requestData });
        return {
          success: false,
          error: 'Failed to create maintenance request. Please try again.'
        };
      }

      const maintenanceRequest: MaintenanceRequest = {
        ...data,
        id: createMaintenanceRequestId(data.id)
      };

      logger.info('Maintenance request created successfully', { 
        requestId: maintenanceRequest.id 
      });

      return {
        success: true,
        data: maintenanceRequest
      };

    } catch (error: unknown) {
      logger.error('Error creating maintenance request', { error });
      return {
        success: false,
        error: ErrorHandler.getErrorMessage(error)
      };
    }
  }

  // --------------------------------------------------------------------------
  // GET STUDENT MAINTENANCE REQUESTS
  // --------------------------------------------------------------------------
  
  static async getStudentMaintenanceRequests(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<MaintenanceRequestListResponse> {
    try {
      logger.info('Fetching student maintenance requests', { studentId, page, limit });

      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          property:properties(
            id,
            title,
            address,
            owner_id
          )
        `, { count: 'exact' })
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Failed to fetch student maintenance requests', { error, studentId });
        return {
          success: false,
          error: 'Failed to fetch maintenance requests'
        };
      }

      const maintenanceRequests: readonly MaintenanceRequestWithProperty[] = (data || []).map(item => ({
        ...item,
        id: createMaintenanceRequestId(item.id),
        property: item.property
      }));

      return {
        success: true,
        data: maintenanceRequests,
        pagination: {
          total: count || 0,
          page,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      };

    } catch (error: unknown) {
      logger.error('Error fetching student maintenance requests', { error, studentId });
      return {
        success: false,
        error: ErrorHandler.getErrorMessage(error)
      };
    }
  }

  // --------------------------------------------------------------------------
  // GET OWNER MAINTENANCE REQUESTS
  // --------------------------------------------------------------------------
  
  static async getOwnerMaintenanceRequests(
    ownerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<MaintenanceRequestListResponse> {
    try {
      logger.info('Fetching owner maintenance requests', { ownerId, page, limit });

      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          property:properties!inner(
            id,
            title,
            address,
            owner_id
          ),
          student:profiles(
            id,
            first_name,
            last_name,
            email
          )
        `, { count: 'exact' })
        .eq('property.owner_id', ownerId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('Failed to fetch owner maintenance requests', { error, ownerId });
        return {
          success: false,
          error: 'Failed to fetch maintenance requests'
        };
      }

      const maintenanceRequests: readonly MaintenanceRequestWithStudent[] = (data || []).map(item => ({
        ...item,
        id: createMaintenanceRequestId(item.id),
        student: item.student
      }));

      return {
        success: true,
        data: maintenanceRequests,
        pagination: {
          total: count || 0,
          page,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      };

    } catch (error: unknown) {
      logger.error('Error fetching owner maintenance requests', { error, ownerId });
      return {
        success: false,
        error: ErrorHandler.getErrorMessage(error)
      };
    }
  }

  // --------------------------------------------------------------------------
  // UPDATE MAINTENANCE REQUEST
  // --------------------------------------------------------------------------
  
  static async updateMaintenanceRequest(
    requestId: string,
    updateData: MaintenanceRequestUpdate
  ): Promise<MaintenanceRequestResponse> {
    try {
      logger.info('Updating maintenance request', { requestId, updateData });

      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update maintenance request', { error, requestId });
        return {
          success: false,
          error: 'Failed to update maintenance request'
        };
      }

      const maintenanceRequest: MaintenanceRequest = {
        ...data,
        id: createMaintenanceRequestId(data.id)
      };

      return {
        success: true,
        data: maintenanceRequest
      };

    } catch (error: unknown) {
      logger.error('Error updating maintenance request', { error, requestId });
      return {
        success: false,
        error: ErrorHandler.getErrorMessage(error)
      };
    }
  }

  // --------------------------------------------------------------------------
  // GET MAINTENANCE ANALYTICS
  // --------------------------------------------------------------------------
  
  static async getMaintenanceAnalytics(ownerId: string): Promise<MaintenanceAnalytics | null> {
    try {
      logger.info('Fetching maintenance analytics', { ownerId });

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          status,
          category,
          priority,
          actual_cost,
          created_at,
          completed_date,
          property:properties!inner(owner_id)
        `)
        .eq('property.owner_id', ownerId);

      if (error) {
        logger.error('Failed to fetch maintenance analytics', { error, ownerId });
        return null;
      }

      // Calculate analytics
      const requests = data || [];
      const total_requests = requests.length;
      const pending_requests = requests.filter(r => r.status === 'pending').length;
      const in_progress_requests = requests.filter(r => r.status === 'in_progress').length;
      const completed_requests = requests.filter(r => r.status === 'completed').length;
      const cancelled_requests = requests.filter(r => r.status === 'cancelled').length;

      // Calculate average completion time
      const completedWithDates = requests.filter(r => 
        r.status === 'completed' && r.created_at && r.completed_date
      );
      
      const average_completion_time = completedWithDates.length > 0
        ? completedWithDates.reduce((sum, r) => {
            const created = new Date(r.created_at);
            const completed = new Date(r.completed_date!);
            const days = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / completedWithDates.length
        : 0;

      // Calculate total cost
      const total_cost = requests.reduce((sum, r) => sum + (r.actual_cost || 0), 0);

      // Group by category and priority
      const requests_by_category = requests.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const requests_by_priority = requests.reduce((acc, r) => {
        acc[r.priority] = (acc[r.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total_requests,
        pending_requests,
        in_progress_requests,
        completed_requests,
        cancelled_requests,
        average_completion_time,
        total_cost,
        requests_by_category,
        requests_by_priority
      };

    } catch (error: unknown) {
      logger.error('Error fetching maintenance analytics', { error, ownerId });
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // VALIDATION HELPERS
  // --------------------------------------------------------------------------
  
  private static async validateStudentBooking(
    studentId: string, 
    propertyId: string
  ): Promise<{ isValid: boolean; reason?: string }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, status, start_date, end_date')
        .eq('student_id', studentId)
        .eq('property_id', propertyId)
        .eq('status', 'confirmed')
        .gte('end_date', new Date().toISOString().split('T')[0])
        .single();

      if (error || !data) {
        return {
          isValid: false,
          reason: 'You can only request maintenance for properties you currently have active bookings for'
        };
      }

      return { isValid: true };

    } catch (error: unknown) {
      logger.error('Error validating student booking', { error, studentId, propertyId });
      return {
        isValid: false,
        reason: 'Unable to verify booking status'
      };
    }
  }
}

export default MaintenanceRequestService;
