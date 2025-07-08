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
    <div className="min-h-screen flex items-center justify-center" style={{
      background: '#e8eaed',
      padding: '16px'
    }}>
      <div className="bg-white shadow-lg" style={{
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        padding: '32px 24px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div className="flex justify-center" style={{ marginBottom: '24px' }}>
          <ROOMiLogo size={24} />
        </div>

        {/* Social Login Buttons */}
        <div className="flex" style={{ gap: '12px', marginBottom: '20px' }}>
          <button style={{
            flex: 1,
            height: '44px',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <GoogleIcon size={16} />
            Google
          </button>
          <button style={{
            flex: 1,
            height: '44px',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <FacebookIcon size={16} />
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div style={{
          textAlign: 'center',
          color: '#5f6368',
          fontSize: '13px',
          margin: '20px 0',
          position: 'relative'
        }}>
          <span style={{ background: 'white', padding: '0 10px' }}>or sign in with</span>
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
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '20px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 14px',
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
                <FormItem style={{ marginBottom: '20px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 14px',
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
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" style={{
                  width: '14px',
                  height: '14px',
                  border: '1px solid #dadce0',
                  borderRadius: '2px',
                  background: 'white'
                }} />
                <span style={{ fontSize: '13px', color: '#5f6368' }}>Remember this Device</span>
              </div>
              <Link to="/forgot-password" style={{
                color: '#0f68fd',
                fontSize: '13px',
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
                height: '44px',
                background: isSubmitting ? '#6b7280' : '#0f68fd',
                color: '#ffffff',
                border: 'none',
                borderRadius: '22px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader className="animate-spin" size={16} />
              )}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>



        {/* Sign Up Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#5f6368',
          marginTop: '20px'
        }}>
          New to ROOMi?{" "}
          <Link to="/register" style={{
            color: '#0f68fd',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            Create an account
          </Link>
        </div>

        {/* Admin Access Link */}
        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#9aa0a6',
          marginTop: '16px',
          borderTop: '1px solid #f1f3f4',
          paddingTop: '16px'
        }}>
          <Link to="/admin/dashboard" style={{
            color: '#9aa0a6',
            textDecoration: 'none',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          >
            Admin Portal
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
