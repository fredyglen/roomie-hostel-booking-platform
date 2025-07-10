/**
 * Admin Authentication Service
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Handles secure authentication for Supreme and Campus admin roles
 * with comprehensive JWT management, role-based access control, and audit logging
 * 
 * Technical Implementation: Integrates with Supabase authentication, admin role service,
 * and unified configuration for secure admin portal access with proper session management
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  AuthUser, 
  AuthError, 
  AuthResult, 
  AdminRoleType, 
  AdminJWTPayload,
  SignInCredentials,
  AdminPermission,
  CampusJurisdiction,
  CountryJurisdiction,
  isAdminRole
} from '@/types/auth';
import { adminRoleService } from './adminRoleService';
// Import with fallback for testing environment
let logger: any;
try {
  logger = require('@/utils/enhanced-logger').logger;
} catch (error) {
  // Fallback for testing environment
  logger = {
    info: () => {},
    warn: () => {},
    error: () => {}
  };
}
import { Session, User } from '@supabase/supabase-js';

// ============================================================================
// ADMIN AUTHENTICATION TYPES
// ============================================================================

interface AdminAuthSession {
  readonly user: AuthUser;
  readonly session: Session;
  readonly permissions: readonly AdminPermission[];
  readonly jurisdiction: {
    readonly campuses?: readonly CampusJurisdiction[];
    readonly countries?: readonly CountryJurisdiction[];
  };
  readonly expiresAt: Date;
}

interface AdminSignInResult {
  readonly user: AuthUser;
  readonly session: Session;
  readonly adminRole: AdminRoleType;
  readonly permissions: readonly AdminPermission[];
}

// ============================================================================
// ADMIN AUTHENTICATION SERVICE
// ============================================================================

/**
 * Admin Authentication Service - Apple-Grade Implementation
 * 
 * Provides secure authentication for admin users with:
 * - Role-based authentication
 * - JWT token management
 * - Permission validation
 * - Session monitoring
 * - Audit logging
 */
class AdminAuthService {
  private currentAdminSession: AdminAuthSession | null = null;
  private sessionRefreshTimer: NodeJS.Timeout | null = null;

