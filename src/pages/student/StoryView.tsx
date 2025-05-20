import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import StoryProgressBar from '@/components/story/StoryProgressBar';
import StoryHeader from '@/components/story/StoryHeader';
import StoryMediaViewer from '@/components/story/StoryMediaViewer';
import StoryDetailsSheet from '@/components/story/StoryDetailsSheet';
import { Property, Story } from '@/types/property';

// Sample property data matching other pages
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    stories: [
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
    ],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Security'],
    description: 'This cozy studio apartment is perfect for students looking for a comfortable and convenient living space near UPSA. The apartment features a modern design, fully furnished with all the essential amenities to make your stay as comfortable as possible.'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: 500,
    priceUnit: 'month',
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
        duration: 5000
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
        duration: 5000
      }
    ]
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'semester',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
        duration: 5000
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
        duration: 5000
      }
    ]
  }
];

const StoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Find the property with the matching ID
  const property = sampleProperties.find(p => p.id === id);
  
  useEffect(() => {
    if (!property) return;
    
    // Don't progress if paused or showing details
    if (isPaused || showDetails) return;
    
    // Auto-advance to the next story
    const currentStory = property.stories[activeIndex];
    const duration = currentStory.duration;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1000;
        if (newProgress >= duration) {
          clearInterval(timer);
          
          if (activeIndex < property.stories.length - 1) {
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
  }, [activeIndex, property, id, navigate, isPaused, showDetails]);
  
  if (!property) {
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
  
  const handleNext = () => {
    if (activeIndex < property.stories.length - 1) {
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

  const currentStory = property.stories[activeIndex];
  const progressPercentage = (progress / currentStory.duration) * 100;

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
          onBookNow={() => navigate(`/student/property/${id}/book`)}
        />
      )}
    </div>
  );
};

export default StoryView;
