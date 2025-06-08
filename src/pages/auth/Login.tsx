import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Logo from '@/components/common/Logo';
import { toast } from "@/components/ui/use-toast";
import { Loader } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { useStandardizedErrorHandler } from '@/hooks/common/useStandardizedErrorHandler';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDemoUsers, setIsCreatingDemoUsers] = useState(false);
  const { handleError } = useStandardizedErrorHandler();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      ErrorHandler.log('Login form submitted', JSON.stringify(values));
      await signIn(values.email, values.password);
      
      toast({
        title: "Login successful",
        description: "You have been signed in",
      });
      // The redirection will be handled by the useEffect above when the user state updates
    } catch (error: unknown) {
      ErrorHandler.handle(error, 'Login submission error');
      handleError(error, 'Login submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createDemoUsers = async () => {
    setIsCreatingDemoUsers(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-demo-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_DEMO_API_KEY,
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Demo users created",
          description: "Demo accounts are ready to use",
        });
      } else {
        throw new Error(data.error || 'Failed to create demo users');
      }
    } catch (error: unknown) {
      ErrorHandler.handle(error, 'Login create demo users error');
      handleError(error, 'Login create demo users error');
    } finally {
      setIsCreatingDemoUsers(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          
          {/* Demo accounts section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  form.setValue('email', 'student@roomi.com');
                  form.setValue('password', 'password123');
                }}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Use Student Demo
              </button>
              
              <button
                type="button"
                onClick={() => {
                  form.setValue('email', 'owner@roomi.com');
                  form.setValue('password', 'password123');
                }}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Use Property Owner Demo
              </button>
              
              <button
                type="button"
                onClick={() => {
                  form.setValue('email', 'admin@roomi.com');
                  form.setValue('password', 'password123');
                }}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Use Admin Demo
              </button>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={createDemoUsers}
                disabled={isCreatingDemoUsers}
              >
                {isCreatingDemoUsers ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating demo users...
                  </>
                ) : (
                  "Create/Reset Demo Users"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
