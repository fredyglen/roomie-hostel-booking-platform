import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  message?: string;
}

const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  message
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const renderSpinner = () => (
    <div className={cn(
      'loading-premium border-roomi-blue-600',
      sizeClasses[size],
      className
    )} />
  );

  const renderDots = () => (
    <div className="flex space-x-2">
      <div className={cn(
        'rounded-full bg-roomi-blue-600 animate-bounce',
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn(
        'rounded-full bg-roomi-blue-600 animate-bounce',
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn(
        'rounded-full bg-roomi-blue-600 animate-bounce',
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
      )} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const renderPulse = () => (
    <div className={cn(
      'rounded-full bg-roomi-blue-600 animate-pulse',
      sizeClasses[size],
      className
    )} />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderLoader()}
      {message && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default PremiumLoader;
