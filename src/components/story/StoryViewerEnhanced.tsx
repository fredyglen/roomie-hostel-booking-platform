
import React, { useCallback } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp } from 'lucide-react';
import { Story } from '@/types/property';

interface StoryViewerEnhancedProps {
  story: Story;
  isPaused: boolean;
  onPause: (paused: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPrevButton: boolean;
  showNextButton: boolean;
  onSwipeUp?: () => void;
  showDetails?: boolean;
  isMobile?: boolean;
}

const StoryViewerEnhanced: React.FC<StoryViewerEnhancedProps> = ({
  story,
  isPaused,
  onPause,
  onNext,
  onPrevious,
  showPrevButton,
  showNextButton,
  onSwipeUp,
  showDetails,
  isMobile = true
}) => {
  const handleTouchStart = useCallback(() => {
    onPause(true);
  }, [onPause]);

  const handleTouchEnd = useCallback(() => {
    if (!showDetails) {
      onPause(false);
    }
  }, [onPause, showDetails]);

  if (!story) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110"
        style={{ backgroundImage: `url(${story.url})` }}
      ></div>
      
      {/* Main content */}
      <div 
        className="w-full h-full touch-none relative z-10 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div className="story-content">
          {story.type === 'image' ? (
            <img
              src={story.url}
              alt="Story content"
              className={`${isMobile ? 'h-full w-full object-cover' : 'max-h-[85vh] max-w-full rounded-lg shadow-xl'}`}
            />
          ) : (
            <video
              src={story.url}
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
      {story.caption && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-10">
          <p className="text-white text-center bg-black/30 py-2 px-4 rounded-lg shadow-md">
            {story.caption}
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
