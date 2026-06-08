/**
 * Admin Login Page
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides dedicated authentication interface for admin users
 * with role-based login, session management, and secure access to admin portal
 * 
 * Technical Implementation: Uses AdminAuthContext for admin-specific authentication
 * separate from regular user authentication, with proper error handling and validation
 * 
 * @author ROOMie Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ROOMiLogo } from '@/components/ui/SocialIcons';
import { toast } from "@/components/ui/use-toast";
import { Loader } from 'lucide-react';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// FORM VALIDATION SCHEMA
// ============================================================================

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid admin email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// ============================================================================
// ADMIN LOGIN COMPONENT
// ============================================================================

/**
 * Admin Login Component
 * Provides secure authentication interface for admin users
 */
const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInAdmin, adminUser, loading, error, clearError } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ============================================================================
  // AUTHENTICATION HANDLING
  // ============================================================================

  /**
   * Handle successful admin authentication
   */
  useEffect(() => {
    if (adminUser && !loading) {
      // Get redirect URL from query params or default to admin dashboard
      const searchParams = new URLSearchParams(location.search);
      const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

      logger.info('Admin login successful, redirecting', {
        userId: adminUser.id,
        role: adminUser.role,
        redirectTo
      });

      toast({
        title: "Welcome back!",
        description: `Signed in as ${adminUser.role.replace('_', ' ')}`,
      });

      // Force navigation with a small delay to ensure state is updated
      setTimeout(() => {
        console.log('🚀 Navigating to:', redirectTo);
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  }, [adminUser, loading, navigate, location, toast]);

  /**
   * Handle form submission
   * TEMPORARY TESTING BYPASS - NOT PRODUCTION CODE
   */
  const onSubmit = async (values: AdminLoginFormValues): Promise<void> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      clearError();

      logger.info('Admin login attempt', { email: values.email });

      // Use admin authentication (includes test mode handling)
      await signInAdmin({
        email: values.email,
        password: values.password
      });

      // Success handling is done in useEffect above
      logger.info('Admin sign in completed, waiting for auth state change');

    } catch (error: unknown) {
      logger.error('Admin login error', { error });

      let errorMessage = "An error occurred during admin login";
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid admin credentials. Please check your email and password.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please confirm your admin account before signing in.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = "Access denied. This account does not have admin privileges.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Admin login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // ✅ CRITICAL FIX - Always reset loading state
      setIsSubmitting(false);
      // Force clear any stuck loading states
      setTimeout(() => {
        setIsSubmitting(false);
      }, 100);
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className="min-h-screen flex bg-white">
      {/* Form Panel — 2/5 on desktop, full width on mobile */}
      <div className="w-full md:w-2/5 flex flex-col justify-center px-6 py-8 md:px-16 md:py-12">
        <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <ROOMiLogo size={28} />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Admin Portal</h1>
          <p className="text-xs text-gray-500">Sign in to access the ROOMie admin dashboard</p>
        </div>

        {/* Admin Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="block text-sm font-medium text-gray-900">Admin Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="admin@roomi.com"
                      className="h-11 w-full rounded-sm border border-gray-300 px-3 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="block text-sm font-medium text-gray-900">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your admin password"
                      className="h-11 w-full rounded-sm border border-gray-300 px-3 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-sm bg-primary text-sm font-medium text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Signing in..." : "Sign in to Admin Portal"}
            </Button>
          </form>
        </Form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400">
          <Link
            to="/login"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to regular login
          </Link>
        </div>
        </div>
      </div>

      {/* Image Panel — 3/5 on desktop, hidden on mobile */}
      <div className="hidden md:flex w-3/5 items-center justify-center bg-primary text-white">
        <div className="flex flex-col items-center gap-4 px-10">
          <ROOMiLogo size={56} />
          <p className="text-center text-sm leading-relaxed text-white/90">
            Manage properties, verify listings, and oversee the ROOMie platform from your admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
