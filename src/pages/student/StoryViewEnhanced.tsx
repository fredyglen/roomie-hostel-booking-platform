
import React, { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import StoryViewerEnhanced from '@/components/story/StoryViewerEnhanced';
import StoryDetailsSheetEnhanced from '@/components/story/StoryDetailsSheetEnhanced';
import { useStoryViewModel } from '@/components/story/StoryViewModel';
import { useMobile } from '@/hooks/use-mobile';

const StoryViewEnhanced: React.FC = () => {
  const { 
    property,
    isLoading,
    currentStory, 
    activeIndex,
    stories,
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
  
  if (isLoading || !property || !currentStory) {
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
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-30 bg-black/40 text-white rounded-full p-2"
        aria-label="Close story"
      >
        <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
      </button>

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

      {/* Story viewer */}
      <StoryViewerEnhanced
        story={currentStory}
        property={property}
        isPaused={isPaused}
        onPause={setIsPaused}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showPrevButton={activeIndex > 0}
        showNextButton={activeIndex < stories.length - 1}
        onSwipeUp={handleSwipeUp}
        showDetails={showDetails}
        isMobile={isMobile}
        progressPercentage={progressPercentage}
      />

      {/* Bottom sheet for property details */}
      <Sheet open={showDetails} onOpenChange={() => handleSwipeDown()}>
        <SheetContent
          side="bottom"
          className="h-[80vh] pt-10 px-0"
        >
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          <StoryDetailsSheetEnhanced 
            property={property} 
            onClose={handleSwipeDown} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StoryViewEnhanced;
