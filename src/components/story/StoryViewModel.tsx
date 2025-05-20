
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, Story } from '@/types/property';
import { usePropertyLoader } from '@/hooks/usePropertyLoader';

export const useStoryViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use the property loader to fetch property data
  const { data: property, isLoading: isPropertyLoading } = usePropertyLoader({ 
    propertyId: id || '', 
    forOwner: false 
  });
  
  // Define sample stories if needed when property is still loading
  const sampleStories: Story[] = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      caption: 'Modern living room with natural light',
      duration: 5000
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      caption: 'Well-equipped kitchen space',
      duration: 5000
    },
    {
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-living-room-with-a-modern-tv-4047-large.mp4',
      caption: 'Virtual tour of the apartment',
      duration: 15000
    }
  ];
  
  // If property has images, convert them to stories
  useEffect(() => {
    if (property && property.images && property.images.length > 0 && !property.stories) {
      // Reset progress and active index when property changes
      setProgress(0);
      setActiveIndex(0);
      setIsPaused(false);
      setShowDetails(false);
    }
  }, [property]);
  
  // Generate stories from property images if needed
  const stories = property?.stories || 
    (property?.images?.map(image => ({
      type: 'image',
      url: image,
      duration: 5000
    })) as Story[]) || 
    sampleStories;
  
  useEffect(() => {
    if (!property || isPropertyLoading) return;
    
    // Don't progress if paused or showing details
    if (isPaused || showDetails) return;
    
    // Auto-advance to the next story
    const currentStory = stories[activeIndex];
    if (!currentStory) return;

    const duration = currentStory.duration;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1000;
        if (newProgress >= duration) {
          clearInterval(timer);
          
          if (activeIndex < stories.length - 1) {
            setActiveIndex(activeIndex + 1);
            setProgress(0);
          } else {
            // Navigate back to the property detail page when all stories are viewed
            navigate(`/student/property/${id}`);
          }
        }
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeIndex, property, id, navigate, isPaused, showDetails, stories, isPropertyLoading]);
  
  const handleNext = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1);
      setProgress(0);
    } else {
      navigate(`/student/property/${id}`);
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setProgress(0);
    }
  };
  
  const handleClose = () => {
    navigate(`/student/property/${id}`);
  };
  
  const handleSwipeUp = () => {
    setShowDetails(true);
    setIsPaused(true);
  };
  
  const handleSwipeDown = () => {
    setShowDetails(false);
    setIsPaused(false);
  };

  const currentStory = stories[activeIndex];
  const progressPercentage = currentStory ? (progress / currentStory.duration) * 100 : 0;

  return {
    property,
    isLoading: isPropertyLoading,
    stories,
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
  };
};
