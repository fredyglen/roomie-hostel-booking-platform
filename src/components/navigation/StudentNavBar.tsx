
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const StudentNavBar: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 z-50 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-around items-center h-16 px-2">
        <Link to="/student/properties" className="flex flex-col items-center w-1/4">
          <Icon 
            icon="solar:home-2-linear" 
            className={`text-2xl ${isActive('/student/properties') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/properties') ? 'text-blue-500' : 'text-gray-500'}`}>Home</span>
        </Link>
        
        <Link to="/student/explore" className="flex flex-col items-center w-1/4">
          <Icon 
            icon="solar:map-point-linear" 
            className={`text-2xl ${isActive('/student/explore') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/explore') ? 'text-blue-500' : 'text-gray-500'}`}>Explore</span>
        </Link>
        
        <Link to="/student/favorites" className="flex flex-col items-center w-1/4">
          <Icon 
            icon="solar:heart-linear" 
            className={`text-2xl ${isActive('/student/favorites') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/favorites') ? 'text-blue-500' : 'text-gray-500'}`}>Favorites</span>
        </Link>
        
        <Link to="/student/profile" className="flex flex-col items-center w-1/4">
          <Icon 
            icon="solar:user-rounded-linear" 
            className={`text-2xl ${isActive('/student/profile') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/profile') ? 'text-blue-500' : 'text-gray-500'}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentNavBar;
