import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  title: string;
  message: string;
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  title,
  message,
  onComplete,
  duration = 3000
}) => {
  const [animationState, setAnimationState] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');

  useEffect(() => {
    if (isVisible) {
      // Start animation sequence
      setAnimationState('entering');
      
      // Show for specified duration
      const showTimer = setTimeout(() => {
        setAnimationState('visible');
      }, 100);

      // Start exit animation
      const exitTimer = setTimeout(() => {
        setAnimationState('exiting');
      }, duration - 500);

      // Complete animation and call onComplete
      const completeTimer = setTimeout(() => {
        setAnimationState('hidden');
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, duration, onComplete]);

  if (!isVisible && animationState === 'hidden') {
    return null;
  }

  const getAnimationClasses = () => {
    switch (animationState) {
      case 'entering':
        return 'translate-y-8 opacity-0 scale-95';
      case 'visible':
        return 'translate-y-0 opacity-100 scale-100';
      case 'exiting':
        return 'translate-y-0 opacity-0 scale-105';
      default:
        return 'translate-y-8 opacity-0 scale-95';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div 
        className={`
          transform transition-all duration-500 ease-out
          ${getAnimationClasses()}
        `}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center">
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle 
                className={`
                  w-12 h-12 text-green-600 transition-all duration-700 ease-out
                  ${animationState === 'visible' ? 'scale-100 rotate-0' : 'scale-0 rotate-45'}
                `}
              />
            </div>
            
            {/* Ripple Effect */}
            <div 
              className={`
                absolute inset-0 w-20 h-20 mx-auto bg-green-200 rounded-full 
                transition-all duration-1000 ease-out
                ${animationState === 'visible' ? 'scale-150 opacity-0' : 'scale-100 opacity-30'}
              `}
            />
          </div>

          {/* Success Text */}
          <div className="space-y-3">
            <h3 
              className={`
                text-xl font-bold text-gray-900 transition-all duration-500 delay-200
                ${animationState === 'visible' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              {title}
            </h3>
            <p 
              className={`
                text-gray-600 text-sm leading-relaxed transition-all duration-500 delay-300
                ${animationState === 'visible' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              {message}
            </p>
          </div>

          {/* ROOMi Brand Accent */}
          <div 
            className={`
              mt-6 h-1 bg-gradient-to-r from-green-500 via-primary to-green-500 rounded-full
              transition-all duration-700 delay-400
              ${animationState === 'visible' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
