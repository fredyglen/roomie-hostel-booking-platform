
import React from 'react';

interface BookingStepsEnhancedProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const BookingStepsEnhanced: React.FC<BookingStepsEnhancedProps> = ({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, step) => (
          <div key={step} className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                step === currentStep - 1 ? 'bg-roomi-blue text-white' : 
                step < currentStep - 1 ? 'bg-roomi-teal text-white' : 
                'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep - 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step + 1
              )}
            </div>
            <span className={`text-xs mt-1 ${step === currentStep - 1 ? 'text-roomi-blue font-medium' : ''}`}>
              {stepLabels[step]}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 h-1 bg-roomi-blue transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BookingStepsEnhanced;
