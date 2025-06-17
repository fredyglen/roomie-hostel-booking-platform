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
      <div className="bg-white shadow-lg" style={{
        borderRadius: '12px',
        width: '400px',
        padding: '40px 32px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div className="flex justify-center" style={{ marginBottom: '32px' }}>
          <div style={{
            width: '32px',
            height: '24px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: '#1a73e8',
              borderRadius: '50%',
              left: '0',
              top: '0'
            }}></div>
            <div style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: '#34a853',
              borderRadius: '50%',
              right: '0',
              top: '0'
            }}></div>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex" style={{ gap: '16px', marginBottom: '24px' }}>
          <button style={{
            flex: 1,
            height: '48px',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            <div style={{ width: '18px', height: '18px', background: '#1a73e8', borderRadius: '50%' }}></div>
            Google
          </button>
          <button style={{
            flex: 1,
            height: '48px',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            <div style={{ width: '18px', height: '18px', background: '#1877f2', borderRadius: '50%' }}></div>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div style={{
          textAlign: 'center',
          color: '#5f6368',
          fontSize: '14px',
          margin: '24px 0',
          position: 'relative'
        }}>
          <span style={{ background: 'white', padding: '0 12px' }}>or sign in with</span>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            background: '#dadce0',
            zIndex: -1
          }}></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginBottom: '24px' }}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '24px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'block'
                  }}>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      style={{
                        width: '100%',
                        height: '48px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
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
                <FormItem style={{ marginBottom: '24px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'block'
                  }}>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      style={{
                        width: '100%',
                        height: '48px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 16px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" style={{
                  width: '16px',
                  height: '16px',
                  border: '1px solid #dadce0',
                  borderRadius: '2px',
                  background: 'white'
                }} />
                <span style={{ fontSize: '14px', color: '#5f6368' }}>Remember this Device</span>
              </div>
              <Link to="/forgot-password" style={{
                color: '#1a73e8',
                fontSize: '14px',
                textDecoration: 'none',
                cursor: 'pointer'
              }}>
                Forgot Password ?
              </Link>
            </div>

            <Button
              type="submit"
              style={{
                width: '100%',
                height: '48px',
                background: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#5f6368',
          marginTop: '24px'
        }}>
          New to ROOMi?{" "}
          <Link to="/register" style={{
            color: '#1a73e8',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            Create an account
          </Link>
        </div>

        {/* Quick Demo Login - Minimal */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #dadce0' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '12px',
                background: '#f8f9fa',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '12px',
                background: '#f8f9fa',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '12px',
                background: '#f8f9fa',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
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
