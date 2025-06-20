// Property Detail Modal Component
// Mobile-first modal with 55% screen coverage from bottom
// Top 45% shows property cover photo, bottom 55% shows sliding card with details

import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Share2, MapPin, Star } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currency';
import PropertyDetailTabs from './PropertyDetailTabs';

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
  onViewStory?: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onBookNow,
  onViewStory
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'amenities' | 'location'>('description');
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [cardOffset, setCardOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef<number>(0);
  const lastTouchY = useRef<number>(0);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      // Trigger animation after mount
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      document.body.style.overflow = 'unset';
      setCardOffset(0);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Enhanced touch gestures for card sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setIsDragging(true);
    lastTouchTime.current = Date.now();
    lastTouchY.current = touch.clientY;

    // Prevent scrolling on the background
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY || !isDragging) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const diff = currentY - touchStartY;
    const currentTime = Date.now();

    // Calculate velocity for momentum
    const timeDiff = currentTime - lastTouchTime.current;
    const yDiff = currentY - lastTouchY.current;
    if (timeDiff > 0) {
      setDragVelocity(yDiff / timeDiff);
    }

    lastTouchTime.current = currentTime;
    lastTouchY.current = currentY;

    // Only allow downward sliding (positive diff) with resistance
    if (diff > 0) {
      // Add resistance as user drags further
      const resistance = Math.max(0.3, 1 - (diff / 300));
      setCardOffset(Math.min(diff * resistance, 250));
    } else {
      // Allow slight upward movement for better UX
      setCardOffset(Math.max(diff * 0.1, -20));
    }

    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Determine if should close based on offset and velocity
    const shouldClose = cardOffset > 80 || (cardOffset > 40 && dragVelocity > 0.5);

    if (shouldClose) {
      // Animate close
      setCardOffset(window.innerHeight);
      setTimeout(() => onClose(), 200);
    } else {
      // Snap back to original position
      setCardOffset(0);
    }

    setTouchStartY(0);
    setDragVelocity(0);
  };

  // Get primary image
  const primaryImage = property.images?.[0] || '/placeholder-property.jpg';

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

  const getAmenitiesArray = (): string[] => {
    if (!property.amenities) return [];
    return property.amenities.map(amenity => 
      typeof amenity === 'string' ? amenity : amenity.name || 'Unknown amenity'
    );
  };

  const getDistanceText = (): string => {
    if (property.distanceToCampus) return property.distanceToCampus;
    if (property.distance_to_campus) return property.distance_to_campus;
    return '';
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md overflow-hidden"
      onClick={(e) => e.target === modalRef.current && onClose()}
      style={{ touchAction: 'none' }}
    >
      {/* Property Cover Photo - Top 45% */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] overflow-hidden select-none">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        {/* Header controls */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200"
          >
            <X size={22} className="text-gray-900" />
          </button>

          <div className="flex gap-3">
            <button className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200">
              <Heart size={20} className="text-gray-900" />
            </button>
            <button className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-200">
              <Share2 size={20} className="text-gray-900" />
            </button>
          </div>
        </div>

        {/* Property basic info overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-white/95 text-gray-900 font-medium px-3 py-1">
              {property.propertyType || 'Hostel'}
            </Badge>
            {property.genderRestriction && (
              <Badge variant="outline" className="bg-white/95 text-gray-900 border-white/70 font-medium px-3 py-1">
                {property.genderRestriction}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-2xl">
            {property.title}
          </h1>

          <div className="flex items-center gap-4 text-white/95">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="drop-shadow-lg" />
              <span className="text-base font-medium drop-shadow-lg">{getLocationText()}</span>
            </div>
            {getDistanceText() && (
              <span className="text-base font-medium drop-shadow-lg">{getDistanceText()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sliding Card - Bottom 55% */}
      <div
        ref={cardRef}
        className={`absolute bottom-0 left-0 right-0 h-[55vh] bg-white rounded-t-[24px] shadow-2xl transform ${
          isAnimating ? 'translate-y-full transition-transform duration-300 ease-out' :
          isDragging ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          transform: `translateY(${cardOffset}px)`,
          transition: isDragging ? 'none' : undefined,
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-4 pb-3">
          <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 h-full overflow-hidden flex flex-col">
          {/* Price and rating header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-3xl font-bold text-primary">
                ¢{property.rent?.toLocaleString() || '0'}
              </div>
              <div className="text-base text-gray-600 font-medium">per semester</div>
            </div>

            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
              <Star size={18} className="text-yellow-500 fill-current" />
              <span className="font-bold text-gray-900">{property.rating || '4.5'}</span>
              <span className="text-gray-600 text-sm font-medium">(24 reviews)</span>
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 flex flex-col min-h-0">
            <PropertyDetailTabs
              property={property}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Sticky bottom actions */}
          <div className="border-t pt-4 mt-4">
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

export default PropertyDetailModal;
