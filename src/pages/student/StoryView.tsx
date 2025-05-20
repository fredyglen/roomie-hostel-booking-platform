import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { ArrowLeft, ArrowRight, ChevronUp, X } from 'lucide-react';

// Update the story type to make caption optional
type Story = {
  type: string;
  url: string;
  duration: number;
  caption?: string; // Make caption optional
};

// Update the property type to include the updated Story type
type Property = {
  id: string;
  title: string;
  type: string;
  price: number;
  priceUnit: string;
  address: string;
  distanceToCampus: string;
  stories: Story[];
  amenities?: string[];
  description?: string;
};

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
        <div className="absolute top-4 left-0 right-0 z-20 px-4">
          <div className="flex space-x-1">
            {property.stories.map((_, index) => (
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
        
        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-20 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 overflow-hidden">
                <img src={property.stories[0].url} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-medium">{property.title}</p>
                <p className="text-white/80 text-xs">{property.distanceToCampus} to campus</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white bg-black/30 rounded-full p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Story Media */}
        <div 
          className="flex-grow relative"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => !showDetails && setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => !showDetails && setIsPaused(false)}
        >
          {currentStory.type === 'image' ? (
            <img
              src={currentStory.url}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={currentStory.url}
              autoPlay
              playsInline
              muted={isPaused}
              className="h-full w-full object-cover"
              onEnded={handleNext}
            />
          )}
          
          {/* Caption - Fixed: Check if caption exists before rendering */}
          {currentStory.caption && (
            <div className="absolute bottom-24 left-0 right-0 px-4">
              <p className="text-white text-center bg-black/30 py-2 px-4 rounded-lg">
                {currentStory.caption}
              </p>
            </div>
          )}
          
          {/* Navigation Controls */}
          <div className="absolute inset-0 flex z-10">
            <button 
              className="w-1/4 h-full focus:outline-none"
              onClick={handlePrevious}
              aria-label="Previous"
            />
            <div className="w-1/2 h-full" onClick={() => setIsPaused(!isPaused)} />
            <button 
              className="w-1/4 h-full focus:outline-none"
              onClick={handleNext}
              aria-label="Next"
            />
          </div>
          
          {/* Navigation Buttons (Visual) */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            {activeIndex > 0 && (
              <button 
                className="text-white bg-black/30 rounded-full p-2"
                onClick={handlePrevious}
                aria-label="Previous"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            {activeIndex < property.stories.length - 1 && (
              <button 
                className="text-white bg-black/30 rounded-full p-2"
                onClick={handleNext}
                aria-label="Next"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            )}
          </div>
          
          {/* Swipe Up Indicator */}
          {!showDetails && (
            <div 
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce cursor-pointer"
              onClick={handleSwipeUp}
            >
              <p className="text-white text-sm font-medium mb-1">Swipe up for details</p>
              <ChevronUp className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </div>
      
      {/* Details Sheet */}
      {showDetails && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up h-[70%] overflow-y-auto">
          <div 
            className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6 cursor-pointer"
            onClick={handleSwipeDown}
          ></div>
          
          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <p className="text-gray-600 mb-2">{property.address}</p>
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-roomi-blue mr-1">${property.price}</span>
            <span className="text-gray-600">/{property.priceUnit}</span>
          </div>
          
          {property.description && (
            <p className="text-gray-700 mb-6">{property.description}</p>
          )}
          
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="sticky bottom-0 pt-4 bg-white">
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => navigate(`/student/property/${id}/book`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryView;
