
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

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
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const handleBookNow = () => {
    navigate(`/properties/${propertyId}/book`);
  };

  return (
    <div className="story-viewer" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-20 text-white bg-black/30 rounded-full p-1"
        onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Progress bars */}
      <div className="absolute top-2 left-0 right-0 z-20 px-4 flex gap-1">
        {storyMedia.map((_, i) => (
          <div key={i} className="story-progress flex-1">
            <div 
              className="story-progress-bar" 
              style={{ 
                width: `${i === currentIndex ? progress : i < currentIndex ? 100 : 0}%` 
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
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          <span className="text-white text-sm mb-1">Swipe up for details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
      
      {/* Property details sheet */}
      <div 
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
              <span className="font-bold text-xl text-roomi-blue">₵{propertyDetails.price}</span>
              <span className="text-gray-500">/{propertyDetails.priceUnit}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
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
