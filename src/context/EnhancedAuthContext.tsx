
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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

  // Enhanced profile fetcher with comprehensive fallback handling
  const fetchOrCreateUserProfile = async (userId: string, email: string): Promise<AuthUser | null> => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      logger.info('Fetching user profile', { userId, email });
      
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile && !fetchError) {
        console.log('✅ Profile found:', existingProfile);
        logger.info('User profile found', { role: existingProfile.role });
        
        return {
          id: userId,
          email: existingProfile.email || email,
          role: existingProfile.role as 'owner' | 'student' | 'admin',
          firstName: existingProfile.first_name,
          lastName: existingProfile.last_name,
          phone: existingProfile.phone,
          avatarUrl: existingProfile.avatar_url,
          aud: 'authenticated',
          created_at: existingProfile.created_at,
          app_metadata: {},
          user_metadata: {},
          identities: [],
          updated_at: existingProfile.created_at
        };
      }

      console.log('🔄 Creating new profile for user:', userId);
      logger.info('Creating new user profile', { userId, email });
      
      // Create new profile with comprehensive error handling
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'student' // Default role
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('❌ Profile creation failed:', insertError);
        logger.error('Profile creation failed', { error: insertError });
        
        // CRITICAL: Provide fallback profile to prevent loading loop
        console.log('🔄 Using fallback profile to prevent loading loop');
        return {
          id: userId,
          email: email,
          role: 'student',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [],
          updated_at: new Date().toISOString()
        };
      }

      if (newProfile) {
        console.log('✅ Profile created successfully:', newProfile);
        logger.info('User profile created successfully', { role: newProfile.role });
        
        return {
          id: userId,
          email: newProfile.email,
          role: newProfile.role as 'owner' | 'student' | 'admin',
          firstName: newProfile.first_name,
          lastName: newProfile.last_name,
          phone: newProfile.phone,
          avatarUrl: newProfile.avatar_url,
          aud: 'authenticated',
          created_at: newProfile.created_at,
          app_metadata: {},
          user_metadata: {},
          identities: [],
          updated_at: newProfile.created_at
        };
      }

      // Final fallback if everything else fails
      console.log('🔄 Final fallback - creating minimal profile');
      return {
        id: userId,
        email: email,
        role: 'student',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        updated_at: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Critical profile fetch/create error:', error);
      logger.error('Critical error in fetchOrCreateUserProfile', { error });
      
      // CRITICAL: Always return a profile to prevent infinite loading
      console.log('🚨 Emergency fallback - creating emergency profile to prevent app crash');
      return {
        id: userId,
        email: email,
        role: 'student',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        updated_at: new Date().toISOString()
      };
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log(`🔄 Auth state changed: ${event}`, { hasSession: !!session });
    logger.info('Auth state changed', { event, hasSession: !!session });
    
    try {
      setLoading(true);
      setSession(session);
      
      if (session?.user) {
        console.log('👤 User session found, fetching profile...');
        const userProfile = await fetchOrCreateUserProfile(session.user.id, session.user.email!);
        
        if (userProfile) {
          console.log('✅ Setting user profile:', { role: userProfile.role });
          logger.info('Setting user profile', { role: userProfile.role });
          setUser(userProfile);
        } else {
          console.error('❌ Failed to create user profile, clearing user state');
          logger.warn('Failed to fetch user profile, clearing user state');
          setUser(null);
        }
      } else {
        console.log('🚫 No session, clearing user state');
        logger.info('No session, clearing user state');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error in handleAuthStateChange:', error);
      logger.error('Error in handleAuthStateChange', { error });
      
      // Emergency fallback - don't leave user in loading state
      if (session?.user) {
        console.log('🚨 Emergency: Creating minimal user to prevent loading loop');
        setUser({
          id: session.user.id,
          email: session.user.email || 'unknown@example.com',
          role: 'student',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [],
          updated_at: new Date().toISOString()
        });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
      console.log('✅ Auth state change complete');
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔐 Attempting sign in for:', email);
      logger.info('Attempting sign in', { email });
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('⚠️ Global signout failed, continuing...', err);
        logger.warn('Global signout failed, continuing...', { error: err });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in failed:', error);
        logger.error('Sign in failed', { error });
        throw error;
      }

      if (data.user) {
        console.log('✅ Sign in successful, auth state change will handle the rest');
        logger.info('Sign in successful, waiting for auth state change');
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
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
      console.log('📝 Attempting sign up for:', email, 'with role:', role);
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
        console.error('❌ Sign up failed:', error);
        logger.error('Sign up failed', { error });
        throw error;
      }

      if (data.user) {
        console.log('✅ Sign up successful, creating profile...');
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
          console.error('❌ Error creating profile:', profileError);
          logger.error('Error creating profile', { error: profileError });
          ErrorHandler.handle(profileError, 'Error creating profile');
        }

        console.log('✅ Sign up successful, auth state change will handle navigation');
        logger.info('Sign up successful, waiting for auth state change');
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      logger.error('Sign up error', { error });
      ErrorHandler.handle(error, "Registration submission error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Attempting sign out');
      logger.info('Attempting sign out');
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('⚠️ Sign out error during global signout attempt:', err);
        logger.warn('Sign out error during global signout attempt', { error: err });
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      console.log('✅ Sign out successful, redirecting to root');
      logger.info('Sign out successful, redirecting to root');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Sign out error:', error);
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
      console.log('🔄 Refreshing auth state');
      logger.info('Refreshing auth state');
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthStateChange('REFRESH', session);
    } catch (error) {
      console.error('❌ Error refreshing auth:', error);
      logger.error('Error refreshing auth', { error });
      ErrorHandler.handle(error, 'Error refreshing auth');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth state listener');
    logger.info('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth state...');
        logger.info('Initializing auth state');
        const { data: { session } } = await supabase.auth.getSession();
        await handleAuthStateChange('INITIAL_SESSION', session);
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        logger.error('Error initializing auth', { error });
        ErrorHandler.handle(error, 'Error initializing auth');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth state listener');
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
