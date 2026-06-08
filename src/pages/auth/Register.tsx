import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ROOMiLogo } from '@/components/ui/SocialIcons';
import { toast } from "@/components/ui/use-toast";
import { ErrorHandler } from '@/utils/ErrorHandler';
import { Loader } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { logger } from '@/utils/enhanced-logger';
import SuccessAnimation from '@/components/ui/SuccessAnimation';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';

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
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState<{ name: string; role: string }>({ name: '', role: '' });

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

      // Set success data and show animation
      setSuccessData({
        name: `${values.firstName} ${values.lastName}`,
        role: values.role
      });
      setShowSuccessAnimation(true);

      // Clear the form
      form.reset();

      // Show success message
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${values.firstName}! Your ${values.role} account has been created.`,
      });

    } catch (error: unknown) {
      ErrorHandler.handle(error, "Registration submission error");

      // Better error messages
      let errorMessage = "Failed to create account";
      if (error instanceof Error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          errorMessage = "An account with this email already exists. Please try signing in instead.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else if (error.message.includes("email")) {
          errorMessage = "Please enter a valid email address.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success animation completion
  const handleSuccessComplete = () => {
    setShowSuccessAnimation(false);
    // Navigate to login page with a message
    navigate('/login', {
      state: {
        message: 'Account created successfully! Please sign in with your credentials.',
        email: successData.name ? form.getValues('email') : undefined
      }
    });
  };

  return (
    <>
      {/* Success Animation */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        title="Account Created Successfully!"
        message={`Welcome ${successData.name}! Your ${successData.role} account has been created. You can now sign in.`}
        onComplete={handleSuccessComplete}
        duration={3000}
      />
    <div className="min-h-screen flex bg-white">
      {/* Form Panel — 2/5 on desktop, full width on mobile */}
      <div className="w-full md:w-2/5 flex flex-col justify-center px-6 py-8 md:px-16 md:py-12">
        <div className="w-full max-w-sm mx-auto">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <ROOMiLogo size={28} />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
          Create your account
        </h2>

        <p className="mb-6 text-center text-xs text-gray-500">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            sign in to your existing account
          </Link>
        </p>

        <SimpleRegistrationForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        </div>
      </div>

      {/* Image Panel — 3/5 on desktop, hidden on mobile */}
      <div className="hidden md:flex w-3/5 items-center justify-center bg-primary text-white">
        <div className="flex flex-col items-center gap-4 px-10">
          <ROOMiLogo size={56} />
          <p className="text-center text-sm leading-relaxed text-white/90">
            Create a ROOMie account to save favourites, manage bookings,
            and stay updated on your campus housing.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
