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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-roomi-blue-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center text-center">
          <Logo size="lg" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900 font-bricolage">Sign in to your account</h1>
          <p className="mt-3 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-roomi-blue-600 hover:text-roomi-blue-700 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-roomi-blue-600 hover:text-roomi-blue-700 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-premium bg-roomi-blue-600 hover:bg-roomi-blue-700 text-white font-medium py-3 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-premium mr-2 w-4 h-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        {/* Premium Demo Accounts Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-roomi-blue-50 to-roomi-teal-50 rounded-xl border border-roomi-blue-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">Demo Accounts (Development Only)</h3>
          <div className="space-y-3 text-xs mb-6">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">Student:</span>
              <span className="text-gray-600 font-mono">student@roomi.com / password123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">Owner:</span>
              <span className="text-gray-600 font-mono">owner@roomi.com / password123</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <span className="font-medium text-gray-700">Admin:</span>
              <span className="text-gray-600 font-mono">admin@roomi.com / password123</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="btn-premium border-roomi-blue-300 text-roomi-blue-700 hover:bg-roomi-blue-100 font-medium"
              onClick={() => {
                form.setValue('email', 'student@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Student
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="btn-premium border-roomi-teal-300 text-roomi-teal-700 hover:bg-roomi-teal-100 font-medium"
              onClick={() => {
                form.setValue('email', 'owner@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Owner
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="btn-premium border-roomi-orange-300 text-roomi-orange-700 hover:bg-roomi-orange-100 font-medium"
              onClick={() => {
                form.setValue('email', 'admin@roomi.com');
                form.setValue('password', 'password123');
              }}
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
