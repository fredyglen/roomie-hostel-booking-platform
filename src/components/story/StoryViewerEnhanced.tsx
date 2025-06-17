
import React, { useCallback, useState } from 'react';
import { Icon } from '@iconify/react';
import { Story, Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryViewerEnhancedProps {
  story: Story;
  property: Property;
  isPaused: boolean;
  onPause: (paused: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPrevButton: boolean;
  showNextButton: boolean;
  onSwipeUp?: () => void;
  showDetails?: boolean;
  isMobile?: boolean;
  progressPercentage: number;
}

const StoryViewerEnhanced: React.FC<StoryViewerEnhancedProps> = ({
  story,
  property,
  isPaused,
  onPause,
  onNext,
  onPrevious,
  showPrevButton,
  showNextButton,
  onSwipeUp,
  showDetails,
  isMobile = true,
  progressPercentage
}) => {
  const [touchStartY, setTouchStartY] = useState<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    onPause(true);
    setTouchStartY(e.touches[0].clientY);
  }, [onPause]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartY || !onSwipeUp) return;

    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    // If swiping up significantly, trigger swipe up
    if (diff > 50) {
      onSwipeUp();
      setTouchStartY(0); // Reset to prevent multiple triggers
    }
  }, [touchStartY, onSwipeUp]);

  const handleTouchEnd = useCallback(() => {
    if (!showDetails) {
      onPause(false);
    }
    setTouchStartY(0);
  }, [onPause, showDetails]);

  if (!story) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110"
        style={{ backgroundImage: `url(${story.url})` }}
      ></div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300 z-20">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Main content */}
      <div
        className="w-full h-full touch-none relative z-10 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => onPause(true)}
        onMouseUp={(e) => !showDetails && onPause(false)}
      >
        <div className="story-content">
          {story.type === 'image' ? (
            <img
              src={story.url}
              alt="Story content"
              className={cn(
                "object-contain max-h-full max-w-full",
                isMobile && "h-full w-full object-cover"
              )}
            />
          ) : (
            <video
              src={story.url}
              autoPlay
              playsInline
              muted={isPaused}
              className={cn(
                "object-contain max-h-full max-w-full",
                isMobile && "h-full w-full object-cover"
              )}
              onEnded={onNext}
            />
          )}
        </div>
      </div>
      
      {/* Property info overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-center text-white">
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
            <Icon icon="solar:arrow-left-linear" className="h-6 w-6" />
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
            <Icon icon="solar:arrow-right-linear" className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Swipe Up Indicator */}
      {onSwipeUp && !showDetails && (
        <div 
          className="absolute bottom-20 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer z-20"
          onClick={onSwipeUp}
        >
          <p className="text-white text-sm font-medium mb-1 drop-shadow-md">Swipe up for details</p>
          <Icon icon="solar:arrow-up-linear" className="h-6 w-6 text-white drop-shadow-md" />
        </div>
      )}
    </div>
  );
};

export default StoryViewerEnhanced;
