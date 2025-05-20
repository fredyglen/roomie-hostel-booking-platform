
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import StoryProgressBar from '@/components/story/StoryProgressBar';
import StoryHeader from '@/components/story/StoryHeader';
import StoryMediaViewer from '@/components/story/StoryMediaViewer';
import StoryDetailsSheet from '@/components/story/StoryDetailsSheet';
import { useStoryViewModel } from '@/components/story/StoryViewModel';
import { Property } from '@/types/property';

const StoryContainer: React.FC = () => {
  const navigate = useNavigate();
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
  
  if (!property || !currentStory) {
    return (
      <div className="story-viewer flex items-center justify-center h-screen bg-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/student/properties')}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  // Ensure property has all required fields
  const propertyWithDefaults: Property = {
    ...property,
    type: property.type || property.property_type || 'Hostel',
    stories: property.stories || []
  };

  return (
    <div className="story-viewer h-screen bg-black flex flex-col items-center">
      <div 
        className="relative h-full w-full max-w-md mx-auto flex flex-col"
        style={{
          transform: showDetails ? 'translateY(-30%)' : 'translateY(0)',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Progress Bars */}
        <StoryProgressBar 
          storiesCount={stories.length}
          activeIndex={activeIndex}
          progressPercentage={progressPercentage}
        />
        
        {/* Header */}
        <StoryHeader 
          title={propertyWithDefaults.title}
          distanceToCampus={propertyWithDefaults.distanceToCampus || ''}
          imageUrl={(stories[0] && stories[0].url) || ''}
          onClose={handleClose}
        />
        
        {/* Story Media */}
        <StoryMediaViewer 
          story={currentStory}
          isPaused={isPaused}
          onPause={setIsPaused}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showPrevButton={activeIndex > 0}
          showNextButton={activeIndex < stories.length - 1}
          onSwipeUp={handleSwipeUp}
          showDetails={showDetails}
        />
      </div>
      
      {/* Details Sheet */}
      {showDetails && (
        <StoryDetailsSheet 
          property={propertyWithDefaults}
          onSwipeDown={handleSwipeDown}
          onBookNow={() => navigate(`/student/property/${propertyWithDefaults.id}/book`)}
        />
      )}
    </div>
  );
};

export default StoryContainer;
