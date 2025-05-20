
import React from 'react';

interface StoryProgressBarProps {
  storiesCount: number;
  activeIndex: number;
  progressPercentage: number;
}

const StoryProgressBar: React.FC<StoryProgressBarProps> = ({ 
  storiesCount, 
  activeIndex, 
  progressPercentage 
}) => {
  // This component renders a single progress bar
  // The parent component should render multiple of these for each story
  return (
    <div className="h-1 bg-white/30 rounded-full flex-grow overflow-hidden">
      <div 
        className="h-full bg-white" 
        style={{ 
          width: `${progressPercentage}%`,
          transition: 'width 0.1s linear'
        }} 
      />
    </div>
  );
};

export default StoryProgressBar;
