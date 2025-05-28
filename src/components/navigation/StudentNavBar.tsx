
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '@/context/AuthContext';

const StudentNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
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

  const isActive = (path: string) => {
    // Handle special cases for nested routes
    if (path === '/student/properties') {
      return location.pathname === path || 
             location.pathname.startsWith('/student/property/');
    }
    return location.pathname === path;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/student/profile');
  };

  // Don't show navbar on certain pages
  const hideOnPaths = [
    '/login',
    '/register',
    '/welcome',
    '/'
  ];

  // Also hide on specific story and booking pages
  const isStoryPage = location.pathname.includes('/story') || location.pathname.includes('/enhanced-story');
  const isBookingPage = location.pathname.includes('/book');
  
  const shouldHide = hideOnPaths.includes(location.pathname) || isStoryPage || isBookingPage;

  if (shouldHide) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 z-40 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        <Link 
          to="/student/properties" 
          className="flex flex-col items-center w-1/4 py-2 transition-colors hover:bg-gray-50 rounded-lg"
        >
          <Icon 
            icon="solar:home-2-linear" 
            className={`text-2xl ${isActive('/student/properties') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/properties') ? 'text-blue-500' : 'text-gray-500'}`}>
            Properties
          </span>
        </Link>
        
        <Link 
          to="/student/explore" 
          className="flex flex-col items-center w-1/4 py-2 transition-colors hover:bg-gray-50 rounded-lg"
        >
          <Icon 
            icon="solar:map-point-linear" 
            className={`text-2xl ${isActive('/student/explore') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/explore') ? 'text-blue-500' : 'text-gray-500'}`}>
            Explore
          </span>
        </Link>
        
        <Link 
          to="/student/favorites" 
          className="flex flex-col items-center w-1/4 py-2 transition-colors hover:bg-gray-50 rounded-lg"
        >
          <Icon 
            icon="solar:heart-linear" 
            className={`text-2xl ${isActive('/student/favorites') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/favorites') ? 'text-blue-500' : 'text-gray-500'}`}>
            Favorites
          </span>
        </Link>
        
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center w-1/4 py-2 transition-colors hover:bg-gray-50 rounded-lg"
        >
          <Icon 
            icon="solar:user-rounded-linear" 
            className={`text-2xl ${isActive('/student/profile') ? 'text-blue-500' : 'text-gray-500'}`}
          />
          <span className={`text-xs mt-1 ${isActive('/student/profile') ? 'text-blue-500' : 'text-gray-500'}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};

export default StudentNavBar;
