
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import Logo from './common/Logo';

const backgroundImages = [
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
];

const SplashScreen: React.FC = () => {
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
      {/* Background Slides */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`splash-slide ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo variant="white" size="lg" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Find your home away from campus
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Your perfect student accommodation is just a few clicks away.
          </p>
          <Button 
            variant="accent" 
            size="lg" 
            onClick={handleContinue}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
