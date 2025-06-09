
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';
import { Property, Story } from '@/types/property';

export const useStoryViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: property, isLoading, error } = usePropertyLoader({ 
    propertyId: id || '', 
    enabled: !!id 
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate stories from property images
  const stories: Story[] = property?.images ? property.images.map((image, index) => ({
    id: `story-${index}`,
    type: 'image' as const,
    url: image,
    duration: 5000
  })) : [];

  const currentStory = stories[activeIndex];

  const handleNext = useCallback(() => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
      setProgress(0);
    } else {
      // End of stories, close viewer
      handleClose();
    }
  }, [activeIndex, stories.length]);

  const handlePrevious = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setProgress(0);
    }
  }, [activeIndex]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSwipeUp = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleSwipeDown = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Progress calculation
  const progressPercentage = (progress / (currentStory?.duration || 5000)) * 100;

  // Auto-advance timer
  useEffect(() => {
    if (!isPaused && currentStory) {
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 100;
          if (newProgress >= currentStory.duration) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isPaused, currentStory, handleNext]);

  return {
    property,
    isLoading,
    error,
    stories,
    currentStory,
    currentStoryIndex: activeIndex,
    activeIndex,
    isPlaying: !isPaused,
    isPaused,
    progress,
    progressPercentage,
    showDetails,
    handleNext,
    handlePrevious,
    handleClose,
    handleSwipeUp,
    handleSwipeDown,
    setIsPaused
  };
};
