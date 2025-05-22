
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface VerificationStep {
  title: string;
  description: string;
  status: VerificationStatus;
}

interface StudentVerificationStatusProps {
  steps: VerificationStep[];
}

const StudentVerificationStatus: React.FC<StudentVerificationStatusProps> = ({ steps }) => {
  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
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
  
  return (
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
  );
};

export default StudentVerificationStatus;
