/**
 * LazyPropertyCard component with intersection observer
 * Optimizes performance by only rendering property cards when they come into view
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyPropertyCardProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

const LazyPropertyCard: React.FC<LazyPropertyCardProps> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '100px',
  fallback
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenInView) {
            setIsInView(true);
            setHasBeenInView(true);
            // Once loaded, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, hasBeenInView]);

  const DefaultFallback = () => (
    <div className={cn("animate-pulse bg-white rounded-lg shadow-sm border", className)}>
      <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-12"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={cardRef} className={className}>
      {isInView ? children : (fallback || <DefaultFallback />)}
    </div>
  );
};

export default LazyPropertyCard;
