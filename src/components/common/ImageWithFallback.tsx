
import React, { useState, useCallback } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  onError?: () => void;
  priority?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  onError,
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    console.warn(`Failed to load image: ${src}`);
    setImageError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  }, [src, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

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
        src={src}
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
