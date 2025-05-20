
import React from 'react';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  onError?: () => void;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, title, onError }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.src = '/placeholder.svg';
    if (onError) onError();
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="rounded-lg overflow-hidden h-64 bg-gray-100">
            <img 
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
