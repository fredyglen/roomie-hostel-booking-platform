// Desktop Property Detail Component
// Premium bento-box layout with arranged media grids for desktop experience

import React, { useState } from 'react';
import { X, Heart, Share2, MapPin, Star, Play, Camera, ArrowLeft } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PropertyDetailTabs from './PropertyDetailTabs';

interface PropertyDetailDesktopProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  onViewStory?: () => void;
}

const PropertyDetailDesktop: React.FC<PropertyDetailDesktopProps> = ({
  property,
  isOpen,
  onClose,
  onBookNow,
  onViewStory
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'amenities' | 'location'>('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Helper functions for safe data access
  const getLocationText = (): string => {
    if (typeof property.location === 'string') {
      return property.location;
    }
    if (property.location && typeof property.location === 'object') {
      return `${property.location.address || ''}, ${property.location.city || ''}`.trim().replace(/^,\s*/, '');
    }
    return 'Location not specified';
  };

  const getDistanceText = (): string => {
    if (property.distanceToCampus) return property.distanceToCampus;
    if (property.distance_to_campus) return property.distance_to_campus;
    return '';
  };

  // Get all images (main + additional) with fallbacks
  const allImages = property.images && property.images.length > 0
    ? property.images
    : ['/placeholder-property.jpg'];

  // Ensure we have at least 8 images for the bento grid (fill with placeholders if needed)
  const gridImages = [...allImages];
  while (gridImages.length < 8) {
    gridImages.push('/placeholder-property.jpg');
  }

  const mainImage = gridImages[selectedImageIndex] || gridImages[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} />
              <span>{getLocationText()}</span>
              {getDistanceText() && (
                <>
                  <span>•</span>
                  <span>{getDistanceText()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <Heart size={18} className="text-gray-700" />
          </button>
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <Share2 size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 h-full flex">
        {/* Left Side - Media Bento Grid (60%) */}
        <div className="w-3/5 h-full bg-gray-50 p-6">
          <div className="h-full grid grid-cols-4 grid-rows-4 gap-4">
            {/* Main Image - Takes up 3x3 grid */}
            <div className="col-span-3 row-span-3 relative group overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Image overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-4 right-4 flex gap-2">
                  {onViewStory && (
                    <button
                      onClick={onViewStory}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <Play size={16} className="text-gray-800 ml-0.5" />
                    </button>
                  )}
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Camera size={16} className="text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {Math.max(allImages.length, 1)}
              </div>
            </div>

            {/* Thumbnail Grid - Right column */}
            <div className="col-span-1 row-span-3 flex flex-col gap-4">
              {gridImages.slice(1, 4).map((image, index) => (
                <button
                  key={index + 1}
                  onClick={() => setSelectedImageIndex(index + 1)}
                  className={`flex-1 relative overflow-hidden rounded-xl transition-all ${
                    selectedImageIndex === index + 1 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Bottom Row - Additional thumbnails */}
            <div className="col-span-4 row-span-1 flex gap-4">
              {gridImages.slice(4, 8).map((image, index) => (
                <button
                  key={index + 4}
                  onClick={() => setSelectedImageIndex(index + 4)}
                  className={`flex-1 relative overflow-hidden rounded-xl transition-all ${
                    selectedImageIndex === index + 4 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 5}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && allImages.length > 8 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-medium">+{allImages.length - 8}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Property Details (40%) */}
        <div className="w-2/5 h-full bg-white flex flex-col">
          {/* Property Info Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  ¢{property.rent?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-600">per semester</div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="font-medium">{property.rating || '4.5'}</span>
                </div>
                <div className="text-sm text-gray-500">(24 reviews)</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">
                {property.propertyType || 'Hostel'}
              </Badge>
              {property.genderRestriction && (
                <Badge variant="outline">
                  {property.genderRestriction}
                </Badge>
              )}
              <Badge variant="outline">
                {property.maxOccupants} max occupants
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">{property.bedrooms || 'N/A'}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{property.bathrooms || 'N/A'}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{property.maxOccupants || 'N/A'}</div>
                <div className="text-sm text-gray-600">Max Guests</div>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden">
            <PropertyDetailTabs
              property={property}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              {onViewStory && (
                <Button
                  variant="outline"
                  onClick={onViewStory}
                  className="flex-1"
                >
                  View Story
                </Button>
              )}
              <Button
                onClick={onBookNow}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailDesktop;
