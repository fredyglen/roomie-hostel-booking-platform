
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface VerificationStep {
  title: string;
  description: string;
  status: VerificationStatus;
}

interface StudentVerificationStepsProps {
  onNext: () => void;
}

const StudentVerificationSteps: React.FC<StudentVerificationStepsProps> = ({ onNext }) => {
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      title: 'Student ID Verification',
      description: 'We\'ll verify your student ID with your university.',
      status: 'pending'
    },
    {
      title: 'National ID Verification',
      description: 'We\'ll verify your national ID for security purposes.',
      status: 'pending'
    },
    {
      title: 'University Enrollment',
      description: 'We\'ll confirm your enrollment status with your university.',
      status: 'pending'
    }
  ]);
  
  // In a real application, this would be updated from an API
  const updateStepStatus = (index: number, status: VerificationStatus) => {
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[index] = { ...newSteps[index], status };
      return newSteps;
    });
  };
  
  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-blue-500" />;
    }
  };
  
  const getStatusText = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };
  
  const isAllVerified = steps.every(step => step.status === 'verified');
  
  // Simulate a verification process (for demo purposes)
  const simulateVerification = () => {
    setTimeout(() => updateStepStatus(0, 'verified'), 1500);
    setTimeout(() => updateStepStatus(1, 'verified'), 3000);
    setTimeout(() => updateStepStatus(2, 'verified'), 4500);
  };
  
  return (
    <div className="space-y-6 py-4">
      <div>
        <h2 className="text-2xl font-bold">Verification Status</h2>
        <p className="text-gray-500 mt-1">Track the status of your verification</p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={index} className={`shadow-sm border ${
            step.status === 'verified' ? 'border-green-200 bg-green-50' : 
            step.status === 'rejected' ? 'border-red-200 bg-red-50' : 
            'border-blue-200 bg-blue-50'
          }`}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              <div className="flex items-center">
                <span className={`text-sm mr-2 ${
                  step.status === 'verified' ? 'text-green-600' : 
                  step.status === 'rejected' ? 'text-red-600' : 
                  'text-blue-600'
                }`}>
                  {getStatusText(step.status)}
                </span>
                {getStatusIcon(step.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={simulateVerification}
        >
          Refresh Status
        </Button>
        <Button 
          type="button" 
          disabled={!isAllVerified}
          onClick={onNext}
        >
          {isAllVerified ? 'Continue' : 'Waiting for Verification'}
        </Button>
      </div>
    </div>
  );
};

export default StudentVerificationSteps;
