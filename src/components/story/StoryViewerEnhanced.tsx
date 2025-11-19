
import React, { useCallback, useState } from 'react';
import { Icon } from '@iconify/react';
import { Story, Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StorySummaryCard from '@/components/story/StorySummaryCard';
import StoryOptimizedImage from '@/components/story/StoryOptimizedImage';


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
  onSwipeDown?: () => void;
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
  onSwipeDown,
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
    // Prevent browser pull-to-refresh and scrolling during gestures
    e.preventDefault();
    if (!touchStartY) return;

    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    // Swipe up to show details
    if (diff > 30 && onSwipeUp) {
      onSwipeUp();
      setTouchStartY(0);
      return;
    }
    // Swipe-down-to-close disabled per user request
  }, [touchStartY, onSwipeUp, onSwipeDown]);

  const handleTouchEnd = useCallback(() => {
    if (!showDetails) {
      onPause(false);
    }
    setTouchStartY(0);
  }, [onPause, showDetails]);

  const bgUrl = story.type === 'summary' ? ((property.images && property.images[0]) || '') : story.url;


  if (!story) return null;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ overscrollBehavior: 'none', touchAction: 'none' }}>

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
          {story.type === 'summary' ? (
            <StorySummaryCard property={property} />
          ) : story.type === 'image' ? (
            <StoryOptimizedImage
              src={story.url}
              alt="Story content"
              className={cn(
                "object-contain max-h-full max-w-full",
                isMobile && "h-full w-full object-cover"
              )}
              isMobile={isMobile}
            />
          ) : (
            <video
              src={story.url}
              autoPlay
              playsInline
              muted={isPaused}
              preload="auto"
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

      {/* Enhanced Swipe Up Indicator with Book Now Option */}
      {onSwipeUp && !showDetails && (
        <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center z-20">
          {/* Book Now Button - More Prominent */}
          <div className="mb-4 px-4">

          </div>

          {/* Swipe Up for Details */}
          <div
            className="flex flex-col items-center animate-bounce cursor-pointer"
            onClick={onSwipeUp}
          >
            <p className="text-white text-xs font-medium mb-1 drop-shadow-md">Swipe up for details</p>
            <Icon icon="solar:arrow-up-linear" className="h-5 w-5 text-white drop-shadow-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewerEnhanced;
