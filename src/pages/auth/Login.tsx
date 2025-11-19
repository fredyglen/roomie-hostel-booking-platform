import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GoogleIcon, FacebookIcon, ROOMiLogo } from '@/components/ui/SocialIcons';
import { toast } from "@/components/ui/use-toast";
import { Loader } from 'lucide-react';
// Removed unused import
import { logger } from '@/utils/enhanced-logger';
import LoginRedirect from '@/components/auth/LoginRedirect';

// JSX namespace is handled by React types - removing unnecessary declaration

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the form values type from the schema
type LoginFormValues = z.infer<typeof formSchema>;

// Field props are handled by react-hook-form Controller

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Error handling is done through form validation and toast notifications

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Show registration success message if coming from registration
  useEffect(() => {
    if (location.state?.message) {
      toast({
        title: "Registration Successful",
        description: location.state.message,
      });

      // Pre-fill email if provided
      if (location.state.email) {
        form.setValue('email', location.state.email);
      }

      // Clear the state to prevent showing message again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, toast]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      // Type-safe access to user role with fallback
      const userRole = user.role || 'student';

      logger.debug('Login redirect - user role detected', {
        userId: user.id,
        role: userRole,
        userObject: user
      });

      // Reset submitting state before navigation
      setIsSubmitting(false);

      // Show success message
      toast({
        title: "Login successful",
        description: `Welcome back! Redirecting to your ${userRole} dashboard...`,
      });

      const from = location.state?.from ||
        (userRole === 'student' ? '/student/properties' :
         userRole === 'owner' || userRole === 'agent' ? '/owner/dashboard' :
         userRole === 'admin' ? '/admin/dashboard' : '/student/properties');

      navigate(from, { replace: true });
    }
  }, [user, navigate, location, toast]);

  // Form submission handler
  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      logger.info('Login form submitted', { email: values.email });
      await signIn(values.email, values.password);

      // Don't show success toast immediately - wait for navigation
      logger.info('Sign in completed, waiting for auth state change and navigation');

      // The redirection will be handled by the useEffect above when the user state updates
    } catch (error: unknown) {
      logger.error('Login error', { error });

      // Provide more specific error messages
      let errorMessage = "An error occurred during login";
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and confirm your account before signing in.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Reset submitting state on error
      setIsSubmitting(false);
    }
    // Don't set isSubmitting to false on success - let navigation handle it
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-5xl bg-white flex flex-col md:flex-row md:rounded-xl md:shadow-lg md:border md:border-gray-100 overflow-hidden">
        <div className="w-full md:w-1/2 px-4 py-6 md:px-10 md:py-12">
        {/* Logo */}
        <div className="mb-6 flex justify-center md:justify-start">
          <ROOMiLogo size={28} />
        </div>

        {/* Social Login Buttons */}
        <div className="mb-5 flex gap-3">
          <button
            type="button"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 transition-shadow hover:shadow-sm"
          >
            <GoogleIcon size={16} />
            Google
          </button>
          <button
            type="button"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 transition-shadow hover:shadow-sm"
          >
            <FacebookIcon size={16} />
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="bg-white px-2">or sign in with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="block text-sm font-medium text-gray-900">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                      autoComplete="email"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="block text-sm font-medium text-gray-900">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                      autoComplete="current-password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Device and Forgot Password */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                />
                <span>Remember this device</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-white hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader className="h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>



        {/* Sign Up Link */}
        <div className="mt-5 text-center text-xs text-gray-500">
          New to ROOMie?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </div>

        {/* Admin Access Link */}
        <div className="mt-4 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400">
          <Link
            to="/admin/login"
            className="text-gray-500 hover:text-gray-700"
          >
            Admin Portal
          </Link>
        </div>
      </div>
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-primary text-white">
        <div className="flex flex-col items-center gap-4 px-10">
          <ROOMiLogo size={56} />
          <p className="text-center text-sm leading-relaxed text-white/90">
            ROOMie makes booking verified student housing simple,
            transparent, and stress-free.
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
