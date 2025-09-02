/**
 * Admin Authentication Context
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides secure authentication context specifically for admin users
 * with role-based permissions, jurisdiction management, and comprehensive session handling
 * 
 * Technical Implementation: Integrates with admin authentication service and provides
 * React context for admin portal components with type-safe permission checking
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  AuthUser, 
  AuthError, 
  AdminPermission, 
  CampusJurisdiction, 
  CountryJurisdiction,
  AdminRoleType,
  SignInCredentials,
  isAdminUser,
  createAdminPermission
} from '@/types/auth';
import {
  adminAuthService,
  AdminAuthSession,
  AdminSignInResult
} from '@/services/auth/adminAuthService';
import { adminRoleService } from '@/services/auth/adminRoleService';
import { permissionService } from '@/services/auth/permissionService';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// ADMIN AUTH CONTEXT TYPES
// ============================================================================

/**
 * Admin Authentication Context Interface
 * Provides comprehensive admin authentication and authorization
 */
interface AdminAuthContextType {
  // Authentication State
  readonly adminUser: AuthUser | null;
  readonly adminSession: AdminAuthSession | null;
  readonly loading: boolean;
  readonly error: AuthError | null;
  readonly isAuthenticated: boolean;

  // Authentication Methods
  readonly signInAdmin: (credentials: SignInCredentials) => Promise<void>;
  readonly signOutAdmin: () => Promise<void>;
  readonly refreshSession: () => Promise<void>;

  // Authorization Methods
  readonly hasPermission: (permission: AdminPermission) => boolean;
  readonly hasRole: (role: AdminRoleType) => boolean;
  readonly hasAnyRole: (roles: readonly AdminRoleType[]) => boolean;
  readonly canAccessUniversity: (university: string) => boolean;
  readonly hasJurisdiction: (campus?: CampusJurisdiction, country?: CountryJurisdiction) => boolean;
  readonly getAdminRole: () => AdminRoleType | null;
  readonly validateAccess: (requiredPermission: AdminPermission) => boolean;

  // Session Management
  readonly isSessionValid: () => boolean;
  readonly getSessionTimeRemaining: () => number;
  readonly clearError: () => void;
}

/**
 * Admin Auth Context - Apple-Grade Implementation
 */
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// ============================================================================
// ADMIN AUTH PROVIDER COMPONENT
// ============================================================================

/**
 * Admin Authentication Provider
 * Manages admin authentication state and provides context to child components
 */
