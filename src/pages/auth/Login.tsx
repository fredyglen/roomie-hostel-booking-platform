import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldValues, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Logo from '@/components/common/Logo';
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

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const userRole = (user as any).role || 'student';

      logger.debug('Login redirect - user role detected', {
        userId: user.id,
        role: userRole,
        userObject: user
      });

      const from = location.state?.from ||
        (userRole === 'student' ? '/student/dashboard' :
         userRole === 'owner' || userRole === 'agent' ? '/owner/dashboard' :
         userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');

      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Form submission handler
  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      logger.info('Login form submitted', { email: values.email });
      await signIn(values.email, values.password);

      toast({
        title: "Login successful",
        description: "You have been signed in",
      });
      // The redirection will be handled by the useEffect above when the user state updates
    } catch (error: unknown) {
      logger.error('Login error', { error });
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: '#e8eaed' }}>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200" style={{ padding: '40px 32px', maxWidth: '400px' }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="sm" withText={false} />
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="flex-1 h-12 border border-gray-300 rounded-lg bg-white flex items-center justify-center gap-2 text-sm font-medium hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            Google
          </button>
          <button className="flex-1 h-12 border border-gray-300 rounded-lg bg-white flex items-center justify-center gap-2 text-sm font-medium hover:shadow-sm transition-shadow">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="text-center text-gray-500 text-sm mb-6 relative">
          <span className="bg-white px-3">or sign in with</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base outline-none focus:border-blue-600 transition-colors"
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
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-base outline-none focus:border-blue-600 transition-colors"
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Remember this Device</span>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password ?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-full text-sm font-medium transition-colors mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600 mt-6">
          New to ROOMi?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>

        {/* Quick Demo Login - Compact */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-1">
            <button
              type="button"
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.preventDefault();
                form.setValue('email', 'student@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Student
            </button>
            <button
              type="button"
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.preventDefault();
                form.setValue('email', 'owner@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Owner
            </button>
            <button
              type="button"
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.preventDefault();
                form.setValue('email', 'admin@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
