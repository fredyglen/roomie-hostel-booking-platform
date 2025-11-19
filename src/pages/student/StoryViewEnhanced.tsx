
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Icon } from '@iconify/react';
import StoryViewerEnhanced from '@/components/story/StoryViewerEnhanced';
import StoryDetailsSheetEnhanced from '@/components/story/StoryDetailsSheetEnhanced';
import { useStoryViewModel } from '@/components/story/StoryViewModel';
import { getOptimizedPropertyImageUrl } from '@/utils/imageOptimization';
import { useMobile } from '@/hooks/use-mobile';
import { Property } from '@/lib/supabase';

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
  const location = useLocation();
  const navigate = useNavigate();



  // Custom close handler to respect navigation history
  const customHandleClose = () => {
    // Check if we have a stored previous path
    const previousPath = location.state?.from || `/student/property/${property?.id || ''}`;
    navigate(previousPath);
  };

  // Lock scroll and reduce pull-to-refresh while story viewer is open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;

    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Pause/resume when details sheet opens/closes
  useEffect(() => {
    setIsPaused(showDetails);
  }, [showDetails, setIsPaused]);

  // Preload next image (optimized) for smoother swipes without overloading bandwidth
  useEffect(() => {
    const preloadIndex = (idx: number) => {
      if (idx >= 0 && idx < stories.length) {
        const s = stories[idx];
        if (s?.type === 'image' && s.url) {
          const optimized = getOptimizedPropertyImageUrl(s.url, {
            width: 1080,
            height: 1920,
            quality: 85,
            resize: 'contain',
          });
          const img = new Image();
          img.src = optimized;
        }
      }
    };
    preloadIndex(activeIndex + 1);
  }, [activeIndex, stories]);

  // Swipe-down-to-close disabled per user request


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

  // Ensure property has all required fields with defaults
  const propertyWithDefaults: Property = {
    ...property,
    owner_id: property.owner_id || '', // Add default empty string for owner_id
    description: property.description || '' // Add default empty string for description
  };

  return (
    <div className="fixed inset-0 bg-black" style={{ overscrollBehavior: 'none', touchAction: 'none' }}>
      {/* Close button */}
      <button
        onClick={customHandleClose}
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
        property={propertyWithDefaults}
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
            property={propertyWithDefaults}
            onClose={handleSwipeDown}
            onBookNow={() => {
              handleSwipeDown();
              setTimeout(() => {
                navigate(`/student/book/${property.id}`, {
                  state: { from: `/student/property/${property.id}` }
                });
              }, 300);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StoryViewEnhanced;
