
import React from 'react';
import { ArrowLeft, ArrowRight, ChevronUp } from 'lucide-react';
import { Story } from '@/types/property';

interface StoryMediaViewerProps {
  story: Story;
  isPaused: boolean;
  onPause: (paused: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPrevButton: boolean;
  showNextButton: boolean;
  onSwipeUp: () => void;
  showDetails: boolean;
}

const StoryMediaViewer: React.FC<StoryMediaViewerProps> = ({
  story,
  isPaused,
  onPause,
  onNext,
  onPrevious,
  showPrevButton,
  showNextButton,
  onSwipeUp,
  showDetails,
}) => {
  return (
    <div 
      className="flex-grow relative"
      onTouchStart={() => onPause(true)}
      onTouchEnd={() => !showDetails && onPause(false)}
      onMouseDown={() => onPause(true)}
      onMouseUp={() => !showDetails && onPause(false)}
    >
      {story.type === 'image' ? (
        <img
          src={story.url}
          alt="Story content"
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          src={story.url}
          autoPlay
          playsInline
          muted={isPaused}
          className="h-full w-full object-cover"
          onEnded={onNext}
        />
      )}
      
      {/* Caption */}
      {story.caption && (
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <p className="text-white text-center bg-black/30 py-2 px-4 rounded-lg">
            {story.caption}
          </p>
        </div>
      )}
      
      {/* Navigation Controls */}
      <div className="absolute inset-0 flex z-10">
        <button 
          className="w-1/4 h-full focus:outline-none"
          onClick={onPrevious}
          aria-label="Previous"
        />
        <div className="w-1/2 h-full" onClick={() => onPause(!isPaused)} />
        <button 
          className="w-1/4 h-full focus:outline-none"
          onClick={onNext}
          aria-label="Next"
        />
      </div>
      
      {/* Navigation Buttons (Visual) */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        {showPrevButton && (
          <button 
            className="text-white bg-black/30 rounded-full p-2"
            onClick={onPrevious}
            aria-label="Previous"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        {showNextButton && (
          <button 
            className="text-white bg-black/30 rounded-full p-2"
            onClick={onNext}
            aria-label="Next"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Swipe Up Indicator */}
      {!showDetails && (
        <div 
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer"
          onClick={onSwipeUp}
        >
          <p className="text-white text-sm font-medium mb-1">Swipe up for details</p>
          <ChevronUp className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default StoryMediaViewer;
