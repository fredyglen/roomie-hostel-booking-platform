
import React, { useState } from 'react';
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
  onSwipeUp: () => void;
  showDetails: boolean;
  isMobile: boolean;
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
  isMobile
}) => {
  return (
    <div 
      className="flex-grow relative"
      onTouchStart={() => onPause(true)}
      onTouchEnd={() => !showDetails && onPause(false)}
      onMouseDown={() => onPause(true)}
      onMouseUp={() => !showDetails && onPause(false)}
    >
      {/* Background blur effect for desktop */}
      {!isMobile && (
        <div className="hidden md:block absolute inset-0">
          <img
            src={story.url}
            alt="Background"
            className="h-full w-full object-cover blur-md"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {/* Main Media Content */}
      <div className={`relative ${!isMobile && 'md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[90vh] md:max-w-md md:shadow-2xl md:rounded-lg md:overflow-hidden'}`}>
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
      </div>
      
      {/* Caption */}
      {story.caption && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-10">
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
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
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
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
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
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer z-20"
          onClick={onSwipeUp}
        >
          <p className="text-white text-sm font-medium mb-1">Swipe up for details</p>
          <ChevronUp className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default StoryViewerEnhanced;
