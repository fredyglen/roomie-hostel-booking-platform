
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { usePropertyLoader } from '@/hooks/property';
import { useMobile } from '@/hooks/use-mobile';
import { Property, Story } from '@/types/property';
import PropertyTabs from '@/components/property/PropertyTabs';
import ImageWithFallback from '@/components/common/ImageWithFallback';

const EnhancedStoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: property, isLoading, error } = usePropertyLoader({ 
    propertyId: id || '', 
    forOwner: false,
    enabled: !!id
  });
  
  // Generate stories from images if they don't exist
  const stories = property?.stories || 
    (property?.images?.map((image, index) => ({
      type: 'image' as 'image',
      url: image,
      duration: 5000,
      caption: `${property.title} - Image ${index + 1}`
    })) as Story[]) || [];
  
  const currentStory = stories[currentStoryIndex];
  
  // Effect to advance through stories automatically
  useEffect(() => {
    if (isLoading || isPaused || showDetails || !currentStory) return;
    
    const duration = currentStory.duration || 5000;
    const interval = 100; // Update progress every 100ms for smoother animation
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + interval;
        if (newProgress >= duration) {
          clearInterval(timer);
          // Move to next story or exit if at the end
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            // Exit story view when done
            setTimeout(() => navigate(`/student/property/${id}`), 100);
          }
        }
        return newProgress;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentStoryIndex, isPaused, showDetails, stories, currentStory, isLoading, id, navigate]);
  
  const handleNext = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      navigate(`/student/property/${id}`);
    }
  }, [currentStoryIndex, stories.length, id, navigate]);
  
  const handlePrevious = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  }, [currentStoryIndex]);
  
  const handleClose = useCallback(() => {
    navigate(`/student/property/${id}`);
  }, [id, navigate]);
  
  const handleSwipeUp = useCallback(() => {
    setShowDetails(true);
    setIsPaused(true);
  }, []);
  
  const handleSwipeDown = useCallback(() => {
    setShowDetails(false);
    setIsPaused(false);
  }, []);
  
  const handleBookNow = useCallback(() => {
    navigate(`/student/property/${id}/book`);
  }, [id, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-700"></div>
          <div className="w-48 h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !property) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <Button variant="default" onClick={() => navigate('/student/properties')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }
  
  // Progress percentage for visualization
  const progressPercentage = currentStory ? (progress / (currentStory.duration || 5000)) * 100 : 0;
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress indicators */}
      <div className="absolute top-4 left-4 right-16 z-30 flex gap-1">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: idx === currentStoryIndex ? `${progressPercentage}%` : idx < currentStoryIndex ? '100%' : '0%',
              }}
            ></div>
          </div>
        ))}
      </div>
      
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-30 bg-black/40 text-white rounded-full p-2"
        aria-label="Close story"
      >
        <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
      </button>
      
      {/* Main story content */}
      <div className="h-full w-full">
        {/* Background blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110"
          style={{ backgroundImage: `url(${currentStory?.url})` }}
        ></div>
        
        {/* Main media */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => !showDetails && setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => !showDetails && setIsPaused(false)}
        >
          {currentStory?.type === 'image' ? (
            <ImageWithFallback
              src={currentStory.url}
              alt="Story content"
              className={`${isMobile ? 'h-full w-full object-cover' : 'max-h-full max-w-full object-contain'}`}
              fallbackSrc="/placeholder.svg"
            />
          ) : (
            <video
              src={currentStory?.url}
              autoPlay
              playsInline
              muted={isPaused}
              className={`${isMobile ? 'h-full w-full object-cover' : 'max-h-full max-w-full object-contain'}`}
              onEnded={handleNext}
            />
          )}
          
          {/* Navigation controls - invisible buttons */}
          <div className="absolute inset-0 flex z-10">
            <div 
              className="w-1/3 h-full" 
              onClick={handlePrevious}
            />
            <div 
              className="w-1/3 h-full" 
              onClick={() => setIsPaused(!isPaused)}
            />
            <div 
              className="w-1/3 h-full" 
              onClick={handleNext}
            />
          </div>
        </div>
        
        {/* Property info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex justify-between items-end text-white">
            <div>
              <h3 className="font-bold text-lg">{property.title}</h3>
              <div className="flex items-center text-sm">
                <Icon icon="solar:map-point-linear" className="mr-1" width={16} height={16} />
                <span>{property.distanceToCampus || '10 min walk'} to campus</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">₵{(property.price || 0).toLocaleString()}</div>
              <div className="text-sm">/{property.priceUnit || 'semester'}</div>
            </div>
          </div>
        </div>
        
        {/* Swipe up indicator */}
        {!showDetails && (
          <div 
            className="absolute bottom-20 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer z-20"
            onClick={handleSwipeUp}
          >
            <p className="text-white text-sm font-medium mb-1 drop-shadow-md">Swipe up for details</p>
            <Icon icon="solar:arrow-up-linear" className="h-6 w-6 text-white drop-shadow-md" />
          </div>
        )}
      </div>
      
      {/* Property details drawer */}
      <Drawer open={showDetails} onOpenChange={setShowDetails}>
        <Drawer.Content className="h-[80vh]">
          <div className="p-4 h-full flex flex-col">
            <div className="flex-grow overflow-auto">
              <PropertyTabs
                description={property.description || ''}
                address={property.address}
                distanceToCampus={property.distanceToCampus || property.distance_to_campus || ''}
                houseRules={property.house_rules || []}
                amenities={property.amenities || []}
                type={property.type || property.property_type || ''}
                location={property.location || ''}
                availableUnits={property.availableUnits}
              />
            </div>
            
            {/* Book Now button */}
            <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-2xl font-bold text-blue-600">₵{(property.price || property.rent || 0).toLocaleString()}</span>
                  <span className="text-gray-600">/{property.priceUnit || property.price_unit || 'semester'}</span>
                </div>
                {property.rating && (
                  <div className="flex items-center">
                    <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm ml-1">{property.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({property.reviewCount || 0})</span>
                  </div>
                )}
              </div>
              <Button 
                variant="default" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default EnhancedStoryView;
