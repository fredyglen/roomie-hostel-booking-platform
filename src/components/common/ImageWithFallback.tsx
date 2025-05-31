
import React, { useState, useCallback } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ImageWithFallbackProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onError?: () => void;
  priority?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  onError,
  priority = false,
  retryCount = 1,
  retryDelay = 2000
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);

  const handleError = useCallback(() => {
    if (retries < retryCount) {
      logger.warn(`Failed to load image (attempt ${retries + 1}): ${src}. Retrying...`);
      setRetries(prev => prev + 1);
      
      // Try again after a delay
      setTimeout(() => {
        const imgElement = document.createElement('img');
        imgElement.src = src + `?retry=${retries + 1}`;
        imgElement.onload = () => {
          setImageError(false);
          setIsLoading(false);
        };
        imgElement.onerror = () => {
          setImageError(true);
          setIsLoading(false);
          if (onError) {
            onError();
          }
        };
      }, retryDelay);
    } else {
      logger.error(`Failed to load image after ${retryCount} retries: ${src}`);
      setImageError(true);
      setIsLoading(false);
      if (onError) {
        onError();
      }
    }
  }, [src, retries, retryCount, retryDelay, onError]);

  const handleLoad = useCallback(() => {
    logger.debug(`Image loaded successfully: ${src}`);
    setIsLoading(false);
  }, [src]);

  // Show fallback if no src provided or error occurred
  if (!src || imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${fallbackClassName || className}`}>
        <div className="text-center p-4">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}>
          <div className="animate-pulse">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
        </div>
      )}
      <img
        src={src + (retries > 0 ? `?retry=${retries}` : '')}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;
