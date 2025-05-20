
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import StoryProgressBar from '@/components/story/StoryProgressBar';
import StoryHeader from '@/components/story/StoryHeader';
import StoryMediaViewer from '@/components/story/StoryMediaViewer';
import StoryDetailsSheet from '@/components/story/StoryDetailsSheet';
import { useStoryViewModel } from '@/components/story/StoryViewModel';

const StoryContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    property,
    currentStory,
    activeIndex,
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
          storiesCount={property.stories.length}
          activeIndex={activeIndex}
          progressPercentage={progressPercentage}
        />
        
        {/* Header */}
        <StoryHeader 
          title={property.title}
          distanceToCampus={property.distanceToCampus}
          imageUrl={property.stories[0].url}
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
          showNextButton={activeIndex < property.stories.length - 1}
          onSwipeUp={handleSwipeUp}
          showDetails={showDetails}
        />
      </div>
      
      {/* Details Sheet */}
      {showDetails && (
        <StoryDetailsSheet 
          property={property}
          onSwipeDown={handleSwipeDown}
          onBookNow={() => navigate(`/student/property/${property.id}/book`)}
        />
      )}
    </div>
  );
};

export default StoryContainer;
