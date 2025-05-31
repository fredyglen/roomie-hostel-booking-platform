
import React, { useState } from 'react';
import { Property, Story } from '@/types/property';
import StoryViewerEnhanced from './StoryViewerEnhanced';
import { logger } from '@/utils/logger';

interface EnhancedStoryViewProps {
  property: Property;
}

const EnhancedStoryView: React.FC<EnhancedStoryViewProps> = ({ property }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Convert images to stories if no stories are defined
  const stories = property.stories || property.images?.map(image => ({
    type: 'image' as const,
    url: image,
    duration: 5000
  })) || [];

  const currentStory = stories[currentStoryIndex];
  
  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      logger.debug('Moving to next story', { currentIndex: currentStoryIndex, nextIndex: currentStoryIndex + 1 });
      setCurrentStoryIndex(prev => prev + 1);
      setProgressPercentage(0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      logger.debug('Moving to previous story', { currentIndex: currentStoryIndex, prevIndex: currentStoryIndex - 1 });
      setCurrentStoryIndex(prev => prev - 1);
      setProgressPercentage(0);
    }
  };
  
  const handlePause = () => {
    logger.debug('Toggling pause state', { currentPauseState: isPaused });
    setIsPaused(prev => !prev);
  };
  
  const handleSwipeUp = () => {
    logger.debug('Swiping up to show details');
    setShowDetails(true);
  };

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No stories available for this property</p>
      </div>
    );
  }

  // Determine if we should show previous/next buttons
  const showPrevButton = currentStoryIndex > 0;
  const showNextButton = currentStoryIndex < stories.length - 1;
  
  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="h-screen bg-black">
      <StoryViewerEnhanced
        story={currentStory}
        property={property}
        isPaused={isPaused}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showPrevButton={showPrevButton}
        showNextButton={showNextButton}
        onSwipeUp={handleSwipeUp}
        showDetails={showDetails}
        isMobile={isMobile}
        progressPercentage={progressPercentage}
      />
    </div>
  );
};

export default EnhancedStoryView;
