
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useMobile } from '@/hooks/use-mobile';
import { usePropertyLoader } from '@/hooks/property';
import { toast } from 'sonner';
import PropertyImageGallery from '../property/PropertyImageGallery';
import { Dialog, DialogContent } from '../ui/dialog';

const EnhancedStoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  
  // Story state
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Property data
  const { data: property, isLoading, error } = usePropertyLoader({
    propertyId: id || '',
    forOwner: false,
    enabled: !!id
  });
  
  // Get stories from property
  const stories = property?.images || [];
  const currentStory = stories[activeIndex];
  
  // Handle story timer
  useEffect(() => {
    if (!stories.length || isPaused || showDetails) return;
    
    const storyDuration = 5000; // 5 seconds per story
    const interval = 50; // Update progress every 50ms
    const incrementPerInterval = (interval / storyDuration) * 100;
    
    let progress = 0;
    const timer = setInterval(() => {
      progress += incrementPerInterval;
      setProgressPercentage(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(timer);
        handleNext();
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, showDetails, stories.length]);
  
  useEffect(() => {
    if (error) {
      toast.error("Failed to load property");
      handleClose();
    }
  }, [error]);
  
  // Handle navigation
  const handleNext = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
      setProgressPercentage(0);
    } else {
      handleClose();
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setProgressPercentage(0);
    }
  };
  
  const handleClose = () => {
    navigate(-1);
  };
  
  const handleSwipeUp = () => {
    setShowDetails(true);
    setIsPaused(true);
  };
  
  const handleSwipeDown = () => {
    setShowDetails(false);
    setIsPaused(false);
  };
  
  const handleBookNow = () => {
    navigate(`/student/property/${id}/book`);
  };
  
  if (isLoading || !property) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-700"></div>
          <div className="w-48 h-6 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black">
      {/* Story progress indicators */}
      <div className="absolute top-4 left-4 right-16 z-30 flex gap-1">
        {stories.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: idx === activeIndex ? `${progressPercentage}%` : idx < activeIndex ? '100%' : '0%',
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
      
      {/* Story content */}
      <div className="relative h-full w-full flex flex-col justify-between">
        {/* Main image */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setIsPaused(!isPaused)}
        >
          <img 
            src={currentStory} 
            alt={`Story ${activeIndex + 1}`} 
            className="h-full w-full object-contain"
            onError={() => toast.error("Failed to load image")}
          />
          
          {/* Overlay for pause/play indicator */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Icon icon="solar:play-circle-bold" className="text-white w-16 h-16" />
            </div>
          )}
        </div>
        
        {/* Navigation controls */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20" onClick={handlePrevious}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-20" onClick={handleNext}></div>
        
        {/* Property info */}
        <div className="absolute bottom-16 left-0 right-0 p-4 z-20 flex justify-between items-end">
          <div className="text-white">
            <h3 className="text-lg font-bold">{property.name}</h3>
            <p className="text-sm opacity-90">{property.location}</p>
            <p className="text-xs opacity-75">
              {property.distanceToCampus || '10 min walk to campus'}
            </p>
          </div>
          
          <div className="text-white text-right">
            <p className="text-lg font-bold">₵{property.price?.toLocaleString()}</p>
            <p className="text-xs opacity-75">per {property.priceUnit || 'semester'}</p>
          </div>
        </div>
        
        {/* Swipe up button */}
        <button 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center z-20"
          onClick={handleSwipeUp}
        >
          <Icon icon="solar:arrow-up-linear" className="h-5 w-5" />
          <span className="text-xs mt-1">Swipe up for details</span>
        </button>
      </div>
      
      {/* Use Dialog for desktop and Sheet for mobile */}
      {isMobile ? (
        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent
            side="bottom"
            className="h-[80vh] pt-10 px-0"
          >
            <div className="absolute top-2 left-0 right-0 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            <div className="h-full overflow-auto px-4">
              <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
              <p className="text-gray-600 mb-4">{property.location}</p>
              
              <div className="mb-6">
                <PropertyImageGallery 
                  images={property.images || []} 
                  title={property.name || 'Property'}
                />
              </div>
              
              <div className="prose max-w-none mb-6">
                <h3 className="text-xl font-semibold">Description</h3>
                <p>{property.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(property.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Icon icon="solar:check-circle-bold" className="text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="py-4">
                <Button 
                  className="w-full"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <div className="h-full overflow-auto px-4">
              <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
              <p className="text-gray-600 mb-4">{property.location}</p>
              
              <div className="mb-6">
                <PropertyImageGallery 
                  images={property.images || []} 
                  title={property.name || 'Property'}
                />
              </div>
              
              <div className="prose max-w-none mb-6">
                <h3 className="text-xl font-semibold">Description</h3>
                <p>{property.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(property.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Icon icon="solar:check-circle-bold" className="text-green-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="py-4">
                <Button 
                  className="w-full"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedStoryView;
