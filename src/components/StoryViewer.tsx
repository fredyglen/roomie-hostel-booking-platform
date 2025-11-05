
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '@/integrations/supabase/client';

interface StoryViewerProps {
  propertyId: string;
  onClose: () => void;
}

interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // in seconds
}

const StoryViewer: React.FC<StoryViewerProps> = ({ propertyId, onClose }) => {
  // Fetch property data to get real images
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Convert property images to story media format
  const storyMedia: StoryMedia[] = property?.images ? property.images.map((imageUrl: string, index: number) => ({
    id: `${propertyId}_${index}`,
    type: 'image' as const,
    url: imageUrl,
    duration: 5
  })) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Property details from real data
  const propertyDetails = property ? {
    id: propertyId,
    title: property.title || 'Property',
    type: property.property_type || property.type || 'Property',
    price: property.rent || property.base_price_per_semester || 0,
    priceUnit: 'semester',
    address: property.address || 'Address not available',
    distanceToCampus: property.distance_to_campus || 'Distance not specified',
    amenities: property.amenities || [],
    description: property.description || 'No description available',
    rating: 4.5, // TODO: Get from reviews
    reviewCount: 0 // TODO: Get from reviews
  } : {
    id: propertyId,
    title: 'Loading...',
    type: 'Property',
    price: 0,
    priceUnit: 'semester',
    address: 'Loading...',
    distanceToCampus: 'Loading...',
    amenities: [],
    description: 'Loading...',
    rating: 0,
    reviewCount: 0
  };

  useEffect(() => {
    if (isPaused || storyMedia.length === 0) return;

    const currentMedia = storyMedia[currentIndex];
    if (!currentMedia || !currentMedia.duration) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentMedia.duration * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          // Move to next story or close if at the end
          if (currentIndex < storyMedia.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
          } else {
            setTimeout(() => onClose(), 0);
          }
        }
        return newProgress < 100 ? newProgress : 0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, storyMedia, onClose]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < storyMedia.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return;

    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    // If swiping up, show details
    if (diff > 50) {
      setShowDetails(true);
    }
    // If swiping down, hide details
    else if (diff < -50) {
      setShowDetails(false);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setTouchStartY(0);
  };

  const handleBookNow = () => {
    navigate(`/student/property/${propertyId}/book`);
  };

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  const handleDetailsClick = () => {
    setShowDetails(!showDetails);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no images
  if (storyMedia.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <Icon icon="solar:gallery-linear" className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No Images Available</h3>
          <p className="text-gray-300 mb-4">This property doesn't have any images to display.</p>
          <button
            onClick={onClose}
            className="bg-white text-black px-6 py-2 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="story-viewer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-20 text-white bg-black/30 rounded-full p-1"
        onClick={onClose}
      >
        <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
      </button>
      
      {/* Progress bars */}
      <div className="absolute top-2 left-0 right-0 z-20 px-4 flex gap-1">
        {storyMedia.map((_, i) => (
          <div key={i} className="story-progress h-1 bg-white/30 rounded-full flex-1">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ 
                width: `${i === currentIndex ? progress : i < currentIndex ? 100 : 0}%`,
                transition: i === currentIndex ? 'width 0.1s linear' : 'none'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation overlay */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2 h-full" onClick={handlePrev}></div>
        <div className="w-1/2 h-full" onClick={handleNext}></div>
      </div>
      
      {/* Media content */}
      <div className="w-full h-full max-w-md relative">
        <img 
          src={storyMedia[currentIndex].url}
          alt="Story media"
          className="w-full h-full object-cover"
        />
        
        {/* Property brief info */}
        <div className="absolute bottom-24 left-0 right-0 px-4 text-white">
          <h2 className="text-xl font-bold">{propertyDetails.title}</h2>
          <p className="text-sm">₵{propertyDetails.price}/{propertyDetails.priceUnit} · {propertyDetails.distanceToCampus} to campus</p>
        </div>
        
        {/* Swipe up indicator */}
        <div 
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center cursor-pointer"
          onClick={handleDetailsClick}
        >
          <span className="text-white text-sm mb-1">Swipe up for details</span>
          <Icon 
            icon="solar:alt-arrow-up-linear" 
            className="h-6 w-6 text-white animate-bounce" 
          />
        </div>
      </div>
      
      {/* Property details sheet */}
      <div 
        ref={detailsRef}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transition-transform duration-300 transform ${
          showDetails ? 'translate-y-0' : 'translate-y-full'
        } z-30 max-h-[80vh] overflow-y-auto`}
      >
        <div className="w-16 h-1 bg-gray-300 rounded mx-auto my-3"></div>
        
        <div className="px-4 pb-8">
          <h2 className="text-xl font-bold mb-2">{propertyDetails.title}</h2>
          <p className="text-gray-500 mb-4">{propertyDetails.address}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-bold text-xl" style={{ color: '#0f68fd' }}>₵{propertyDetails.price}</span>
              <span className="text-gray-500">/{propertyDetails.priceUnit}</span>
            </div>
            {propertyDetails.rating ? (
              <div className="flex items-center">
                <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
                <span className="ml-1">{propertyDetails.rating.toFixed(1)} ({propertyDetails.reviewCount || 0} reviews)</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Icon icon="solar:star-bold" className="h-4 w-4 text-gray-400" />
                <span className="ml-1 text-gray-500">No reviews yet</span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {propertyDetails.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{propertyDetails.description}</p>
          </div>
          
          <button
            onClick={handleBookNow}
            style={{
              width: '100%',
              height: '48px',
              background: '#0f68fd',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
