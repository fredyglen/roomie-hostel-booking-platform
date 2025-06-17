import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'student' | 'owner' | 'admin';

export interface AuthUser extends Omit<SupabaseUser, 'role'> {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, metadata?: Record<string, unknown>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

export interface AuthErrorResponse {
  message: string;
  status?: number;
  code?: string;
}