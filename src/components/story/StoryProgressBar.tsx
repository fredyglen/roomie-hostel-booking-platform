
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
  return (
    <div className="absolute top-4 left-0 right-0 z-20 px-4">
      <div className="flex space-x-1">
        {Array.from({ length: storiesCount }).map((_, index) => (
          <div 
            key={index} 
            className="h-1 bg-gray-600 rounded-full flex-grow overflow-hidden"
          >
            <div 
              className="h-full bg-white" 
              style={{ 
                width: index < activeIndex ? '100%' : 
                      index === activeIndex ? `${progressPercentage}%` : '0%',
                transition: index === activeIndex ? 'width 0.3s linear' : 'none'
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryProgressBar;
