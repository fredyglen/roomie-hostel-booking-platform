/**
 * Admin Authentication System Tests
 * Apple-Grade test implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Comprehensive testing of admin authentication system
 * including role validation, permission checking, and session management
 * 
 * Technical Implementation: Unit and integration tests for admin auth service,
 * role service, and authentication context with complete error handling coverage
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { adminAuthService } from '@/services/auth/adminAuthService';
import { adminRoleService } from '@/services/auth/adminRoleService';
import { 
  AdminRoleType, 
  SignInCredentials, 
  createAdminPermission,
  createCampusJurisdiction,
  createCountryJurisdiction
} from '@/types/auth';

// ============================================================================
// TEST SETUP AND MOCKS
// ============================================================================

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      refreshSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}));

// Mock logger
vi.mock('@/utils/enhanced-logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// ============================================================================
// ADMIN ROLE SERVICE TESTS
// ============================================================================

describe('AdminRoleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role Configuration', () => {
    it('should return supreme admin role configuration', () => {
      const result = adminRoleService.getRoleConfiguration('supreme_admin');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('supreme_admin');
        expect(result.data.jurisdictionScope).toBe('global');
        expect(result.data.internationalAccess).toBe(true);
        expect(result.data.permissions).toContain(createAdminPermission('global.read'));
        expect(result.data.permissions).toContain(createAdminPermission('system.configure'));
      }
    });

    it('should return campus admin role configuration', () => {
      const result = adminRoleService.getRoleConfiguration('campus_admin');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('campus_admin');
        expect(result.data.jurisdictionScope).toBe('campus');
        expect(result.data.internationalAccess).toBe(false);
        expect(result.data.permissions).toContain(createAdminPermission('campus.read'));
        expect(result.data.permissions).toContain(createAdminPermission('properties.approve'));
      }
    });

    it('should return error for invalid role type', () => {
      const result = adminRoleService.getRoleConfiguration('invalid_role' as AdminRoleType);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('validation');
        expect(result.error.message).toContain('not found');
      }
    });
  });

  describe('Permission Checking', () => {
    it('should validate supreme admin permissions', () => {
      const permission = createAdminPermission('global.write');
      const result = adminRoleService.hasPermission('supreme_admin', permission);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it('should reject invalid permissions for campus admin', () => {
      const permission = createAdminPermission('global.delete');
      const result = adminRoleService.hasPermission('campus_admin', permission);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(false);
      }
    });

    it('should validate campus admin permissions', () => {
      const permission = createAdminPermission('properties.approve');
      const result = adminRoleService.hasPermission('campus_admin', permission);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });
  });

  describe('Jurisdiction Validation', () => {
    it('should validate supreme admin global jurisdiction', () => {
      const campuses = ['upsa-accra', 'ug-legon'];
      const countries = ['GH', 'NG'];
      
      const result = adminRoleService.validateJurisdiction(
        'supreme_admin',
        campuses,
        countries
      );
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValid).toBe(true);
        expect(result.data.validCampuses).toHaveLength(2);
        expect(result.data.validCountries).toHaveLength(2);
      }
    });

    it('should require campus assignment for campus admin', () => {
      const result = adminRoleService.validateJurisdiction('campus_admin');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('validation');
        expect(result.error.message).toContain('campus jurisdiction');
      }
    });

    it('should validate campus admin with proper jurisdiction', () => {
      const campuses = ['upsa-accra'];
      
      const result = adminRoleService.validateJurisdiction(
        'campus_admin',
        campuses
      );
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isValid).toBe(true);
        expect(result.data.validCampuses).toHaveLength(1);
      }
    });
  });

  describe('Available Roles', () => {
    it('should return all available admin roles', () => {
      const result = adminRoleService.getAvailableRoles();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain('supreme_admin');
        expect(result.data).toContain('campus_admin');
        expect(result.data).toHaveLength(2);
      }
    });
  });
});

// ============================================================================
// ADMIN AUTH SERVICE TESTS
// ============================================================================

describe('AdminAuthService', () => {
  const mockSupabase = vi.hoisted(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      refreshSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clear any admin sessions
    adminAuthService.signOutAdmin();
  });

  describe('Admin Sign In', () => {
    const validCredentials: SignInCredentials = {
      email: 'admin@roomi.com',
      password: 'SecurePassword123!'
    };

    it('should reject invalid email format', async () => {
      const invalidCredentials: SignInCredentials = {
        email: 'invalid-email',
        password: 'SecurePassword123!'
      };

      const result = await adminAuthService.signInAdmin(invalidCredentials);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('validation');
        expect(result.error.message).toContain('Invalid email format');
      }
    });

    it('should reject weak passwords', async () => {
      const weakPasswordCredentials: SignInCredentials = {
        email: 'admin@roomi.com',
        password: '123'
      };

      const result = await adminAuthService.signInAdmin(weakPasswordCredentials);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('validation');
        expect(result.error.message).toContain('at least 8 characters');
      }
    });

    it('should handle authentication failure', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });

      const result = await adminAuthService.signInAdmin(validCredentials);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('authentication');
        expect(result.error.message).toBe('Invalid admin credentials');
      }
    });
  });

  describe('Session Management', () => {
    it('should return null for no current session', () => {
      const session = adminAuthService.getCurrentAdminSession();
      expect(session).toBeNull();
    });

    it('should validate session expiry', () => {
      const isValid = adminAuthService.isSessionValid();
      expect(isValid).toBe(false);
    });

    it('should check permissions without session', () => {
      const permission = createAdminPermission('global.read');
      const hasPermission = adminAuthService.hasPermission(permission);
      expect(hasPermission).toBe(false);
    });
  });

  describe('Admin Sign Out', () => {
    it('should handle sign out without active session', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: null
      });

      const result = await adminAuthService.signOutAdmin();
      
      expect(result.success).toBe(true);
    });

    it('should handle sign out errors', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        error: { message: 'Sign out failed' }
      });

      const result = await adminAuthService.signOutAdmin();
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('system');
        expect(result.error.message).toBe('Failed to sign out');
      }
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Admin Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role and Permission Integration', () => {
    it('should integrate role service with auth service', () => {
      // Test that role configurations are properly integrated
      const supremeRole = adminRoleService.getRoleConfiguration('supreme_admin');
      const campusRole = adminRoleService.getRoleConfiguration('campus_admin');
      
      expect(supremeRole.success).toBe(true);
      expect(campusRole.success).toBe(true);
      
      if (supremeRole.success && campusRole.success) {
        // Supreme admin should have more permissions than campus admin
        expect(supremeRole.data.permissions.length).toBeGreaterThan(
          campusRole.data.permissions.length
        );
        
        // Supreme admin should have global scope
        expect(supremeRole.data.jurisdictionScope).toBe('global');
        expect(campusRole.data.jurisdictionScope).toBe('campus');
      }
    });

    it('should validate permission hierarchy', () => {
      const globalPermission = createAdminPermission('global.write');
      const campusPermission = createAdminPermission('campus.write');
      
      // Supreme admin should have both permissions
      const supremeGlobal = adminRoleService.hasPermission('supreme_admin', globalPermission);
      const supremeCampus = adminRoleService.hasPermission('supreme_admin', campusPermission);
      
      // Campus admin should only have campus permission
      const campusGlobal = adminRoleService.hasPermission('campus_admin', globalPermission);
      const campusCampus = adminRoleService.hasPermission('campus_admin', campusPermission);
      
      expect(supremeGlobal.success && supremeGlobal.data).toBe(true);
      expect(supremeCampus.success && supremeCampus.data).toBe(true);
      expect(campusGlobal.success && campusGlobal.data).toBe(false);
      expect(campusCampus.success && campusCampus.data).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle cascading errors properly', async () => {
      // Test error propagation through the system
      const invalidCredentials: SignInCredentials = {
        email: '',
        password: ''
      };

      const result = await adminAuthService.signInAdmin(invalidCredentials);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('validation');
        expect(result.error.timestamp).toBeInstanceOf(Date);
      }
    });
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Admin Authentication Performance', () => {
  it('should handle role configuration retrieval efficiently', () => {
    const startTime = performance.now();
    
    // Perform multiple role configuration retrievals
    for (let i = 0; i < 100; i++) {
      adminRoleService.getRoleConfiguration('supreme_admin');
      adminRoleService.getRoleConfiguration('campus_admin');
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (100ms for 200 operations)
    expect(duration).toBeLessThan(100);
  });

  it('should handle permission checking efficiently', () => {
    const permission = createAdminPermission('global.read');
    const startTime = performance.now();
    
    // Perform multiple permission checks
    for (let i = 0; i < 100; i++) {
      adminRoleService.hasPermission('supreme_admin', permission);
      adminRoleService.hasPermission('campus_admin', permission);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (50ms for 200 operations)
    expect(duration).toBeLessThan(50);
  });
});
