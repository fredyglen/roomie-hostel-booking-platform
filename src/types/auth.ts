import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'student' | 'owner' | 'supreme_admin' | 'campus_admin';
export type AdminRoleType = 'supreme_admin' | 'campus_admin';

/**
 * Branded type for admin permissions
 */
export type AdminPermission = string & { readonly __brand: 'AdminPermission' };

/**
 * Branded type for campus jurisdiction
 */
export type CampusJurisdiction = string & { readonly __brand: 'CampusJurisdiction' };

/**
 * Branded type for country jurisdiction
 */
export type CountryJurisdiction = string & { readonly __brand: 'CountryJurisdiction' };

/**
 * Admin role configuration with complete type safety
 */
export interface AdminRoleConfiguration {
  readonly type: AdminRoleType;
  readonly permissions: readonly AdminPermission[];
  readonly features: readonly string[];
  readonly jurisdictionScope: 'global' | 'country' | 'campus';
  readonly campusJurisdiction?: readonly CampusJurisdiction[];
  readonly countryJurisdiction?: readonly CountryJurisdiction[];
  readonly internationalAccess: boolean;
}

/**
 * Enhanced auth user with admin role support
 */
export interface AuthUser extends Omit<SupabaseUser, 'role'> {
  readonly role: UserRole;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly adminRole?: AdminRoleConfiguration;
  readonly permissions?: readonly AdminPermission[];
  readonly jurisdiction?: {
    readonly campuses?: readonly CampusJurisdiction[];
    readonly countries?: readonly CountryJurisdiction[];
  };
}

/**
 * Authentication state with comprehensive error handling
 */
export interface AuthState {
  readonly user: AuthUser | null;
  readonly loading: boolean;
  readonly error: AuthError | null;
}

/**
 * Apple-Grade error handling for authentication
 */
export interface AuthError {
  readonly type: 'authentication' | 'authorization' | 'network' | 'validation' | 'system';
  readonly message: string;
  readonly code?: string;
  readonly details?: unknown;
  readonly timestamp: Date;
}

/**
 * Sign-in credentials with validation
 */
export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * Enhanced sign-up credentials with admin support
 */
export interface SignUpCredentials extends SignInCredentials {
  readonly role: UserRole;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly adminRole?: AdminRoleType;
  readonly jurisdiction?: {
    readonly campuses?: readonly CampusJurisdiction[];
    readonly countries?: readonly CountryJurisdiction[];
  };
}

/**
 * Enhanced auth context with admin role management
 */
export interface AuthContextType {
  readonly user: AuthUser | null;
  readonly loading: boolean;
  readonly error: AuthError | null;
  readonly signIn: (email: string, password: string) => Promise<void>;
  readonly signUp: (email: string, password: string, role: UserRole, metadata?: Record<string, unknown>) => Promise<void>;
  readonly signOut: () => Promise<void>;
  readonly resetPassword: (email: string) => Promise<void>;
  readonly updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  readonly hasPermission: (permission: AdminPermission) => boolean;
  readonly hasJurisdiction: (campus?: CampusJurisdiction, country?: CountryJurisdiction) => boolean;
  readonly isAdmin: () => boolean;
  readonly getAdminRole: () => AdminRoleConfiguration | null;
}

/**
 * Result type for authentication operations
 */
export type AuthResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: AuthError };

/**
 * JWT payload structure for admin authentication
 */
export interface AdminJWTPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: UserRole;
  readonly adminRole?: AdminRoleType;
  readonly permissions?: readonly AdminPermission[];
  readonly campusJurisdiction?: readonly CampusJurisdiction[];
  readonly countryJurisdiction?: readonly CountryJurisdiction[];
  readonly iat: number;
  readonly exp: number;
}

// ============================================================================
// HELPER FUNCTIONS FOR TYPE SAFETY
// ============================================================================

/**
 * Type guard for admin roles
 */
export const isAdminRole = (role: UserRole): role is AdminRoleType => {
  return role === 'supreme_admin' || role === 'campus_admin';
};

/**
 * Type guard for admin users
 */
export const isAdminUser = (user: AuthUser | null): user is AuthUser & { role: AdminRoleType } => {
  return user !== null && isAdminRole(user.role);
};

/**
 * Create branded admin permission
 */
export const createAdminPermission = (permission: string): AdminPermission => {
  return permission as AdminPermission;
};

/**
 * Create branded campus jurisdiction
 */
export const createCampusJurisdiction = (campus: string): CampusJurisdiction => {
  return campus as CampusJurisdiction;
};

/**
 * Create branded country jurisdiction
 */
export const createCountryJurisdiction = (country: string): CountryJurisdiction => {
  return country as CountryJurisdiction;
};