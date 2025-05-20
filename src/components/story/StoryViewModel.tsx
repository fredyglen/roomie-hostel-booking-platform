
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, Story } from '@/types/property';

// Sample property data matching other pages
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Homestel',
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
    description: 'This cozy studio apartment is perfect for students looking for a comfortable and convenient living space near UPSA. The apartment features a modern design, fully furnished with all the essential amenities to make your stay as comfortable as possible.',
    roomTypes: [
      { name: '1 in a room', price: 1700, unit: 'month' },
      { name: '2 in a room', price: 1200, unit: 'month' }
    ],
    occupancy: '1-2 students'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Hostel',
    price: 4000,
    priceUnit: 'semester',
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
    ],
    roomTypes: [
      { name: '2 in a room', price: 4000, unit: 'semester' },
      { name: '3 in a room', price: 3600, unit: 'semester' }
    ],
    occupancy: '2-3 students',
    amenities: ['Wi-Fi', 'Shared Kitchen', 'Laundry', 'Water Supply'],
    description: 'Comfortable hostel with all utilities inclusive. Perfect for students looking for affordable accommodation near campus.'
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Apartment',
    price: 2600,
    priceUnit: 'month',
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
    ],
    roomTypes: [
      { name: 'Entire apartment', price: 2600, unit: 'month' },
      { name: 'Shared apartment (per student)', price: 950, unit: 'month' }
    ],
    occupancy: '2-4 students',
    amenities: ['Wi-Fi', 'Study Area', 'Cafeteria', '24/7 Security', 'AC', 'Fully Furnished'],
    description: 'Executive 2-bedroom apartment that can be shared by multiple students. All rooms ensuite with modern amenities and security.'
  }
];

export const useStoryViewModel = () => {
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
  
  const handleNext = () => {
    if (property && activeIndex < property.stories.length - 1) {
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

  const currentStory = property?.stories[activeIndex];
  const progressPercentage = currentStory ? (progress / currentStory.duration) * 100 : 0;

  return {
    property,
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
