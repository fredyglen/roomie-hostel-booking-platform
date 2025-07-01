
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { UserRole, isValidRole } from '@/types/roles';

interface AuthUser extends User {
  role: UserRole;
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
  signUp: (email: string, password: string, role: string, profileData?: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;
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

      // Add timeout to profile fetch to prevent hanging
      logger.info('Attempting to fetch profile from database', { userId });

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      logger.info('Profile fetch result', { profile, error: error?.message });

      if (error) {
        logger.warn('Profile fetch error, using auth user data only', {
          error: error.message,
          code: error.code,
          userId: userId
        });
        // Return auth user with default role if profile doesn't exist
        const fallbackRole = isValidRole(authUser.user_metadata?.role)
          ? authUser.user_metadata.role as UserRole
          : UserRole.STUDENT;

        return {
          ...authUser,
          role: fallbackRole,
          firstName: authUser.user_metadata?.first_name || '',
          lastName: authUser.user_metadata?.last_name || '',
          phone: authUser.user_metadata?.phone || '',
          avatarUrl: authUser.user_metadata?.avatar_url
        } as AuthUser;
      }

      logger.info('Profile fetched successfully', { profile });

      // Validate and combine auth user data with profile data
      const profileRole = profile.role || authUser.user_metadata?.role;
      const validatedRole = isValidRole(profileRole) ? profileRole as UserRole : UserRole.STUDENT;

      if (profile.role && !isValidRole(profile.role)) {
        logger.warn('Invalid role in profile, using fallback', {
          invalidRole: profile.role,
          fallbackRole: validatedRole,
          userId
        });
      }

      const combinedUser = {
        ...authUser,
        role: validatedRole,
        firstName: profile.first_name || authUser.user_metadata?.first_name,
        lastName: profile.last_name || authUser.user_metadata?.last_name,
        phone: profile.phone || authUser.user_metadata?.phone,
        avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url
      } as AuthUser;

      logger.info('User profile combined', { role: combinedUser.role, email: combinedUser.email });
      return combinedUser;
    } catch (error) {
      logger.error('Error in fetchUserProfile', { error });
      // Return auth user with fallback data
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && authUser.id === userId) {
          const fallbackRole = isValidRole(authUser.user_metadata?.role)
            ? authUser.user_metadata.role as UserRole
            : UserRole.STUDENT;

          return {
            ...authUser,
            role: fallbackRole,
            firstName: authUser.user_metadata?.first_name,
            lastName: authUser.user_metadata?.last_name,
            phone: authUser.user_metadata?.phone,
            avatarUrl: authUser.user_metadata?.avatar_url
          } as AuthUser;
        }
      } catch (fallbackError) {
        logger.error('Fallback auth user fetch failed', { fallbackError });
      }
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Check active sessions and set the user
    const getSession = async () => {
      try {
        logger.info('Getting initial session');
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(session);

        if (session?.user) {
          logger.info('Session found, fetching user profile', { userId: session.user.id });
          const userWithProfile = await fetchUserProfile(session.user.id);
          if (isMounted) {
            setUser(userWithProfile);
          }
        } else {
          logger.info('No session found');
          if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        logger.error('Error getting session:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          logger.info('Initial auth check completed');
        }
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        logger.warn('Auth initialization timeout, setting loading to false');
        setLoading(false);
      }
    }, 3000); // Reduced to 3 seconds for faster feedback

    getSession().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          logger.info('Auth state changed', { event, hasSession: !!session });

          if (!isMounted) return;

          setSession(session);

          if (session?.user) {
            logger.info('User session detected, fetching profile', { userId: session.user.id });

            try {
              const userWithProfile = await fetchUserProfile(session.user.id);
              if (isMounted) {
                setUser(userWithProfile);
                logger.info('Profile fetch completed, setting loading to false');
              }
            } catch (profileError) {
              logger.error('Profile fetch failed in auth state change', { profileError });
              // Use fallback user data from session
              if (isMounted && session.user) {
                const fallbackUser = {
                  ...session.user,
                  role: UserRole.STUDENT,
                  firstName: session.user.user_metadata?.first_name || '',
                  lastName: session.user.user_metadata?.last_name || '',
                  phone: session.user.user_metadata?.phone || '',
                  avatarUrl: session.user.user_metadata?.avatar_url
                } as AuthUser;
                setUser(fallbackUser);
                logger.info('Using fallback user data');
              }
            }
          } else {
            logger.info('No user session, clearing user state');
            if (isMounted) {
              setUser(null);
            }
          }
        } catch (error) {
          logger.error('Error in auth state change handler', { error });
          if (isMounted) {
            setUser(null);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
            logger.info('Auth state change completed, loading set to false');
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      logger.info('Attempting sign in', { email });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Sign in failed', { error });
        setLoading(false);
        throw error;
      }

      logger.info('Sign in successful, auth state change will handle profile fetch');

      // Add timeout to prevent infinite loading if auth state change doesn't fire
      setTimeout(() => {
        if (loading) {
          logger.warn('Sign in timeout, forcing loading to false');
          setLoading(false);
        }
      }, 8000);

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

      // Profile will be created automatically by database trigger
      if (data.user) {
        logger.info('User created successfully, profile will be created by trigger', { userId: data.user.id });
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

  // Session validation and security monitoring
  const isSessionValid = (): boolean => {
    if (!session) return false;

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at;

    if (!expiresAt) return false;

    // Check if session expires within next 5 minutes
    const fiveMinutes = 5 * 60;
    return expiresAt > (now + fiveMinutes);
  };

  const getSessionTimeRemaining = (): number => {
    if (!session?.expires_at) return 0;

    const now = Math.floor(Date.now() / 1000);
    const remaining = session.expires_at - now;

    return Math.max(0, remaining);
  };

  // Auto-refresh session when it's about to expire
  useEffect(() => {
    if (!session) return;

    const checkSessionExpiry = () => {
      const timeRemaining = getSessionTimeRemaining();

      // Refresh session if less than 10 minutes remaining
      if (timeRemaining > 0 && timeRemaining < 600) {
        logger.info('Session expiring soon, refreshing', { timeRemaining });
        refreshAuth();
      }

      // Log security warning if session is about to expire
      if (timeRemaining < 300 && timeRemaining > 0) {
        logger.warn('Session expires soon', { timeRemaining });
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionExpiry, 60000);

    return () => clearInterval(interval);
  }, [session]);

  // Security monitoring for suspicious activity
  useEffect(() => {
    if (!user) return;

    const monitorActivity = () => {
      // Log user activity for security monitoring
      logger.info('User activity monitored', {
        userId: user.id,
        role: user.role,
        lastActivity: new Date().toISOString(),
        sessionValid: isSessionValid()
      });
    };

    // Monitor activity every 5 minutes
    const interval = setInterval(monitorActivity, 300000);

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAuth,
    isSessionValid,
    getSessionTimeRemaining,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // REMOVED: Development bypass logic - SECURITY RISK eliminated

  return context;
}
