
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackAlt?: string;
}

/**
 * A component that renders an image with a fallback image when the main image fails to load
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "https://via.placeholder.com/800x450?text=No+Image+Available",
  fallbackAlt = "Image not available",
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [imgAlt, setImgAlt] = useState(alt);
  
  const handleError = () => {
    setImgSrc(fallbackSrc);
    setImgAlt(fallbackAlt);
  };

  return (
    <img
      src={imgSrc}
      alt={imgAlt}
      onError={handleError}
      className={cn(className)}
      {...props}
    />
  );
};

export default ImageWithFallback;
