import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { cleanupAuthState } from '@/lib/auth-utils';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/utils/enhanced-logger';

interface AuthUser extends User {
  role: 'owner' | 'student' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      logger.info('Fetching user profile', { userId });
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        logger.error('Error fetching user profile', { error });
        ErrorHandler.handle(error, 'Error fetching user profile');
        return null;
      }

      logger.info('User profile fetched successfully', { role: profile.role });
      return {
        id: userId,
        email: profile.email,
        role: profile.role as 'owner' | 'student' | 'admin',
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        aud: 'authenticated',
        created_at: profile.created_at,
        app_metadata: {},
        user_metadata: {},
        identities: [],
        updated_at: profile.created_at
      };
    } catch (error) {
      logger.error('Error in fetchUserProfile', { error });
      ErrorHandler.handle(error, 'Error in fetchUserProfile');
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    logger.info('Auth state changed', { event, hasSession: !!session });
    
    try {
      setLoading(true);
      setSession(session);
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          logger.info('Setting user profile', { role: userProfile.role });
          setUser(userProfile);
        } else {
          logger.warn('Failed to fetch user profile, clearing user state');
          setUser(null);
        }
      } else {
        logger.info('No session, clearing user state');
        setUser(null);
      }
    } catch (error) {
      logger.error('Error in handleAuthStateChange', { error });
      ErrorHandler.handle(error, 'Error in handleAuthStateChange');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      logger.info('Attempting sign in', { email });
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        logger.warn('Global signout failed, continuing...', { error: err });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Sign in failed', { error });
        throw error;
      }

      if (data.user) {
        logger.info('Sign in successful, waiting for auth state change');
        // The navigation will be handled by the auth state change listener
      }
    } catch (error) {
      logger.error('Sign in error', { error });
      ErrorHandler.handle(error, 'Sign In error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: string): Promise<void> => {
    try {
      setLoading(true);
      logger.info('Attempting sign up', { email, role });
      
      // Clean up any existing auth state
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          }
        }
      });

      if (error) {
        logger.error('Sign up failed', { error });
        throw error;
      }

      if (data.user) {
        logger.info('Creating user profile', { userId: data.user.id });
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            role: role,
          });

        if (profileError) {
          logger.error('Error creating profile', { error: profileError });
          ErrorHandler.handle(profileError, 'Error creating profile');
        }

        logger.info('Sign up successful, waiting for auth state change');
        // The navigation will be handled by the auth state change listener
      }
    } catch (error) {
      logger.error('Sign up error', { error });
      ErrorHandler.handle(error, "Registration submission error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.info('Attempting sign out');
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        logger.warn('Sign out error during global signout attempt', { error: err });
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      logger.info('Sign out successful, redirecting to root');
      navigate('/', { replace: true });
    } catch (error) {
      logger.error('Sign out error', { error });
      ErrorHandler.handle(error, 'Sign out error');
      // Still clear local state and redirect
      setUser(null);
      setSession(null);
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      logger.info('Refreshing auth state');
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthStateChange('REFRESH', session);
    } catch (error) {
      logger.error('Error refreshing auth', { error });
      ErrorHandler.handle(error, 'Error refreshing auth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    logger.info('Setting up auth state listener');
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth state');
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthStateChange('INITIAL_SESSION', session);
      } catch (error) {
        logger.error('Error initializing auth', { error });
        ErrorHandler.handle(error, 'Error initializing auth');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      logger.info('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 