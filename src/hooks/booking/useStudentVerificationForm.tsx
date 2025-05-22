
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface StudentVerification {
  idType: string;
  studentId: string;
  university: string;
  program: string;
  idImage: File | null;
  verified: boolean;
  status?: VerificationStatus;
}

export const useStudentVerificationForm = (initialData?: Partial<StudentVerification>) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [studentVerification, setStudentVerification] = useState<StudentVerification>({
    idType: initialData?.idType || 'studentId',
    studentId: initialData?.studentId || '',
    university: initialData?.university || '',
    program: initialData?.program || '',
    idImage: initialData?.idImage || null,
    verified: initialData?.verified || false,
    status: initialData?.status || 'pending'
  });
  
  const handleVerificationChange = (name: string, value: string) => {
    setStudentVerification(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleIdUpload = (file: File) => {
    setStudentVerification(prev => ({
      ...prev,
      idImage: file
    }));
  };
  
  const handleVerifyStudent = async () => {
    if (!studentVerification.idImage || !studentVerification.studentId || 
        !studentVerification.university || !studentVerification.program) {
      toast({
        title: "Missing information",
        description: "Please fill all fields and upload an ID document.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call for verification
    try {
      // In a real implementation, this would be an API call to verify the student
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStudentVerification(prev => ({
        ...prev,
        verified: true,
        status: 'verified'
      }));
      
      toast({
        title: "Verification successful",
        description: "Your student status has been verified.",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Failed to verify your student status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    studentVerification,
    setStudentVerification,
    handleVerificationChange,
    handleIdUpload,
    handleVerifyStudent,
    loading
  };
};