  /**
   * Authenticate admin user with enhanced security
   */
  public async signInAdmin(credentials: SignInCredentials): Promise<AuthResult<AdminSignInResult>> {
    try {
      logger.info('Admin authentication attempt', { 
        email: credentials.email,
        timestamp: new Date().toISOString()
      });

      // Validate credentials format
      const credentialsValidation = this.validateCredentials(credentials);
      if (!credentialsValidation.success) {
        return credentialsValidation;
      }

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError || !authData.user || !authData.session) {
        logger.warn('Admin authentication failed', { 
          email: credentials.email,
          error: authError?.message 
        });

        return {
          success: false,
          error: {
            type: 'authentication',
            message: 'Invalid admin credentials',
            code: authError?.message || 'AUTH_FAILED',
            timestamp: new Date()
          }
        };
      }

      // Get user profile with admin role information
      const profileResult = await this.getAdminProfile(authData.user.id);
      if (!profileResult.success) {
        return profileResult;
      }

      const userProfile = profileResult.data;

      // Validate admin role
      if (!isAdminRole(userProfile.role)) {
        logger.warn('Non-admin user attempted admin login', {
          userId: authData.user.id,
          email: credentials.email,
          role: userProfile.role
        });

        // Sign out the user immediately
        await supabase.auth.signOut();

        return {
          success: false,
          error: {
            type: 'authorization',
            message: 'Access denied: Admin privileges required',
            code: 'INSUFFICIENT_PRIVILEGES',
            timestamp: new Date()
          }
        };
      }

      // Get role configuration and permissions
      const roleResult = adminRoleService.getRoleConfiguration(userProfile.role as AdminRoleType);
      if (!roleResult.success) {
        return roleResult;
      }

      const adminRole = roleResult.data;

      // Create enhanced auth user
      const authUser: AuthUser = {
        ...authData.user,
        role: userProfile.role,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        avatarUrl: userProfile.avatarUrl,
        adminRole,
        permissions: adminRole.permissions,
        jurisdiction: userProfile.jurisdiction
      };

      // Create admin session
      const adminSession: AdminAuthSession = {
        user: authUser,
        session: authData.session,
        permissions: adminRole.permissions,
        jurisdiction: userProfile.jurisdiction || {},
        expiresAt: new Date(authData.session.expires_at! * 1000)
      };

      this.currentAdminSession = adminSession;
      this.setupSessionRefresh(authData.session);

      // Log successful admin authentication
      logger.info('Admin authentication successful', {
        userId: authData.user.id,
        email: credentials.email,
        adminRole: userProfile.role,
        permissions: adminRole.permissions.length,
        jurisdiction: userProfile.jurisdiction
      });

      return {
        success: true,
        data: {
          user: authUser,
          session: authData.session,
          adminRole: userProfile.role as AdminRoleType,
          permissions: adminRole.permissions
        }
      };

    } catch (error) {
      logger.error('Admin authentication system error', { 
        email: credentials.email,
        error 
      });

      return {
        success: false,
        error: {
          type: 'system',
          message: 'Authentication system error',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Sign out admin user with session cleanup
   */
  public async signOutAdmin(): Promise<AuthResult<void>> {
    try {
      const currentUser = this.currentAdminSession?.user;

      // Clear session refresh timer
      if (this.sessionRefreshTimer) {
        clearTimeout(this.sessionRefreshTimer);
        this.sessionRefreshTimer = null;
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error('Admin sign out error', { error });
        return {
          success: false,
          error: {
            type: 'system',
            message: 'Failed to sign out',
            details: error,
            timestamp: new Date()
          }
        };
      }

      // Clear admin session
      this.currentAdminSession = null;

      // Log admin sign out
      if (currentUser) {
        logger.info('Admin signed out successfully', {
          userId: currentUser.id,
          email: currentUser.email,
          adminRole: currentUser.role
        });
      }

      return {
        success: true,
        data: undefined
      };

    } catch (error) {
      logger.error('Admin sign out system error', { error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Sign out system error',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Get current admin session
   */
  public getCurrentAdminSession(): AdminAuthSession | null {
    return this.currentAdminSession;
  }

  /**
   * Check if current user has specific permission
   */
  public hasPermission(permission: AdminPermission): boolean {
    if (!this.currentAdminSession) {
      return false;
    }

    return this.currentAdminSession.permissions.includes(permission);
  }

  /**
   * Validate admin session is still valid
   */
  public isSessionValid(): boolean {
    if (!this.currentAdminSession) {
      return false;
    }

    return new Date() < this.currentAdminSession.expiresAt;
  }

  /**
   * Refresh admin session
   */
  public async refreshSession(): Promise<AuthResult<AdminAuthSession>> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        return {
          success: false,
          error: {
            type: 'authentication',
            message: 'Failed to refresh session',
            details: error,
            timestamp: new Date()
          }
        };
      }

      if (this.currentAdminSession) {
        this.currentAdminSession = {
          ...this.currentAdminSession,
          session: data.session,
          expiresAt: new Date(data.session.expires_at! * 1000)
        };

        this.setupSessionRefresh(data.session);
      }

      return {
        success: true,
        data: this.currentAdminSession!
      };

    } catch (error) {
      logger.error('Session refresh error', { error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Session refresh system error',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Validate credentials format
   */
  private validateCredentials(credentials: SignInCredentials): AuthResult<void> {
    const errors: string[] = [];

    if (!credentials.email || typeof credentials.email !== 'string') {
      errors.push('Valid email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.push('Invalid email format');
    }

    if (!credentials.password || typeof credentials.password !== 'string') {
      errors.push('Password is required');
    } else if (credentials.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: {
          type: 'validation',
          message: errors.join(', '),
          timestamp: new Date()
        }
      };
    }

    return {
      success: true,
      data: undefined
    };
  }

  /**
   * Get admin profile from database
   */
  private async getAdminProfile(userId: string): Promise<AuthResult<AuthUser>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return {
          success: false,
          error: {
            type: 'authentication',
            message: 'Admin profile not found',
            details: error,
            timestamp: new Date()
          }
        };
      }

      // Fetch admin jurisdictions if user has admin role
      let jurisdictions: any[] = [];
      if (isAdminRole(data.role)) {
        const { data: jurisdictionData, error: jurisdictionError } = await supabase
          .from('admin_jurisdictions')
          .select('*')
          .eq('admin_user_id', userId)
          .eq('is_active', true);

        if (jurisdictionError) {
          logger.warn('Failed to fetch admin jurisdictions', {
            userId,
            error: jurisdictionError
          });
          // Continue without jurisdictions but log the warning
        } else {
          jurisdictions = jurisdictionData || [];
        }
      }

      // Transform database profile to AuthUser with jurisdiction data
      const authUser: AuthUser = {
        id: data.id,
        email: data.email,
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        emailConfirmed: true, // Assuming confirmed if in database
        createdAt: new Date(data.created_at),
        lastSignInAt: new Date(),
        jurisdiction: jurisdictions.reduce((acc, j) => {
          if (j.jurisdiction_type === 'campus') {
            acc.campuses = acc.campuses || [];
            acc.campuses.push({
              code: j.jurisdiction_code,
              name: j.jurisdiction_name,
              metadata: j.metadata
            });
          } else if (j.jurisdiction_type === 'country') {
            acc.countries = acc.countries || [];
            acc.countries.push({
              code: j.jurisdiction_code,
              name: j.jurisdiction_name,
              metadata: j.metadata
            });
          }
          return acc;
        }, {} as any)
      };

      return {
        success: true,
        data: authUser
      };

    } catch (error) {
      logger.error('Error fetching admin profile', { userId, error });
      return {
        success: false,
        error: {
          type: 'system',
          message: 'Failed to fetch admin profile',
          details: error,
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Setup automatic session refresh
   */
  private setupSessionRefresh(session: Session): void {
    if (this.sessionRefreshTimer) {
      clearTimeout(this.sessionRefreshTimer);
    }

    // Refresh session 5 minutes before expiry
    const refreshTime = (session.expires_at! * 1000) - Date.now() - (5 * 60 * 1000);

    if (refreshTime > 0) {
      this.sessionRefreshTimer = setTimeout(async () => {
        await this.refreshSession();
      }, refreshTime);
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance of AdminAuthService
 * Following Apple-Grade singleton pattern for consistent session management
 */
export const adminAuthService = new AdminAuthService();

// Export types for external use
export type { AdminAuthSession, AdminSignInResult };
