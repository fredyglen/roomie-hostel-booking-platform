import React from 'react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { IMAGE_URLS } from '@/constants/images';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  onError?: () => void;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, title, onError }) => {
  // Ensure we always have at least one image
  const validImages = images && images.length > 0 ? images : [IMAGE_URLS.DEFAULT];

  const handleImageError = () => {
    ErrorHandler.log('Image failed to load in PropertyImageGallery');
    if (onError) onError();
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {validImages.slice(0, 4).map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden h-48 bg-gray-100">
            <ImageWithFallback 
              src={image} 
              alt={`${title} - Image ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyImageGallery;
