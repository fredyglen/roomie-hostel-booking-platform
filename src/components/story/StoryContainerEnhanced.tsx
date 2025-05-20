
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import StoryHeader from '@/components/story/StoryHeader';
import StoryProgressBar from '@/components/story/StoryProgressBar';
import StoryViewerEnhanced from '@/components/story/StoryViewerEnhanced';
import StoryDetailsSheetEnhanced from '@/components/story/StoryDetailsSheetEnhanced';
import { useStoryViewModel } from '@/components/story/StoryViewModel';
import { useMobile } from '@/hooks/use-mobile';

const StoryContainerEnhanced: React.FC = () => {
  const {
    property,
    currentStory,
    activeIndex,
    showDetails,
    isPaused,
    progressPercentage,
    handleNext,
    handlePrevious,
    handleClose,
    handleSwipeUp,
    handleSwipeDown,
    setIsPaused
  } = useStoryViewModel();

  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  const handleBookNow = () => {
    if (property) {
      navigate(`/student/property/${property.id}/book`);
    }
  };
  
  // Handle navigation to home page
  const handleHomeClick = () => {
    navigate('/');
  };

  if (!isMounted || !property || !currentStory) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Home icon for navigation */}
      <button
        onClick={handleHomeClick}
        className="absolute top-4 right-20 z-50 text-white bg-black/30 rounded-full p-2"
        aria-label="Go to homepage"
      >
        <Home className="h-6 w-6" />
      </button>

      {/* Header with progress bars */}
      <div className="z-40">
        <StoryHeader 
          title={property.title} 
          distanceToCampus={property.distanceToCampus} 
          imageUrl={property.stories[0].url} 
          onClose={handleClose} 
        />
        <div className="px-4 flex gap-1">
          {property.stories.map((_, index) => (
            <StoryProgressBar
              key={index}
              storiesCount={property.stories.length}
              activeIndex={activeIndex}
              progressPercentage={index === activeIndex ? progressPercentage : index < activeIndex ? 100 : 0}
            />
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <StoryViewerEnhanced
        story={currentStory}
        isPaused={isPaused}
        onPause={setIsPaused}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showPrevButton={activeIndex > 0}
        showNextButton={activeIndex < property.stories.length - 1}
        onSwipeUp={handleSwipeUp}
        showDetails={showDetails}
        isMobile={isMobile}
      />
      
      {/* Property details sheet */}
      <StoryDetailsSheetEnhanced
        showDetails={showDetails}
        propertyDetails={{
          id: property.id,
          title: property.title,
          type: property.type,
          price: property.price,
          priceUnit: property.priceUnit,
          address: property.address,
          distanceToCampus: property.distanceToCampus,
          amenities: property.amenities || [],
          description: property.description || '',
          rating: property.rating,
          reviewCount: property.reviewCount
        }}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default StoryContainerEnhanced;
