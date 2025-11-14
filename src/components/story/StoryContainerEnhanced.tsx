
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import StoryHeader from '@/components/story/StoryHeader';
import StoryProgressBar from '@/components/story/StoryProgressBar';
import StoryViewerEnhanced from '@/components/story/StoryViewerEnhanced';
import StoryDetailsSheetEnhanced from '@/components/story/StoryDetailsSheetEnhanced';
import { useStoryViewModel } from '@/components/story/StoryViewModel';
import { useMobile } from '@/hooks/use-mobile';
import { Property } from '@/types/property';

const StoryContainerEnhanced: React.FC = () => {
  const {
    property,
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
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleBookNow = () => {
    if (property) {
      navigate(`/student/book/${property.id}`);
    }
  };

  // Swipe-down from viewer goes to property detail page
  const handleSwipeDownToDetail = () => {
    if (property) {
      navigate(`/student/property/${property.id}`);
    }
  };

  // Handle navigation to home page
  const handleHomeClick = () => {
    navigate('/');
  };

  if (!isMounted || !property || !currentStory) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  // Ensure property has all required fields
  const propertyWithDefaults: Property = {
    ...property,
    type: (property.type || property.property_type || 'hostel') as Property['type'],
    description: property.description || '', // Add default empty string for description
    stories: property.stories || [],
    owner_id: property.owner_id || '' // Ensure owner_id has a default value
  };

  // Preload next story image to reduce lag
  useEffect(() => {
    const next = stories[activeIndex + 1];
    if (next && (next as any).type === 'image' && (next as any).url) {
      const img = new Image();
      img.src = (next as any).url;
    }
  }, [activeIndex, stories]);

  // Lock scroll and disable pull-to-refresh while stories are open
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;

    html.style.overscrollBehavior = 'none';
    body.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';

    const el = containerRef.current;
    const prevent = (e: TouchEvent) => {
      e.preventDefault();
    };
    if (el) {
      el.addEventListener('touchmove', prevent, { passive: false });
    }

    return () => {
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.overflow = prevBodyOverflow;
      if (el) {
        el.removeEventListener('touchmove', prevent as any);
      }
    };
  }, []);


  const storiesCount = stories.length;

  // Safely convert distance to string
  const distanceToString = (): string => {
    const distance = propertyWithDefaults.distanceToCampus || propertyWithDefaults.distance_to_campus;
    if (distance === undefined || distance === null) return '';
    return String(distance);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col z-50" style={{ overscrollBehavior: 'none', touchAction: 'none' }}>
      {/* Home icon for navigation */}
      <button
        onClick={handleHomeClick}
        className="absolute top-4 right-20 z-50 text-white bg-black/30 rounded-full p-2"
        aria-label="Go to homepage"
      >
        <Home className="h-6 w-6" />
      </button>

      {/* Header with progress bars */}
      <div className="z-40 fixed top-0 left-0 right-0">
        <StoryHeader
          title={propertyWithDefaults.title || ''}
          distanceToCampus={distanceToString()}
          imageUrl={(propertyWithDefaults.stories && propertyWithDefaults.stories[0] && propertyWithDefaults.stories[0].url) || ''}
          onClose={handleClose}
        />
        <div className="px-4 flex gap-1">
          {stories.map((_, index) => (
            <StoryProgressBar
              key={index}
              storiesCount={storiesCount}
              activeIndex={activeIndex}
              progressPercentage={index === activeIndex ? progressPercentage : index < activeIndex ? 100 : 0}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <StoryViewerEnhanced
          story={currentStory}
          property={propertyWithDefaults}
          isPaused={isPaused}
          onPause={setIsPaused}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showPrevButton={activeIndex > 0}
          showNextButton={activeIndex < storiesCount - 1}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDownToDetail}
          showDetails={showDetails}
          isMobile={isMobile}
          progressPercentage={progressPercentage}
        />
      </div>

      {/* Property details sheet */}
      <StoryDetailsSheetEnhanced
        property={propertyWithDefaults}
        onClose={handleSwipeDown}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default StoryContainerEnhanced;
