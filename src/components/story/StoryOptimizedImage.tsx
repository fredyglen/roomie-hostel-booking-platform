import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedPropertyImageUrl } from '@/utils/imageOptimization';

interface StoryOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  isMobile?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const StoryOptimizedImage: React.FC<StoryOptimizedImageProps> = ({
  src,
  alt,
  className,
  isMobile = true,
  onLoad,
  onError,
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Compute optimized URL once per src change
    const optimized = getOptimizedPropertyImageUrl(src, {
      width: 1080,
      height: 1920,
      quality: 85,
      resize: 'contain',
    });
    setResolvedSrc(optimized);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-black/40 text-white text-xs', className)}>
        <span>Unable to load story</span>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}

      <img
        src={resolvedSrc}
        alt={alt}
        className={cn(
          'object-contain max-h-full max-w-full',
          isMobile && 'h-full w-full object-cover'
        )}
        loading="eager"
        decoding="async"
        // This is the primary content, so we can safely give it high priority
        fetchPriority="high"
        draggable={false}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default StoryOptimizedImage;

