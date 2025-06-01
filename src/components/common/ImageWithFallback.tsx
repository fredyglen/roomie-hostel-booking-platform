
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  onError?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder.svg',
  priority = false,
  onError
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
    if (onError) {
      onError();
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

export default ImageWithFallback;
