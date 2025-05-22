
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const verificationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  idNumber: z.string().min(1, "National ID number is required"),
  idType: z.enum(["national-id", "passport", "drivers-license"]),
  university: z.string().min(1, "University is required")
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface StudentVerificationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const StudentVerification: React.FC<StudentVerificationProps> = ({ onNext, onPrevious }) => {
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      studentId: '',
      idNumber: '',
      idType: 'national-id',
      university: 'University of Ghana'
    }
  });

  const onSubmit = (data: VerificationFormData) => {
    console.log("Verification data:", data);
    // Save verification data to context or storage
    toast.success("Verification information submitted", {
      description: "Your information will be reviewed shortly"
    });
    
    // In a production environment, we would submit this to an API
    // For now, just proceed to the next step
    onNext();
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">Student Verification</h2>
        <p className="text-gray-500 mt-1">Please provide your student information for verification</p>
      </div>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your student ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>National ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="idType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>ID Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="national-id" />
                      </FormControl>
                      <FormLabel className="font-normal">National ID</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="passport" />
                      </FormControl>
                      <FormLabel className="font-normal">Passport</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="drivers-license" />
                      </FormControl>
                      <FormLabel className="font-normal">Driver's License</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your university" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button type="submit">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default StudentVerification;
