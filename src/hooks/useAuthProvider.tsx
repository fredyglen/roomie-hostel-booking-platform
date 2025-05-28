
import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { AuthUser } from '@/lib/supabase';
import { cleanupAuthState } from '@/lib/auth-utils';

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log("Auth state changed:", event);
        setSession(session);
        
        if (session?.user) {
          // Defer data fetching to prevent deadlocks
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id);
            }
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setLoading(false);
          return;
        }
        
        if (!mounted) return;
        
        console.log("Got session:", session ? "exists" : "none");
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        // If profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          await createDefaultProfile(userId);
          return;
        }
        throw error;
      }
      
      console.log("Profile data:", data);
      
      if (data) {
        const authUser: AuthUser = {
          id: data.id,
          email: data.email || session?.user?.email || '',
          role: (data.role as 'owner' | 'student' | 'admin') || 'student',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phone: data.phone || '',
          avatarUrl: data.avatar_url || '',
          createdAt: data.created_at || new Date().toISOString(),
        };
        setUser(authUser);
      }
    } catch (error) {
      console.error('Error processing user profile:', error);
      // Create default profile on error
      await createDefaultProfile(userId);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      const newUser = session?.user;
      if (!newUser) return;

      const defaultRole = 'student';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email: newUser.email || '',
          role: defaultRole,
          first_name: newUser.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: newUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          avatar_url: newUser.user_metadata?.avatar_url || '',
        });
        
      if (insertError) {
        console.error('Error creating user profile:', insertError);
      } else {
        // Set user with available data
        const authUser: AuthUser = {
          id: newUser.id,
          email: newUser.email || '',
          role: defaultRole,
          firstName: newUser.user_metadata?.full_name?.split(' ')[0] || '',
          lastName: newUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          avatarUrl: newUser.user_metadata?.avatar_url || '',
          createdAt: new Date().toISOString(),
        };
        setUser(authUser);
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Sign out before signin failed:", err);
      }
      
      console.log("Signing in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<AuthUser>) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      console.log("Signing up with:", email, "and data:", userData);
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role || 'student',
          }
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      
      if (!authData.user) {
        console.error("User creation failed - no user returned");
        throw new Error('User creation failed');
      }

      console.log("Sign up successful:", authData);
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Sign out before Google signin failed:", err);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login'
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Google Sign in failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      
      // Force page reload for clean state
      window.location.href = '/login';
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      // Convert from camelCase to snake_case for database
      const dbData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        avatar_url: data.avatarUrl,
        // Don't update email or role here for security
      };

      console.log("Updating profile:", dbData);

      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', user.id);

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      // Update local user state
      setUser({ ...user, ...data });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
  };
};
