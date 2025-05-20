
import React, { useCallback } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp } from 'lucide-react';
import { Story } from '@/types/property';
import StoryProgressBar from './StoryProgressBar';

interface StoryViewerEnhancedProps {
  stories: Story[];
  activeStoryIndex: number;
  isPaused: boolean;
  progressPercentage: number;
  onPause: (paused: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSwipeUp?: () => void;
  showDetails?: boolean;
  isMobile?: boolean;
}

const StoryViewerEnhanced: React.FC<StoryViewerEnhancedProps> = ({
  stories,
  activeStoryIndex,
  progressPercentage,
  isPaused,
  onPause,
  onNext,
  onPrevious,
  onSwipeUp,
  showDetails,
  isMobile = true
}) => {
  const currentStory = stories[activeStoryIndex];
  const showPrevButton = activeStoryIndex > 0;
  const showNextButton = activeStoryIndex < stories.length - 1;
  
  const handleTouchStart = useCallback(() => {
    onPause(true);
  }, [onPause]);

  const handleTouchEnd = useCallback(() => {
    if (!showDetails) {
      onPause(false);
    }
  }, [onPause, showDetails]);

  if (!currentStory) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background blur effect */}
      <div className="story-backdrop" style={{ backgroundImage: `url(${currentStory.url})` }}></div>
      
      {/* Progress bars at top */}
      <div className="absolute top-2 left-0 right-0 z-10 px-4">
        <StoryProgressBar 
          storiesCount={stories.length} 
          activeIndex={activeStoryIndex} 
          progressPercentage={progressPercentage} 
        />
      </div>
      
      {/* Main content */}
      <div 
        className="w-full h-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div className="story-content">
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.url}
              alt="Story content"
              className={`${isMobile ? 'h-full w-full object-cover' : 'max-h-[85vh] max-w-full rounded-lg shadow-xl'}`}
            />
          ) : (
            <video
              src={currentStory.url}
              autoPlay
              playsInline
              muted={isPaused}
              className={`${isMobile ? 'h-full w-full object-cover' : 'max-h-[85vh] max-w-full rounded-lg shadow-xl'}`}
              onEnded={onNext}
            />
          )}
        </div>
      </div>
      
      {/* Caption */}
      {currentStory.caption && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-10">
          <p className="text-white text-center bg-black/30 py-2 px-4 rounded-lg shadow-md">
            {currentStory.caption}
          </p>
        </div>
      )}
      
      {/* Navigation Controls - invisible buttons covering left/center/right */}
      <div className="absolute inset-0 flex z-10">
        <button 
          className="w-1/3 h-full focus:outline-none"
          onClick={onPrevious}
          aria-label="Previous"
        />
        <div className="w-1/3 h-full" onClick={() => onPause(!isPaused)} />
        <button 
          className="w-1/3 h-full focus:outline-none"
          onClick={onNext}
          aria-label="Next"
        />
      </div>
      
      {/* Navigation Buttons (Visual indicators) */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        {showPrevButton && (
          <button 
            className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
            onClick={onPrevious}
            aria-label="Previous"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        {showNextButton && (
          <button 
            className="text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
            onClick={onNext}
            aria-label="Next"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Swipe Up Indicator */}
      {onSwipeUp && !showDetails && (
        <div 
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer z-20"
          onClick={onSwipeUp}
        >
          <p className="text-white text-sm font-medium mb-1 drop-shadow-md">Swipe up for details</p>
          <ChevronUp className="h-6 w-6 text-white drop-shadow-md" />
        </div>
      )}
    </div>
  );
};

export default StoryViewerEnhanced;
