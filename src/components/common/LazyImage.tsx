/**
 * LazyImage component with intersection observer for performance optimization
 * Implements lazy loading, progressive enhancement, and error handling
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder,
  width,
  height,
  sizes,
  priority = false,
  onLoad,
  onError,
  // ROOMie requirement: always fall back to local placeholder asset, never external stock URLs
  fallbackSrc = '/placeholder.svg'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error with fallback
  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Generate responsive srcSet for better performance
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || hasError) return undefined;
    
    // For external URLs, return as-is
    if (baseSrc.startsWith('http')) {
      return undefined;
    }

    // Generate different sizes for responsive images
    const sizes = [400, 800, 1200];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  // Placeholder component
  const PlaceholderComponent = () => (
    <div 
      className={cn(
        "bg-gray-200 animate-pulse flex items-center justify-center",
        className
      )}
      style={{ width, height }}
    >
      {placeholder ? (
        <img 
          src={placeholder} 
          alt={alt}
          className="object-cover w-full h-full opacity-50"
        />
      ) : (
        <div className="text-gray-400 text-sm">Loading...</div>
      )}
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div 
      className={cn(
        "bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300",
        className
      )}
      style={{ width, height }}
    >
      <div className="text-center text-gray-500">
        <svg 
          className="w-8 h-8 mx-auto mb-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="text-xs">Image not available</p>
      </div>
    </div>
  );

  // Don't render image until it's in view (unless priority)
  if (!isInView) {
    return <PlaceholderComponent />;
  }

  // Show error state
  if (hasError && currentSrc === fallbackSrc) {
    return <ErrorComponent />;
  }

  return (
    <div className="relative">
      {/* Placeholder while loading */}
      {!isLoaded && <PlaceholderComponent />}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={generateSrcSet(currentSrc)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0 absolute inset-0",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
};

export default LazyImage;
