/**
 * User role definitions for ROOMi platform
 * Centralized role management to avoid hardcoded strings
 */

export enum UserRole {
  STUDENT = 'student',
  OWNER = 'owner',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export type UserRoleType = keyof typeof UserRole | UserRole;

/**
 * Role hierarchy and permissions
 */
export const ROLE_HIERARCHY = {
  [UserRole.ADMIN]: 4,
  [UserRole.OWNER]: 3,
  [UserRole.AGENT]: 2,
  [UserRole.STUDENT]: 1
} as const;

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_properties',
    'manage_bookings',
    'view_analytics',
    'manage_platform',
    'verify_properties',
    'manage_agents'
  ],
  [UserRole.OWNER]: [
    'manage_own_properties',
    'view_own_bookings',
    'view_own_analytics',
    'manage_agents'
  ],
  [UserRole.AGENT]: [
    'manage_assigned_properties',
    'view_assigned_bookings',
    'view_assigned_analytics'
  ],
  [UserRole.STUDENT]: [
    'view_properties',
    'create_bookings',
    'view_own_bookings',
    'manage_own_profile'
  ]
} as const;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission as any) || false;
}

/**
 * Check if a role has higher or equal hierarchy level than another
 */
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Validate if a role string is a valid UserRole
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Get all roles that can access a specific permission
 */
export function getRolesWithPermission(permission: string): UserRole[] {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([_, permissions]) => permissions.includes(permission as any))
    .map(([role]) => role as UserRole);
}
