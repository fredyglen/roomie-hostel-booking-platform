import React, { useState, useEffect, memo } from 'react';
import { config } from '@/config';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setHasError(false);

    // Process image URL
    if (src.startsWith('http') || src.startsWith('data:')) {
      // External URL or data URL
      setImgSrc(src);
    } else if (src.startsWith('/')) {
      // Local path
      setImgSrc(src);
    } else if (config.app.imageCdnUrl) {
      // Use CDN if available
      const cdnUrl = config.app.imageCdnUrl.endsWith('/')
        ? config.app.imageCdnUrl
        : `${config.app.imageCdnUrl}/`;
      
      setImgSrc(`${cdnUrl}${src}`);
    } else {
      // Fallback to relative path
      setImgSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        isLoading && 'bg-gray-200 animate-pulse',
        className
      )}
      style={{ width, height }}
    >
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            {
              'object-contain': objectFit === 'contain',
              'object-cover': objectFit === 'cover',
              'object-fill': objectFit === 'fill',
              'object-none': objectFit === 'none',
              'object-scale-down': objectFit === 'scale-down',
            }
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
          {hasError ? 'Failed to load image' : ''}
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedImage);