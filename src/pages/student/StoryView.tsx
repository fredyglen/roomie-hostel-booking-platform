
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';

// Sample property data matching other pages
const sampleProperties = [
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
        duration: 5000
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
        duration: 5000
      }
    ]
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
  
  // Find the property with the matching ID
  const property = sampleProperties.find(p => p.id === id);
  
  useEffect(() => {
    if (!property) return;
    
    // Auto-advance to the next story
    const timer = setTimeout(() => {
      if (activeIndex < property.stories.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else {
        // Navigate back to the property detail page when all stories are viewed
        navigate(`/student/property/${id}`);
      }
    }, property.stories[activeIndex].duration);
    
    return () => clearTimeout(timer);
  }, [activeIndex, property, id, navigate]);
  
  if (!property) {
    return (
      <div className="story-viewer">
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
    } else {
      navigate(`/student/property/${id}`);
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  
  const handleClose = () => {
    navigate(`/student/property/${id}`);
  };
  
  const handleSwipeUp = () => {
    setShowDetails(true);
  };
  
  const handleSwipeDown = () => {
    setShowDetails(false);
  };

  return (
    <div className="story-viewer">
      {/* Story Content */}
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
              <div key={index} className="story-progress flex-grow">
                <div 
                  className="story-progress-bar" 
                  style={{ 
                    width: index < activeIndex ? '100%' : index === activeIndex ? '0%' : '0%',
                    animation: index === activeIndex ? 'progress-animation 5s linear forwards' : 'none'
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
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
              <div>
                <p className="text-white font-medium">{property.title}</p>
                <p className="text-white/80 text-xs">{property.distanceToCampus} to campus</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Story Image */}
        <div className="flex-grow relative">
          <img
            src={property.stories[activeIndex].url}
            alt={property.title}
            className="h-full w-full object-cover"
          />
          
          {/* Navigation Controls */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full" onClick={handlePrevious}></div>
            <div className="w-1/2 h-full" onClick={handleNext}></div>
          </div>
          
          {/* Swipe Up Indicator */}
          {!showDetails && (
            <div 
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce"
              onClick={handleSwipeUp}
            >
              <p className="text-white text-sm font-medium mb-1">Swipe up for details</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Details Sheet */}
      {showDetails && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up h-3/4 overflow-y-auto">
          <div 
            className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6"
            onClick={handleSwipeDown}
          ></div>
          
          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <p className="text-gray-600 mb-2">{property.address}</p>
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-roomi-blue mr-1">${property.price}</span>
            <span className="text-gray-600">/{property.priceUnit}</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-roomi-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Type: {property.type}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-roomi-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Distance: {property.distanceToCampus}</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => navigate(`/student/property/${id}/book`)}
          >
            Book Now
          </Button>
          
          <Button 
            variant="outline" 
            fullWidth
            className="mt-2"
            onClick={() => navigate(`/student/property/${id}`)}
          >
            View Full Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryView;
