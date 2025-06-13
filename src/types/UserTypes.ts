// User related type definitions

export type UserRole = 'owner' | 'student' | 'admin';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export interface UserProfile {
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  university?: string;
  student_id?: string;
  graduation_year?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'email'>>;

// User form values
export interface UserFormValues {
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

// Authentication types
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

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}
