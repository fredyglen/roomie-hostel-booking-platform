
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';

// Using the uploaded images
const backgroundImages = [
  '/lovable-uploads/c018248d-d6fc-443b-9c79-fd03aa52c962.png',
  '/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png',
  '/lovable-uploads/5ba0f880-6f16-4b5f-9f51-2674c0926c2e.png',
  '/lovable-uploads/a0372271-117e-4341-96f7-99ceff6f2187.png',
  '/lovable-uploads/77a518c7-d291-4c57-9a6b-85380032b3ef.png'
];

const Welcome: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    navigate('/landing');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Slides with zoom effect */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-5000 ease-in-out transform
                     ${index === activeIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          style={{ 
            backgroundImage: `url(${image})`,
            transitionProperty: 'opacity, transform',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '5s',
          }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10 flex flex-col justify-between p-4 md:p-8">
        <div className="flex justify-center pt-6">
          <Logo variant="white" size="lg" />
        </div>
        
        <div className="flex justify-between items-end">
          <div className="max-w-md text-white mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find your home away from campus
            </h1>
            <p className="text-md md:text-lg">
              Book quality student housing without the hassle. Safe, verified, and affordable.
            </p>
          </div>
          
          <Button 
            variant="primary" 
            size="lg"
            className="mb-8"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
