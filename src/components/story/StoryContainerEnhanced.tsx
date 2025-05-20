
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
    propertyId,
    stories,
    currentIndex,
    progress,
    isPaused,
    showDetails,
    propertyDetails,
    setIsPaused,
    goToNextStory,
    goToPreviousStory,
    resetProgress,
    toggleDetails
  } = useStoryViewModel();

  const isMobile = useMobile();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  const handleClose = () => {
    navigate(`/student/property/${propertyId}`);
  };
  
  const handleBookNow = () => {
    navigate(`/student/property/${propertyId}/book`);
  };
  
  // Handle navigation to home page
  const handleHomeClick = () => {
    navigate('/');
  };

  if (!isMounted || stories.length === 0) {
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
        <StoryHeader onClose={handleClose} />
        <div className="px-4 flex gap-1">
          {stories.map((_, index) => (
            <StoryProgressBar
              key={index}
              isActive={index === currentIndex}
              progress={index === currentIndex ? progress : index < currentIndex ? 100 : 0}
            />
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <StoryViewerEnhanced
        story={stories[currentIndex]}
        isPaused={isPaused}
        onPause={setIsPaused}
        onNext={goToNextStory}
        onPrevious={goToPreviousStory}
        showPrevButton={currentIndex > 0}
        showNextButton={currentIndex < stories.length - 1}
        onSwipeUp={toggleDetails}
        showDetails={showDetails}
        isMobile={isMobile}
      />
      
      {/* Property details sheet */}
      <StoryDetailsSheetEnhanced
        showDetails={showDetails}
        propertyDetails={propertyDetails}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default StoryContainerEnhanced;
