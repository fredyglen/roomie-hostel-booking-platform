/**
 * Admin User Management Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive admin user management operations
 * including creation, editing, role assignment, and jurisdiction management
 * for the ROOMi platform admin portal
 * 
 * Technical Implementation: Integrates with Supabase for secure database
 * operations, implements comprehensive error handling, and maintains audit trails
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { 
  CreateAdminUserFormValues, 
  EditAdminUserFormValues,
  AdminUserFilterValues,
  GhanaUniversityCode,
  GHANA_UNIVERSITIES
} from '@/schemas/admin-user-schemas';
import { 
  AuthUser, 
  AdminRoleType, 
  AuthResult,
  AuthError
} from '@/types/auth';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface AdminUserProfile {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly role: AdminRoleType;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastSignInAt?: Date;
  readonly jurisdictions: readonly AdminJurisdiction[];
  readonly metadata?: Record<string, any>;
}

export interface AdminJurisdiction {
  readonly id: string;
  readonly type: 'campus' | 'country';
  readonly code: string;
  readonly name: string;
  readonly metadata?: Record<string, any>;
  readonly assignedAt: Date;
  readonly assignedBy: string;
  readonly isActive: boolean;
}

export interface AdminUserListResponse {
  readonly users: readonly AdminUserProfile[];
  readonly totalCount: number;
  readonly page: number;
  readonly limit: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface CreateAdminUserRequest {
  readonly userData: CreateAdminUserFormValues;
  readonly createdBy: string;
}

export interface UpdateAdminUserRequest {
  readonly userId: string;
  readonly userData: EditAdminUserFormValues;
  readonly updatedBy: string;
}

// ============================================================================
// ADMIN USER SERVICE CLASS
// ============================================================================

/**
 * Admin User Service - Apple-Grade Implementation
 * 
 * Provides comprehensive admin user management with:
 * - Secure user creation and editing
 * - Role-based permission management
 * - Jurisdiction assignment and validation
 * - Comprehensive audit logging
 */
class AdminUserService {
  
