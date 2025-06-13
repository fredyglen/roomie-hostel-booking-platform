
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { cleanupAuthState } from '@/lib/auth-utils';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/enhanced-logger';
import { AuthUser, AuthContextType, UserRole } from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (session?.user) {
              await loadUserProfile(session.user);
            } else {
              setUser(null);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        ErrorHandler.handle(error, 'Auth initialization error');
        setError(error instanceof Error ? error : new Error('Authentication initialization failed'));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user profile data from profiles table
  const loadUserProfile = async (authUser: User): Promise<void> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Combine auth user with profile data
      const enhancedUser: AuthUser = {
        ...authUser,
        role: (profile?.role || 'student') as UserRole,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        phone: profile?.phone,
        avatarUrl: profile?.avatar_url,
      };

      setUser(enhancedUser);
    } catch (error) {
      ErrorHandler.handle(error, 'Load user profile error');
      setError(error instanceof Error ? error : new Error('Failed to load user profile'));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Sign in error');
      setError(error instanceof Error ? error : new Error('Sign in failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    role: UserRole,
    metadata?: Record<string, any>
  ): Promise<void> => {
    try {
      setLoading(true);
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...metadata
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: role,
          first_name: metadata?.firstName,
          last_name: metadata?.lastName,
          phone: metadata?.phone,
        });

      if (profileError) {
        throw profileError;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Sign up error');
      setError(error instanceof Error ? error : new Error('Sign up failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      cleanupAuthState();
      navigate('/login');
    } catch (error) {
      ErrorHandler.handle(error, 'Sign out error');
      setError(error instanceof Error ? error : new Error('Sign out failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Reset password error');
      setError(error instanceof Error ? error : new Error('Reset password failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<AuthUser>): Promise<void> => {
    try {
      setLoading(true);
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Update auth metadata if needed
      if (data.role) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { role: data.role }
        });

        if (authUpdateError) {
          throw authUpdateError;
        }
      }

      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          role: data.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Refresh user data
      await loadUserProfile(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Update profile error');
      setError(error instanceof Error ? error : new Error('Update profile failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
