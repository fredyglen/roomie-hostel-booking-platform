
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { UserRole, isValidRole } from '@/types/roles';
import { config } from '@/config';
import {
  AuthUser,
  AuthError,
  AdminPermission,
  CampusJurisdiction,
  CountryJurisdiction,
  AdminRoleType,
  isAdminRole,
  isAdminUser,
  createAdminPermission
} from '@/types/auth';
import { adminAuthService, AdminAuthSession } from '@/services/auth/adminAuthService';
import { adminRoleService } from '@/services/auth/adminRoleService';

/**
 * Enhanced Authentication Context with Admin Role Support
 * Apple-Grade implementation following BE CONSCIOUS standards
 */
interface EnhancedAuthContextType {
  // Basic Authentication
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;

  // Standard Auth Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;

  // Session Management
  isSessionValid: () => boolean;
  getSessionTimeRemaining: () => number;

  // Admin-Specific Methods
  signInAdmin: (email: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
  isAdmin: () => boolean;
  getAdminRole: () => AdminRoleType | null;
  hasPermission: (permission: AdminPermission) => boolean;
  hasJurisdiction: (campus?: CampusJurisdiction, country?: CountryJurisdiction) => boolean;
  getAdminSession: () => AdminAuthSession | null;

  // Enhanced Security
  refreshAdminSession: () => Promise<void>;
  validateAdminAccess: () => boolean;
}

const AuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Debouncing mechanism to prevent multiple concurrent profile fetches
  const profileFetchCache = useRef<Map<string, Promise<AuthUser | null>>>(new Map());

  const fetchUserProfile = async (userId: string, authUser?: User): Promise<AuthUser | null> => {
    try {
      // Check if there's already a pending fetch for this user
      const existingFetch = profileFetchCache.current.get(userId);
      if (existingFetch) {
        logger.info('Using cached profile fetch promise', { userId });
        return await existingFetch;
      }

      // Create new fetch promise and cache it
      const fetchPromise = performProfileFetch(userId, authUser);
      profileFetchCache.current.set(userId, fetchPromise);

      // Clean up cache after fetch completes
      try {
        const result = await fetchPromise;
        profileFetchCache.current.delete(userId);
        return result;
      } catch (error) {
        // Clean up cache on error
        profileFetchCache.current.delete(userId);
        throw error;
      }
    } catch (error) {
      logger.error('Error in fetchUserProfile wrapper', { error });
      return null;
    }
  };

  const performProfileFetch = async (userId: string, providedAuthUser?: User): Promise<AuthUser | null> => {
    try {
      logger.info('Fetching user profile', { userId });

      // Use provided auth user or fetch it (optimize to avoid duplicate calls)
      let authUser = providedAuthUser;
      if (!authUser) {
        const { data: { user } } = await supabase.auth.getUser();
        authUser = user;
      }

      if (!authUser || authUser.id !== userId) {
        logger.error('Auth user mismatch', { authUserId: authUser?.id, expectedUserId: userId });
        return null;
      }

      // Create fallback user data first (in case profile fetch fails)
      const fallbackRole = isValidRole(authUser.user_metadata?.role)
        ? authUser.user_metadata.role as UserRole
        : UserRole.STUDENT;

      const fallbackUser: AuthUser = {
        ...authUser,
        role: fallbackRole,
        firstName: authUser.user_metadata?.first_name || '',
        lastName: authUser.user_metadata?.last_name || '',
        phone: authUser.user_metadata?.phone || '',
        avatarUrl: authUser.user_metadata?.avatar_url
      };

      // Try to fetch profile with timeout to prevent hanging
      logger.info('Attempting to fetch profile from database', { userId });

      const profileFetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Add timeout to profile fetch (8 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout after 8 seconds')), 8000);
      });

      const result = await Promise.race([
        profileFetchPromise,
        timeoutPromise
      ]);

      const { data: profile, error } = result;

      logger.info('Profile fetch result', { profile, error: error?.message });

      if (error) {
        logger.warn('Profile fetch error, using fallback user data', {
          error: error.message,
          code: error.code,
          userId: userId
        });
        return fallbackUser;
      }

      logger.info('Profile fetched successfully', { profile });

      // Validate and combine auth user data with profile data
      const profileRole = profile.role || authUser.user_metadata?.role;
      const validatedRole = isValidRole(profileRole) ? profileRole as UserRole : fallbackRole;

      if (profile.role && !isValidRole(profile.role)) {
        logger.warn('Invalid role in profile, using fallback', {
          invalidRole: profile.role,
          fallbackRole: validatedRole,
          userId
        });
      }

      const combinedUser: AuthUser = {
        ...authUser,
        role: validatedRole,
        firstName: profile.first_name || authUser.user_metadata?.first_name,
        lastName: profile.last_name || authUser.user_metadata?.last_name,
        phone: profile.phone || authUser.user_metadata?.phone,
        avatarUrl: profile.avatar_url || authUser.user_metadata?.avatar_url
      };

      logger.info('User profile combined successfully', { role: combinedUser.role, email: combinedUser.email });
      return combinedUser;
    } catch (error) {
      logger.error('Error in performProfileFetch', { error });

      // Return fallback user if we have auth user data
      if (providedAuthUser) {
        const fallbackRole = isValidRole(providedAuthUser.user_metadata?.role)
          ? providedAuthUser.user_metadata.role as UserRole
          : UserRole.STUDENT;

        return {
          ...providedAuthUser,
          role: fallbackRole,
          firstName: providedAuthUser.user_metadata?.first_name || '',
          lastName: providedAuthUser.user_metadata?.last_name || '',
          phone: providedAuthUser.user_metadata?.phone || '',
          avatarUrl: providedAuthUser.user_metadata?.avatar_url
        } as AuthUser;
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
          const userWithProfile = await fetchUserProfile(session.user.id, session.user);
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

    // Add timeout to prevent infinite loading - increased from 3s to 15s for better reliability
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        logger.warn('Auth initialization timeout after 15 seconds, setting loading to false');
        setLoading(false);
      }
    }, 15000); // 15 second timeout for auth initialization (was config.supabase.timeout / 10 = 3s)

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
            const userWithProfile = await fetchUserProfile(session.user.id, session.user);
            if (isMounted) {
              setUser(userWithProfile);
              logger.info('Profile fetch completed, setting loading to false');
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Sign in failed', { error });
        setLoading(false);
        throw error;
      }

      // Don't manually fetch profile here - let the auth state change handler do it
      // This prevents the race condition and infinite loading
      logger.info('Sign in successful, auth state change will handle profile fetch');

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
        const userWithProfile = await fetchUserProfile(session.user.id, session.user);
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

    // Check if session expires within next 5 minutes (configurable)
    const sessionBuffer = config.security.sessionTimeout / 1000 / 12; // 5 minutes for 1 hour timeout
    return expiresAt > (now + sessionBuffer);
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



  return context;
}
