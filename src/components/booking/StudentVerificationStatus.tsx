
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationStep {
  title: string;
  description: string;
  status: VerificationStatus;
}

interface StudentVerificationStatusProps {
  steps: VerificationStep[];
}

const StudentVerificationStatus: React.FC<StudentVerificationStatusProps> = ({ steps }) => {
  const getStatusConfig = (status: VerificationStatus): {
    icon: React.ReactNode;
    text: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  } => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          text: 'Verified',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-600'
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          text: 'Rejected',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-600'
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-blue-500" />,
          text: 'Pending',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-600'
        };
    }
  };
  
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const statusConfig = getStatusConfig(step.status);
        
        return (
          <Card 
            key={index} 
            className={`shadow-sm border ${statusConfig.borderColor} ${statusConfig.bgColor}`}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              <div className="flex items-center">
                <span className={`text-sm mr-2 ${statusConfig.textColor}`}>
                  {statusConfig.text}
                </span>
                {statusConfig.icon}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
};

export default StudentVerificationStatus;
