
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      logger.info('Fetching user profile', { userId });

      // Get the base user data from auth first
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser || authUser.id !== userId) {
        logger.error('Auth user mismatch', { authUserId: authUser?.id, expectedUserId: userId });
        return null;
      }

      // Try to fetch profile, but don't fail if it doesn't exist
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.warn('Profile not found, using auth user data only', { error: error.message });
        // Return auth user with default role if profile doesn't exist
        return {
          ...authUser,
          role: authUser.user_metadata?.role || 'student',
          firstName: authUser.user_metadata?.first_name,
          lastName: authUser.user_metadata?.last_name,
          phone: authUser.user_metadata?.phone,
          avatarUrl: authUser.user_metadata?.avatar_url
        } as AuthUser;
      }

      logger.info('Profile fetched successfully', { profile });

      // Combine auth user data with profile data
      const combinedUser = {
        ...authUser,
        role: profile.role || authUser.user_metadata?.role || 'student',
        firstName: profile.first_name || authUser.user_metadata?.first_name,
        lastName: profile.last_name || authUser.user_metadata?.last_name,
        phone: profile.phone || authUser.user_metadata?.phone,
        avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url
      } as AuthUser;

      logger.info('User profile combined', { role: combinedUser.role, email: combinedUser.email });
      return combinedUser;
    } catch (error) {
      logger.error('Error in fetchUserProfile', { error });
      // Return null to indicate failure, but don't throw
      return null;
    }
  };

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      try {
        logger.info('Getting initial session');
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user) {
          logger.info('Session found, fetching user profile', { userId: session.user.id });
          const userWithProfile = await fetchUserProfile(session.user.id);
          setUser(userWithProfile);
        } else {
          logger.info('No session found');
          setUser(null);
        }
      } catch (error) {
        logger.error('Error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
        logger.info('Initial auth check completed');
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      logger.warn('Auth initialization timeout, setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout

    getSession().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          logger.info('Auth state changed', { event, hasSession: !!session });
          setSession(session);

          if (session?.user) {
            logger.info('User session detected, fetching profile', { userId: session.user.id });
            const userWithProfile = await fetchUserProfile(session.user.id);
            setUser(userWithProfile);
          } else {
            logger.info('No user session, clearing user state');
            setUser(null);
          }
        } catch (error) {
          logger.error('Error in auth state change handler', { error });
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      logger.info('Attempting sign in', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Sign in failed', { error });
        setLoading(false);
        throw error;
      }

      if (data.user && data.session) {
        setSession(data.session);
        logger.info('Sign in successful, fetching profile');
        // Fetch the user profile immediately
        const userWithProfile = await fetchUserProfile(data.user.id);
        if (userWithProfile) {
          setUser(userWithProfile);
          logger.info('User profile set', { role: userWithProfile.role });
        }
      }

      setLoading(false);
    } catch (error) {
      logger.error('Error signing in', { error });
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: string,
    profileData?: { firstName?: string; lastName?: string; phone?: string }
  ): Promise<void> => {
    try {
      setLoading(true);

      // Limit password length to avoid Supabase errors
      if (password.length > 72) {
        throw new Error('Password cannot be longer than 72 characters');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            first_name: profileData?.firstName || '',
            last_name: profileData?.lastName || '',
            phone: profileData?.phone || ''
          }
        }
      });

      if (error) {
        setLoading(false);
        throw error;
      }

      // If user is created, create profile
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              role: role as any,
              first_name: profileData?.firstName || '',
              last_name: profileData?.lastName || '',
              phone: profileData?.phone || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            logger.warn('Profile creation failed', profileError);
            // Don't throw error here, auth was successful
          }
        } catch (profileError) {
          logger.warn('Profile creation error', profileError);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setLoading(false);
      logger.info('User signed out');
    } catch (error) {
      logger.error('Error signing out', { error });
      setLoading(false);
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const userWithProfile = await fetchUserProfile(session.user.id);
        setUser(userWithProfile);
      } else {
        setUser(null);
      }
    } catch (error) {
      logger.error('Error refreshing auth', { error });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
