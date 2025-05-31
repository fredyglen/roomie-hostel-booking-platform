
import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800&h=450',
  fallbackAlt = 'Property image',
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!imageError && currentSrc !== fallbackSrc) {
      setImageError(true);
      setCurrentSrc(fallbackSrc);
    }
    
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={imageError ? fallbackAlt : alt}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;