  /**
   * Create new admin user with role and jurisdiction assignment
   */
  public async createAdminUser(
    request: CreateAdminUserRequest
  ): Promise<AuthResult<AdminUserProfile>> {
    try {
      const { userData, createdBy } = request;
      
      logger.info('Creating admin user', { 
        email: userData.email, 
        role: userData.role,
        createdBy 
      });

      // Step 1: Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          admin_type: userData.role
        }
      });

      if (authError || !authData.user) {
        logger.error('Failed to create auth user', { error: authError });
        return {
          success: false,
          error: {
            type: 'authentication',
            message: 'Failed to create admin user account',
            details: authError,
            timestamp: new Date()
          }
        };
      }

      // Step 2: Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          role: userData.role,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone
        });

      if (profileError) {
        logger.error('Failed to create admin profile', { error: profileError });
        // Cleanup: Delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        return {
          success: false,
          error: {
            type: 'database',
            message: 'Failed to create admin profile',
            details: profileError,
            timestamp: new Date()
          }
        };
      }

      // Step 3: Create jurisdiction assignments for campus admins
      if (userData.role === 'campus_admin' && userData.campusJurisdictions) {
        const jurisdictionInserts = userData.campusJurisdictions.map(campusCode => ({
          admin_user_id: authData.user.id,
          jurisdiction_type: 'campus' as const,
          jurisdiction_code: campusCode,
          jurisdiction_name: GHANA_UNIVERSITIES[campusCode].name,
          assigned_by: createdBy,
          metadata: {
            university_code: GHANA_UNIVERSITIES[campusCode].code,
            campus_location: GHANA_UNIVERSITIES[campusCode].location,
            access_level: 'campus',
            setup_type: 'production',
            ...userData.metadata
          }
        }));

        const { error: jurisdictionError } = await supabase
          .from('admin_jurisdictions')
          .insert(jurisdictionInserts);

        if (jurisdictionError) {
          logger.error('Failed to create admin jurisdictions', { error: jurisdictionError });
          // Cleanup: Delete auth user and profile
          await supabase.auth.admin.deleteUser(authData.user.id);
          
          return {
            success: false,
            error: {
              type: 'database',
              message: 'Failed to assign admin jurisdictions',
              details: jurisdictionError,
              timestamp: new Date()
            }
          };
        }
      }

      // Step 4: Log admin creation
      await this.logAdminAction(
        createdBy,
        'create',
        'admin_user',
        authData.user.id,
        'Admin user created',
        {
          email: userData.email,
          role: userData.role,
          jurisdictions: userData.campusJurisdictions || []
        }
      );

      // Step 5: Fetch and return created admin user
      const adminUserResult = await this.getAdminUserById(authData.user.id);
      
      if (!adminUserResult.success) {
        return adminUserResult;
      }

      logger.info('Admin user created successfully', {
        userId: authData.user.id,
        email: userData.email,
        role: userData.role
      });

      return {
        success: true,
        data: adminUserResult.data
      };

    } catch (error) {
      logger.error('Error creating admin user', { error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'System error creating admin user',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Get admin user by ID with jurisdictions
   */
  public async getAdminUserById(userId: string): Promise<AuthResult<AdminUserProfile>> {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .in('role', ['supreme_admin', 'campus_admin'])
        .single();

      if (profileError || !profile) {
        return {
          success: false,
          error: {
            type: 'not_found',
            message: 'Admin user not found',
            details: profileError,
            timestamp: new Date()
          }
        };
      }

      // Fetch jurisdictions
      const { data: jurisdictions, error: jurisdictionError } = await supabase
        .from('admin_jurisdictions')
        .select('*')
        .eq('admin_user_id', userId)
        .eq('is_active', true);

      if (jurisdictionError) {
        logger.warn('Failed to fetch admin jurisdictions', { 
          userId, 
          error: jurisdictionError 
        });
      }

      // Transform to AdminUserProfile
      const adminUser: AdminUserProfile = {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        role: profile.role as AdminRoleType,
        isActive: true, // Assuming active if in database
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        jurisdictions: (jurisdictions || []).map(j => ({
          id: j.id,
          type: j.jurisdiction_type,
          code: j.jurisdiction_code,
          name: j.jurisdiction_name,
          metadata: j.metadata,
          assignedAt: new Date(j.assigned_at),
          assignedBy: j.assigned_by,
          isActive: j.is_active
        }))
      };

      return {
        success: true,
        data: adminUser
      };

    } catch (error) {
      logger.error('Error fetching admin user', { userId, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'System error fetching admin user',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Get admin users with filtering and pagination
   */
  public async getAdminUsers(
    filters: AdminUserFilterValues
  ): Promise<AuthResult<AdminUserListResponse>> {
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .in('role', ['supreme_admin', 'campus_admin']);

      // Apply filters
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`);
      }

      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      // Apply sorting
      const sortColumn = filters.sortBy === 'name' ? 'first_name' : filters.sortBy;
      query = query.order(sortColumn, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      const offset = (filters.page - 1) * filters.limit;
      query = query.range(offset, offset + filters.limit - 1);

      const { data: profiles, error, count } = await query;

      if (error) {
        logger.error('Failed to fetch admin users', { error });
        return {
          success: false,
          error: {
            type: 'database',
            message: 'Failed to fetch admin users',
            details: error,
            timestamp: new Date()
          }
        };
      }

      // Fetch jurisdictions for all users
      const userIds = profiles?.map(p => p.id) || [];
      const { data: jurisdictions } = await supabase
        .from('admin_jurisdictions')
        .select('*')
        .in('admin_user_id', userIds)
        .eq('is_active', true);

      // Transform to AdminUserProfile
      const users: AdminUserProfile[] = (profiles || []).map(profile => {
        const userJurisdictions = (jurisdictions || [])
          .filter(j => j.admin_user_id === profile.id)
          .map(j => ({
            id: j.id,
            type: j.jurisdiction_type,
            code: j.jurisdiction_code,
            name: j.jurisdiction_name,
            metadata: j.metadata,
            assignedAt: new Date(j.assigned_at),
            assignedBy: j.assigned_by,
            isActive: j.is_active
          }));

        return {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
          role: profile.role as AdminRoleType,
          isActive: true,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
          jurisdictions: userJurisdictions
        };
      });

      const totalCount = count || 0;
      const hasNextPage = (filters.page * filters.limit) < totalCount;
      const hasPreviousPage = filters.page > 1;

      return {
        success: true,
        data: {
          users,
          totalCount,
          page: filters.page,
          limit: filters.limit,
          hasNextPage,
          hasPreviousPage
        }
      };

    } catch (error) {
      logger.error('Error fetching admin users', { error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'System error fetching admin users',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Update admin user
   */
  public async updateAdminUser(
    request: UpdateAdminUserRequest
  ): Promise<AuthResult<AdminUserProfile>> {
    try {
      const { userId, userData, updatedBy } = request;

      logger.info('Updating admin user', { userId, updatedBy });

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        logger.error('Failed to update admin profile', { error: profileError });
        return {
          success: false,
          error: {
            type: 'database',
            message: 'Failed to update admin profile',
            details: profileError,
            timestamp: new Date()
          }
        };
      }

      // Update jurisdictions for campus admins
      if (userData.role === 'campus_admin' && userData.campusJurisdictions) {
        // Deactivate existing jurisdictions
        await supabase
          .from('admin_jurisdictions')
          .update({ is_active: false })
          .eq('admin_user_id', userId);

        // Insert new jurisdictions
        const jurisdictionInserts = userData.campusJurisdictions.map(campusCode => ({
          admin_user_id: userId,
          jurisdiction_type: 'campus' as const,
          jurisdiction_code: campusCode,
          jurisdiction_name: GHANA_UNIVERSITIES[campusCode].name,
          assigned_by: updatedBy,
          metadata: {
            university_code: GHANA_UNIVERSITIES[campusCode].code,
            campus_location: GHANA_UNIVERSITIES[campusCode].location,
            access_level: 'campus',
            setup_type: 'production',
            ...userData.metadata
          }
        }));

        const { error: jurisdictionError } = await supabase
          .from('admin_jurisdictions')
          .insert(jurisdictionInserts);

        if (jurisdictionError) {
          logger.error('Failed to update admin jurisdictions', { error: jurisdictionError });
          return {
            success: false,
            error: {
              type: 'database',
              message: 'Failed to update admin jurisdictions',
              details: jurisdictionError,
              timestamp: new Date()
            }
          };
        }
      }

      // Log admin update
      await this.logAdminAction(
        updatedBy,
        'update',
        'admin_user',
        userId,
        'Admin user updated',
        {
          email: userData.email,
          role: userData.role,
          jurisdictions: userData.campusJurisdictions || []
        }
      );

      // Fetch and return updated admin user
      const adminUserResult = await this.getAdminUserById(userId);

      if (!adminUserResult.success) {
        return adminUserResult;
      }

      logger.info('Admin user updated successfully', { userId });

      return {
        success: true,
        data: adminUserResult.data
      };

    } catch (error) {
      logger.error('Error updating admin user', { error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'System error updating admin user',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Log admin action for audit trail
   */
  private async logAdminAction(
    adminUserId: string,
    actionType: string,
    resourceType: string,
    resourceId: string,
    description: string,
    actionData: Record<string, any> = {}
  ): Promise<void> {
    try {
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: adminUserId,
          admin_role: 'supreme_admin', // Will be determined from context
          action_type: actionType,
          resource_type: resourceType,
          resource_id: resourceId,
          action_description: description,
          action_data: actionData,
          success: true
        });
    } catch (error) {
      logger.error('Failed to log admin action', { error });
      // Don't throw - audit logging failure shouldn't break main operation
    }
  }
}

// ============================================================================
// SERVICE INSTANCE
// ============================================================================

export const adminUserService = new AdminUserService();
export default adminUserService;
