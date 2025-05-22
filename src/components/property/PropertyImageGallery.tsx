
import React from 'react';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import { toast } from 'sonner';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, title }) => {
  const handleImageError = () => {
    toast.error("Failed to load image", {
      id: "property-gallery-error",
      duration: 2000,
    });
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden h-64 bg-gray-100">
            <ImageWithFallback 
              src={image} 
              alt={`${title} - Image ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={handleImageError}
              fallbackSrc="/placeholder.svg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyImageGallery;
