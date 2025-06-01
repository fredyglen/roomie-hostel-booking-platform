
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const BookingSteps: React.FC<BookingStepsProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className={`
                mt-2 text-xs text-center
                ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}
              `}>
                {label}
              </span>
              
              {stepNumber < totalSteps && (
                <div className={`
                  w-16 h-0.5 mt-5 absolute
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} 
                style={{ 
                  left: `calc(${(stepNumber / totalSteps) * 100}% + 20px)`,
                  zIndex: -1
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingSteps;
