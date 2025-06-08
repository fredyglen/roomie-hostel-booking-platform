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

  // Robust profile fetcher/creator
  const fetchOrCreateUserProfile = async (userId: string, email: string): Promise<AuthUser | null> => {
    // Try to fetch profile
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') {
      // Not found error is ok, others are not
      return null;
    }
    // If not found, create a default profile (for demo/dev)
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          role: 'student', // Default to student for demo, adjust as needed
        })
        .select()
        .single();
      if (insertError) return null;
      profile = newProfile;
    }
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
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    setLoading(true);
    setSession(session);
    if (session?.user) {
      const userProfile = await fetchOrCreateUserProfile(session.user.id, session.user.email!);
      setUser(userProfile);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Auth state change will handle navigation
    setLoading(false);
  };

  const signUp = async (email: string, password: string, role: string): Promise<void> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });
    if (error) throw error;
    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        role: role,
      });
    }
    setLoading(false);
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    navigate('/', { replace: true });
  };

  const refreshAuth = async (): Promise<void> => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await handleAuthStateChange('REFRESH', session);
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    // Initial session check
    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthStateChange('INITIAL_SESSION', session);
      setLoading(false);
    })();
    return () => subscription.unsubscribe();
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
