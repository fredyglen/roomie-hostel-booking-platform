
import React, { useState, useEffect } from 'react';
import { Property, Story } from '@/types/property';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyData } from '@/hooks/property/usePropertyData';

const generateStoryId = () => `story_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const mockStories: Story[] = [
  {
    id: generateStoryId(),
    type: 'image',
    url: '/lovable-uploads/849fd73d-2b2f-42b6-9446-0aa9226cc8e7.png',
    caption: 'Beautiful hostel exterior',
    duration: 5000
  },
  {
    id: generateStoryId(),
    type: 'image', 
    url: '/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png',
    caption: 'Comfortable rooms',
    duration: 5000
  },
  {
    id: generateStoryId(),
    type: 'video',
    url: '/placeholder-video.mp4',
    caption: 'Take a virtual tour',
    duration: 15000
  }
];

export const useStoryViewModel = (property?: Property) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById } = usePropertyData();
  
  const [currentProperty, setCurrentProperty] = useState<Property | null>(property || null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Load property if not provided
  useEffect(() => {
    if (!property && id) {
      const loadProperty = async () => {
        try {
          const propertyData = await getPropertyById(id);
          setCurrentProperty(propertyData);
        } catch (error) {
          console.error('Failed to load property:', error);
        }
      };
      loadProperty();
    }
  }, [property, id, getPropertyById]);

  // Use property stories if available, otherwise use mock stories
  const stories = currentProperty?.stories && currentProperty.stories.length > 0 ? currentProperty.stories : mockStories;
  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isPlaying || !currentStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (currentStory.duration! / 100);
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          nextStory();
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStoryIndex, isPlaying, currentStory, isPaused]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStory = (index: number) => {
    setCurrentStoryIndex(index);
    setProgress(0);
  };

  const handleNext = () => nextStory();
  const handlePrevious = () => previousStory();
  const handleClose = () => navigate(-1);
  const handleSwipeUp = () => setShowDetails(true);
  const handleSwipeDown = () => setShowDetails(false);

  return {
    property: currentProperty,
    stories,
    currentStory,
    currentStoryIndex,
    activeIndex: currentStoryIndex,
    isPlaying,
    isPaused,
    progress,
    progressPercentage: progress,
    showDetails,
    nextStory,
    previousStory,
    togglePlayPause,
    goToStory,
    totalStories: stories.length,
    handleNext,
    handlePrevious,
    handleClose,
    handleSwipeUp,
    handleSwipeDown,
    setIsPaused
  };
};
