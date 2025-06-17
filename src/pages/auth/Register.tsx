import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ROOMiLogo } from '@/components/ui/SocialIcons';
import { toast } from "@/components/ui/use-toast";
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Loader } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { logger } from '@/utils/enhanced-logger';

// Define the form schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  phone: z.string().optional(),
  role: z.enum(['student', 'owner'] as const, {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Infer the form values type from the schema
type RegisterFormValues = z.infer<typeof formSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "student", // Default to student for the student portal
    },
  });

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student/properties');
      } else if (user.role === 'owner' || user.role === 'admin') {
        navigate('/owner/dashboard');
      }
    }
  }, [user, navigate]);

  // Form submission handler
  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      logger.info('Register form submitted', { email: values.email, role: values.role });
      
      await signUp(
        values.email, 
        values.password, 
        values.role as UserRole,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone
        }
      );
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please log in.",
      });
      navigate('/login');
    } catch (error: unknown) {
      ErrorHandler.handle(error, "Registration submission error");
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="flex justify-center" style={{ marginBottom: '16px' }}>
          <ROOMiLogo size={24} />
        </div>

        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '400',
          color: '#202124',
          marginBottom: '8px'
        }}>Create your account</h2>

        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#5f6368',
          marginBottom: '24px'
        }}>
          Or{" "}
          <Link to="/login" style={{
            color: '#1a73e8',
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            sign in to your existing account
          </Link>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{
                      color: '#202124',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '6px',
                      display: 'block'
                    }}>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        style={{
                          width: '100%',
                          height: '44px',
                          border: '1px solid #dadce0',
                          borderRadius: '8px',
                          padding: '0 14px',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{
                      color: '#202124',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '6px',
                      display: 'block'
                    }}>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        style={{
                          width: '100%',
                          height: '44px',
                          border: '1px solid #dadce0',
                          borderRadius: '8px',
                          padding: '0 14px',
                          fontSize: '16px',
                          outline: 'none'
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '16px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 14px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '16px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+233 50 123 4567"
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '1px solid #dadce0',
                        borderRadius: '8px',
                        padding: '0 14px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                      {...field}
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
                <FormItem style={{ marginBottom: '16px' }}>
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '16px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    display: 'block'
                  }}>Confirm Password</FormLabel>
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem style={{ marginBottom: '20px' }}>
                  <FormLabel style={{
                    color: '#202124',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    display: 'block'
                  }}>I am a:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <FormItem style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel style={{
                          fontWeight: 'normal',
                          fontSize: '14px',
                          color: '#5f6368',
                          margin: 0,
                          cursor: 'pointer'
                        }}>Student looking for accommodation</FormLabel>
                      </FormItem>
                      <FormItem style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <FormControl>
                          <RadioGroupItem value="owner" />
                        </FormControl>
                        <FormLabel style={{
                          fontWeight: 'normal',
                          fontSize: '14px',
                          color: '#5f6368',
                          margin: 0,
                          cursor: 'pointer'
                        }}>Property owner/agent</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              style={{
                width: '100%',
                height: '44px',
                background: '#1a73e8',
                color: 'white',
                border: 'none',
                borderRadius: '22px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