export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Management
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [adminSession, setAdminSession] = useState<AdminAuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Production authentication state - no test mode

  // ============================================================================
  // INITIALIZATION AND SESSION MANAGEMENT
  // ============================================================================

  /**
   * Initialize admin authentication state
   */
  useEffect(() => {
    initializeAdminAuth();
  }, []);

  /**
   * Initialize admin authentication
   */
  const initializeAdminAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check for existing admin session
      const existingSession = adminAuthService.getCurrentAdminSession();
      
      if (existingSession && adminAuthService.isSessionValid()) {
        setAdminUser(existingSession.user);
        setAdminSession(existingSession);
        
        logger.info('Admin session restored', {
          userId: existingSession.user.id,
          role: existingSession.user.role
        });
      } else if (existingSession) {
        // Session exists but expired, attempt refresh
        const refreshResult = await adminAuthService.refreshSession();
        
        if (refreshResult.success) {
          setAdminUser(refreshResult.data.user);
          setAdminSession(refreshResult.data);
          
          logger.info('Admin session refreshed', {
            userId: refreshResult.data.user.id,
            role: refreshResult.data.user.role
          });
        } else {
          // Refresh failed, clear session
          await adminAuthService.signOutAdmin();
          setError(refreshResult.error);
        }
      }

    } catch (error) {
      logger.error('Error initializing admin auth', { error });
      setError({
        type: 'system',
        message: 'Failed to initialize admin authentication',
        details: error,
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  /**
   * Sign in admin user
   */
  const signInAdmin = useCallback(async (credentials: SignInCredentials) => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Admin sign-in attempt', { email: credentials.email });

      // Production authentication using adminAuthService
      const result = await adminAuthService.signInAdmin(credentials);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Set authenticated admin user and session
      setAdminUser(result.data.user);
      setAdminSession({
        user: result.data.user,
        session: result.data.session,
        permissions: result.data.permissions,
        jurisdiction: result.data.user.jurisdiction || {},
        expiresAt: new Date(result.data.session.expires_at! * 1000)
      });

      logger.info('Production admin sign-in successful', {
        userId: result.data.user.id,
        role: result.data.user.role,
        permissions: result.data.permissions.length
      });



    } catch (error) {
      logger.error('Admin sign-in system error', { error });
      setError({
        type: 'system',
        message: 'Sign-in system error',
        details: error,
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out admin user
   */
  const signOutAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await adminAuthService.signOutAdmin();

      if (result.success) {
        setAdminUser(null);
        setAdminSession(null);
        
        logger.info('Admin sign-out successful');
      } else {
        setError(result.error);
        logger.error('Admin sign-out failed', { error: result.error });
      }

    } catch (error) {
      logger.error('Admin sign-out system error', { error });
      setError({
        type: 'system',
        message: 'Sign-out system error',
        details: error,
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh admin session
   */
  const refreshSession = useCallback(async () => {
    try {
      setError(null);

      const result = await adminAuthService.refreshSession();

      if (result.success) {
        setAdminUser(result.data.user);
        setAdminSession(result.data);
        
        logger.info('Admin session refreshed successfully');
      } else {
        setError(result.error);
        logger.error('Session refresh failed', { error: result.error });
      }

    } catch (error) {
      logger.error('Session refresh system error', { error });
      setError({
        type: 'system',
        message: 'Session refresh system error',
        details: error,
        timestamp: new Date()
      });
    }
  }, []);

  // ============================================================================
  // AUTHORIZATION METHODS
  // ============================================================================

  /**
   * Check if admin has specific permission
   */
  const hasPermission = useCallback((permission: AdminPermission): boolean => {
    if (!adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    const result = permissionService.hasPermission(
      adminUser.role,
      permission,
      adminSession.jurisdiction
    );

    return result.success && result.data;
  }, [adminSession, adminUser]);

  /**
   * Check if admin has specific role
   */
  const hasRole = useCallback((role: AdminRoleType): boolean => {
    return adminUser?.role === role;
  }, [adminUser]);

  /**
   * Check if admin has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: readonly AdminRoleType[]): boolean => {
    return adminUser ? roles.includes(adminUser.role) : false;
  }, [adminUser]);

  /**
   * Check if admin can access specific university
   */
  const canAccessUniversity = useCallback((university: string): boolean => {
    if (!adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    // Supreme admin can access all universities
    if (adminUser.role === 'supreme_admin') {
      return true;
    }

    // Campus admin can only access assigned universities
    if (adminUser.role === 'campus_admin') {
      const campusJurisdictions = adminSession.jurisdiction.campuses || [];
      return campusJurisdictions.includes(university as any);
    }

    return false;
  }, [adminSession, adminUser]);

  /**
   * Check if admin has jurisdiction over campus/country
   */
  const hasJurisdiction = useCallback((
    campus?: CampusJurisdiction, 
    country?: CountryJurisdiction
  ): boolean => {
    if (!adminSession || !isAdminUser(adminUser)) {
      return false;
    }

    // Supreme admin has global jurisdiction
    if (adminUser.role === 'supreme_admin') {
      return true;
    }

    // Campus admin jurisdiction check
    if (adminUser.role === 'campus_admin') {
      if (campus && adminSession.jurisdiction.campuses) {
        return adminSession.jurisdiction.campuses.includes(campus);
      }
      
      if (country && adminSession.jurisdiction.countries) {
        return adminSession.jurisdiction.countries.includes(country);
      }
    }

    return false;
  }, [adminSession, adminUser]);

  /**
   * Get current admin role
   */
  const getAdminRole = useCallback((): AdminRoleType | null => {
    if (!isAdminUser(adminUser)) {
      return null;
    }

    return adminUser.role;
  }, [adminUser]);

  /**
   * Validate access with required permission
   */
  const validateAccess = useCallback((requiredPermission: AdminPermission): boolean => {
    if (!adminSession || !isAdminUser(adminUser)) {
      logger.warn('Access validation failed: No admin session', {
        requiredPermission
      });
      return false;
    }

    if (!adminAuthService.isSessionValid()) {
      logger.warn('Access validation failed: Session expired', {
        requiredPermission
      });
      return false;
    }

    const hasAccess = hasPermission(requiredPermission);
    
    if (!hasAccess) {
      logger.warn('Access validation failed: Insufficient permissions', {
        requiredPermission,
        userRole: adminUser.role,
        userPermissions: adminSession.permissions
      });
    }

    return hasAccess;
  }, [adminSession, adminUser, hasPermission]);

  // ============================================================================
  // SESSION UTILITIES
  // ============================================================================

  /**
   * Check if session is valid
   */
  const isSessionValid = useCallback((): boolean => {
    return adminAuthService.isSessionValid();
  }, []);

  /**
   * Get remaining session time in milliseconds
   */
  const getSessionTimeRemaining = useCallback((): number => {
    if (!adminSession) {
      return 0;
    }

    return Math.max(0, adminSession.expiresAt.getTime() - Date.now());
  }, [adminSession]);

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: AdminAuthContextType = {
    // Authentication State
    adminUser,
    adminSession,
    loading,
    error,
    isAuthenticated: !!adminUser && !!adminSession && isSessionValid(),

    // Authentication Methods
    signInAdmin,
    signOutAdmin,
    refreshSession,

    // Authorization Methods
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccessUniversity,
    hasJurisdiction,
    getAdminRole,
    validateAccess,

    // Session Management
    isSessionValid,
    getSessionTimeRemaining,
    clearError
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook to use admin authentication context
 * Provides type-safe access to admin authentication state and methods
 */
export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};

// ============================================================================
// PERMISSION HELPER HOOKS
// ============================================================================

/**
 * Hook to check specific permission
 */
export const useAdminPermission = (permission: AdminPermission): boolean => {
  const { hasPermission } = useAdminAuth();
  return hasPermission(permission);
};

/**
 * Hook to validate admin access with permission
 */
export const useAdminAccess = (requiredPermission: AdminPermission): boolean => {
  const { validateAccess } = useAdminAuth();
  return validateAccess(requiredPermission);
};
