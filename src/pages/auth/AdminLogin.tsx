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
 * @author ROOMi Platform Team
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
import { Loader, Shield, Lock, User } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to access the ROOMi admin dashboard</p>
        </div>

        {/* Admin Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Admin Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@roomi.com"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
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
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your admin password"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign in to Admin Portal
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              Need help accessing your admin account?
            </p>
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to regular login
            </Link>
          </div>
        </div>

        {/* Production Admin Portal */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">Production Admin Portal</p>
            <p className="text-xs text-blue-700">
              Use your assigned admin credentials to access the ROOMi admin portal.
              Contact your system administrator if you need access.
            </p>
            {adminUser && (
              <div className="mt-3">
                <p className="text-xs text-green-700 mb-2">✅ Logged in as: {adminUser.role}</p>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/dashboard', { replace: true })}
                  className="text-xs"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
