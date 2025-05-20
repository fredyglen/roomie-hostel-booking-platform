
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
  // Generate an array of indices from 0 to storiesCount - 1
  const indices = Array.from({ length: storiesCount }, (_, i) => i);

  return (
    <div className="flex gap-1 w-full">
      {indices.map((index) => (
        <div 
          key={index}
          className="h-1 bg-white/30 rounded-full flex-grow overflow-hidden"
        >
          <div 
            className="h-full bg-white" 
            style={{ 
              width: index < activeIndex ? '100%' : 
                     index === activeIndex ? `${progressPercentage}%` : '0%',
              transition: index === activeIndex ? 'width 0.1s linear' : 'none'
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgressBar;
