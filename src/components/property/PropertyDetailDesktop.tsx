// Desktop Property Detail Component
// Premium bento-box layout with arranged media grids for desktop experience

import React, { useState } from 'react';
import { X, Heart, Share2, MapPin, Star, Play, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PropertyDetailTabs from './PropertyDetailTabs';

// Property interface for detail components
interface PropertyDetailData {
  id: string | number;
  title: string;
  rent?: number;
  location?: string | { address?: string; city?: string };
  images?: string[];
  amenities?: string[] | Array<{ name: string }>;
  propertyType?: string;
  genderRestriction?: string;
  distanceToCampus?: string;
  distance_to_campus?: string;
  rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxOccupants?: number;
  description?: string;
}

interface PropertyDetailDesktopProps {
  property: PropertyDetailData;
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
    // 🎯 APPLE-GRADE SOLUTION: Proper Modal Container with Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 🎯 SOLUTION: Centered Modal Dialog with Proper Sizing */}
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header - Now Relative Instead of Absolute */}
        <div className="relative h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">{property.title}</h1>
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

        {/* Main Content - Subtract Header Height */}
        <div className="flex h-[calc(100%-4rem)]">
        {/* Left Side - Media Bento Grid (60% for better proportions) */}
        <div className="w-[60%] h-full bg-gray-50 p-6 lg:p-8">
          <div className="h-full grid grid-cols-4 grid-rows-3 gap-4">
            {/* Main Image - Takes up 3x2 grid */}
            <div className="col-span-3 row-span-2 relative group overflow-hidden rounded-2xl bg-white shadow-xl">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Image overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-6 right-6 flex gap-3">
                  {onViewStory && (
                    <button
                      onClick={onViewStory}
                      className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200"
                    >
                      <Play size={18} className="text-gray-900 ml-0.5" />
                    </button>
                  )}
                  <button className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200">
                    <Camera size={18} className="text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} / {Math.max(allImages.length, 1)}
              </div>
            </div>

            {/* Thumbnail Grid - Right column */}
            <div className="col-span-1 row-span-2 flex flex-col gap-4">
              {gridImages.slice(1, 3).map((image, index) => (
                <button
                  key={index + 1}
                  onClick={() => setSelectedImageIndex(index + 1)}
                  className={`flex-1 relative overflow-hidden rounded-xl transition-all duration-200 ${
                    selectedImageIndex === index + 1
                      ? 'ring-3 ring-primary shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
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
              {gridImages.slice(2, 6).map((image, index) => (
                <button
                  key={index + 2}
                  onClick={() => setSelectedImageIndex(index + 2)}
                  className={`flex-1 relative overflow-hidden rounded-xl transition-all duration-200 ${
                    selectedImageIndex === index + 2
                      ? 'ring-3 ring-primary shadow-xl scale-105'
                      : 'hover:shadow-lg hover:scale-102'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 3}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && allImages.length > 6 && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-lg">+{allImages.length - 6}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Property Details (40% for better proportions) */}
        <div className="w-[40%] h-full bg-white flex flex-col border-l border-gray-100">
          {/* Property Info Header */}
          <div className="p-6 lg:p-8 border-b border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  ¢{property.rent?.toLocaleString() || '0'}
                </div>
                <div className="text-base lg:text-lg text-gray-600 font-medium">per semester</div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2 bg-yellow-50 px-3 py-2 rounded-full">
                  <Star size={18} className="text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">{property.rating || '4.5'}</span>
                </div>
                <div className="text-sm text-gray-600 font-medium">(24 reviews)</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                {property.propertyType || 'Hostel'}
              </Badge>
              {property.genderRestriction && (
                <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                  {property.genderRestriction}
                </Badge>
              )}
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                {property.maxOccupants} max occupants
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 text-center">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Bedrooms</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Bathrooms</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">{property.maxOccupants || 'N/A'}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Max Guests</div>
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
          <div className="p-6 lg:p-8 border-t border-gray-100 bg-white">
            <div className="flex gap-4">
              {onViewStory && (
                <Button
                  variant="outline"
                  onClick={onViewStory}
                  className="flex-1 h-14 text-base font-medium border-2 hover:bg-gray-50"
                >
                  View Story
                </Button>
              )}
              <Button
                onClick={onBookNow}
                className="flex-1 h-14 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailDesktop;
