import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, User } from '@/types/core';
import { logger } from '@/utils/enhanced-logger';
import { Session } from '@supabase/supabase-js';

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpData extends AuthCredentials {
  firstName: string;
  lastName: string;
  role: 'owner' | 'student';
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

export async function signIn(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
  try {
    logger.info('Attempting to sign in user', { email: credentials.email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      logger.error('Sign in failed', { error });
      return {
        status: 'error',
        error: {
          message: error.message,
          details: error
        }
      };
    }

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();

    if (userError) {
      logger.warn('Signed in but failed to fetch user profile', { error: userError });
    }

    logger.info('User signed in successfully', { userId: data.user?.id });
    
    return {
      status: 'success',
      data: {
        user: userData as User || null,
        session: data.session
      }
    };
  } catch (error) {
    logger.error('Unexpected error during sign in', { error });
    return {
      status: 'error',
      error: {
        message: 'An unexpected error occurred during sign in',
        details: error
      }
    };
  }
}

export async function signUp(data: SignUpData): Promise<ApiResponse<AuthResponse>> {
  try {
    logger.info('Attempting to sign up user', { email: data.email });
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      logger.error('Sign up failed', { error: authError });
      return {
        status: 'error',
        error: {
          message: authError.message,
          details: authError
        }
      };
    }

    if (!authData.user) {
      logger.error('Sign up returned no user');
      return {
        status: 'error',
        error: {
          message: 'Failed to create user account',
          details: null
        }
      };
    }

    // Create user profile
    const { data: userData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Failed to create user profile', { error: profileError });
      // Consider deleting the auth user if profile creation fails
      return {
        status: 'error',
        error: {
          message: 'Account created but failed to set up profile',
          details: profileError
        }
      };
    }

    logger.info('User signed up successfully', { userId: authData.user.id });
    
    return {
      status: 'success',
      data: {
        user: userData as User,
        session: authData.session
      }
    };
  } catch (error) {
    logger.error('Unexpected error during sign up', { error });
    return {
      status: 'error',
      error: {
        message: 'An unexpected error occurred during sign up',
        details: error
      }
    };
  }
}

export async function signOut(): Promise<ApiResponse<null>> {
  try {
    logger.info('Signing out user');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Sign out failed', { error });
      return {
        status: 'error',
        error: {
          message: error.message,
          details: error
        }
      };
    }
    
    logger.info('User signed out successfully');
    
    return {
      status: 'success',
      data: null
    };
  } catch (error) {
    logger.error('Unexpected error during sign out', { error });
    return {
      status: 'error',
      error: {
        message: 'An unexpected error occurred during sign out',
        details: error
      }
    };
  }
}

export async function resetPassword(email: string): Promise<ApiResponse<null>> {
  try {
    logger.info('Requesting password reset', { email });
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      logger.error('Password reset request failed', { error });
      return {
        status: 'error',
        error: {
          message: error.message,
          details: error
        }
      };
    }

    logger.info('Password reset email sent successfully');

    return {
      status: 'success',
      data: null
    };
  } catch (error) {
    logger.error('Unexpected error during password reset', { error });
    return {
      status: 'error',
      error: {
        message: 'An unexpected error occurred during password reset',
        details: error
      }
    };
  }
}