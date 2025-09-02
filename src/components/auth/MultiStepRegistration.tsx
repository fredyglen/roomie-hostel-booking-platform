// Multi-Step Registration Component with Document Verification
// Step 1: Basic Information, Step 2: Document Upload, Step 3: Verification Pending

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, Upload, Clock, Shield } from 'lucide-react';
import DocumentUpload, { DocumentFile } from './DocumentUpload';
import { useAuth } from '@/context/EnhancedAuthContext';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types/auth';
import { logger } from '@/utils/enhanced-logger';

// Form schema for basic information
const basicInfoSchema = z.object({
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

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

interface RegistrationData extends BasicInfoFormValues {
  documents: DocumentFile[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

const MultiStepRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({
    documents: [],
    verificationStatus: 'pending'
  });

  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "student",
    },
  });

  const steps = [
    { number: 1, title: "Basic Information", description: "Personal details and account setup" },
    { number: 2, title: "Document Upload", description: "Student verification documents" },
    { number: 3, title: "Verification", description: "Account activation pending" }
  ];

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  // Step 1: Handle basic information submission
  const handleBasicInfoSubmit = async (values: BasicInfoFormValues) => {
    setRegistrationData(prev => ({ ...prev, ...values }));
    setCurrentStep(2);
  };

  // Step 2: Handle document upload completion
  const handleDocumentUpload = async () => {
    if (registrationData.documents && registrationData.documents.length === 0) {
      toast({
        title: "Documents Required",
        description: "Please upload at least one verification document to continue",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create account with pending verification status
      await signUp(
        registrationData.email!,
        registrationData.password!,
        registrationData.role as UserRole,
        {
          firstName: registrationData.firstName!,
          lastName: registrationData.lastName!,
          phone: registrationData.phone,
          verificationStatus: 'pending',
          documentsUploaded: registrationData.documents?.length || 0
        }
      );

      // TODO: Upload documents to Supabase storage
      // This would be implemented with actual file upload logic

      logger.info('Registration with documents completed', {
        email: registrationData.email,
        documentsCount: registrationData.documents?.length
      });

      setCurrentStep(3);
      
      toast({
        title: "Registration Submitted!",
        description: "Your account is pending verification. You'll receive an email once approved.",
      });

    } catch (error) {
      logger.error('Registration submission failed', { error });
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentsChange = (documents: DocumentFile[]) => {
    setRegistrationData(prev => ({ ...prev, documents }));
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create Your Account
          </CardTitle>
          <p className="text-gray-600">
            Join ROOMi to find your perfect student accommodation
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle size={16} />
                    ) : (
                      step.number
                    )}
                  </div>
                  {step.number < steps.length && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="mt-2 text-center">
              <Badge variant="outline">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleBasicInfoSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
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
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@university.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+233 50 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="student" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Student looking for accommodation
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="owner" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Property owner/agent
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToLogin}
                  >
                    Already have an account?
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <DocumentUpload
                documents={registrationData.documents || []}
                onDocumentsChange={handleDocumentsChange}
                required={true}
                maxFiles={3}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
                <Button
                  onClick={handleDocumentUpload}
                  disabled={isSubmitting || !registrationData.documents?.length}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Complete Registration
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Verification Pending */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock size={32} className="text-orange-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Pending
                </h3>
                <p className="text-gray-600 mb-4">
                  Your account has been created successfully! We're reviewing your documents to verify your student status.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-800">What happens next?</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Our team will review your documents within 24-48 hours</li>
                    <li>• You'll receive an email notification once verified</li>
                    <li>• After verification, you can access all platform features</li>
                    <li>• You can sign in now with limited access</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={goToLogin}
                  className="flex items-center gap-2"
                >
                  Sign In to Your Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student/properties')}
                >
                  Browse Properties
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepRegistration;
