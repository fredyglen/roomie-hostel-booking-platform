
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Logo from './common/Logo';
import { Icon } from '@iconify/react';

// Using your uploaded images
const backgroundImages = [
  '/lovable-uploads/c018248d-d6fc-443b-9c79-fd03aa52c962.png',
  '/lovable-uploads/687d2a93-5ac5-42ea-af7a-729ffcabb3f8.png',
  '/lovable-uploads/5ba0f880-6f16-4b5f-9f51-2674c0926c2e.png',
  '/lovable-uploads/a0372271-117e-4341-96f7-99ceff6f2187.png',
  '/lovable-uploads/77a518c7-d291-4c57-9a6b-85380032b3ef.png',
];

const SplashScreen: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(activeIndex);
      setActiveIndex((current) => (current + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleContinue = () => {
    navigate('/landing');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Slides with enhanced zoom and crossfade transitions */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-7000 ease-in-out transform
                     ${index === activeIndex ? 'opacity-100 scale-110' : 
                      index === prevIndex ? 'opacity-0 scale-100' : 'opacity-0 scale-100'}`}
          style={{ 
            backgroundImage: `url(${image})`,
            transitionProperty: 'opacity, transform',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: index === activeIndex ? '7s' : '2s',
          }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo variant="white" size="lg" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Find your home away from campus
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your perfect student accommodation is just a few clicks away.
          </p>
          <Button 
            variant="accent" 
            size="lg" 
            onClick={handleContinue}
            className="animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="flex items-center">
              Get Started
              <Icon icon="solar:arrow-right-linear" className="ml-2 h-5 w-5 text-white" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
