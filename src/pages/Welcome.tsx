
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';

const backgroundImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
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
      {/* Background Slides */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out 
                     ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${image})` }}
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
