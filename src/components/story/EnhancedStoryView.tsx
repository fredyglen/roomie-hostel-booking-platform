
import React from 'react';
import { Property } from '@/types/property';
import StoryViewerEnhanced from './StoryViewerEnhanced';

interface EnhancedStoryViewProps {
  property: Property;
}

const EnhancedStoryView: React.FC<EnhancedStoryViewProps> = ({ property }) => {
  const stories = property.stories || property.images?.map(image => ({
    type: 'image' as const,
    url: image,
    duration: 5000
  })) || [];

  const currentStory = stories[0];

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No stories available for this property</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black">
      <StoryViewerEnhanced
        story={currentStory}
        property={property}
        isPaused={false}
        onPause={() => {}}
        onNext={() => {}}
        onPrevious={() => {}}
        showPrevButton={false}
        showNextButton={stories.length > 1}
        onSwipeUp={() => {}}
        showDetails={false}
        isMobile={false}
        progressPercentage={0}
      />
    </div>
  );
};

export default EnhancedStoryView;
