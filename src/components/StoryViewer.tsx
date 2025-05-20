
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import { Icon } from '@iconify/react';

interface StoryViewerProps {
  propertyId: string;
  onClose: () => void;
}

interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // in seconds
}

const StoryViewer: React.FC<StoryViewerProps> = ({ propertyId, onClose }) => {
  // In a real app, we would fetch this data from an API
  const storyMedia: StoryMedia[] = [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      duration: 5
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      duration: 5
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
      duration: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Property details (mock data)
  const propertyDetails = {
    id: propertyId,
    title: 'Cozy Studio Near UPSA',
    type: 'Studio',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    amenities: ['Wi-Fi', 'Air Conditioning', 'Security', 'Water', 'Bathroom'],
    description: 'This cozy studio apartment is perfect for students looking for comfort and convenience. Located just a 5-minute walk from UPSA, it offers all the amenities you need for a comfortable student life.',
    rating: 4.5,
    reviewCount: 23
  };

  useEffect(() => {
    if (isPaused) return;
    
    const currentMedia = storyMedia[currentIndex];
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentMedia.duration * 10));
        if (newProgress >= 100) {
          clearInterval(interval);
          // Move to next story or close if at the end
          if (currentIndex < storyMedia.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
          } else {
            onClose();
          }
        }
        return newProgress < 100 ? newProgress : 0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < storyMedia.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return;

    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;

    // If swiping up, show details
    if (diff > 50) {
      setShowDetails(true);
    }
    // If swiping down, hide details
    else if (diff < -50) {
      setShowDetails(false);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setTouchStartY(0);
  };

  const handleBookNow = () => {
    navigate(`/student/property/${propertyId}/book`);
  };

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  const handleDetailsClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div 
      className="story-viewer"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-20 text-white bg-black/30 rounded-full p-1"
        onClick={onClose}
      >
        <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
      </button>
      
      {/* Progress bars */}
      <div className="absolute top-2 left-0 right-0 z-20 px-4 flex gap-1">
        {storyMedia.map((_, i) => (
          <div key={i} className="story-progress h-1 bg-white/30 rounded-full flex-1">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ 
                width: `${i === currentIndex ? progress : i < currentIndex ? 100 : 0}%`,
                transition: i === currentIndex ? 'width 0.1s linear' : 'none'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation overlay */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2 h-full" onClick={handlePrev}></div>
        <div className="w-1/2 h-full" onClick={handleNext}></div>
      </div>
      
      {/* Media content */}
      <div className="w-full h-full max-w-md relative">
        <img 
          src={storyMedia[currentIndex].url}
          alt="Story media"
          className="w-full h-full object-cover"
        />
        
        {/* Property brief info */}
        <div className="absolute bottom-24 left-0 right-0 px-4 text-white">
          <h2 className="text-xl font-bold">{propertyDetails.title}</h2>
          <p className="text-sm">₵{propertyDetails.price}/{propertyDetails.priceUnit} · {propertyDetails.distanceToCampus} to campus</p>
        </div>
        
        {/* Swipe up indicator */}
        <div 
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center cursor-pointer"
          onClick={handleDetailsClick}
        >
          <span className="text-white text-sm mb-1">Swipe up for details</span>
          <Icon 
            icon="solar:alt-arrow-up-linear" 
            className="h-6 w-6 text-white animate-bounce" 
          />
        </div>
      </div>
      
      {/* Property details sheet */}
      <div 
        ref={detailsRef}
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transition-transform duration-300 transform ${
          showDetails ? 'translate-y-0' : 'translate-y-full'
        } z-30 max-h-[80vh] overflow-y-auto`}
      >
        <div className="w-16 h-1 bg-gray-300 rounded mx-auto my-3"></div>
        
        <div className="px-4 pb-8">
          <h2 className="text-xl font-bold mb-2">{propertyDetails.title}</h2>
          <p className="text-gray-500 mb-4">{propertyDetails.address}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-bold text-xl text-blue-600">₵{propertyDetails.price}</span>
              <span className="text-gray-500">/{propertyDetails.priceUnit}</span>
            </div>
            <div className="flex items-center">
              <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
              <span className="ml-1">{propertyDetails.rating} ({propertyDetails.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {propertyDetails.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{propertyDetails.description}</p>
          </div>
          
          <Button variant="primary" fullWidth onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
