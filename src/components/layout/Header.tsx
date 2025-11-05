import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useAuth } from '@/context/EnhancedAuthContext';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className={`w-full ${transparent ? 'absolute top-0 z-10' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo variant={transparent ? 'white' : 'default'} />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className={`${transparent ? 'text-white' : 'text-roomi-dark'} font-medium`}>
              <ul className="flex space-x-8">
                <li><Link to="/properties" className="hover:text-roomi-blue transition-colors">Properties</Link></li>
                <li><Link to="/about" className="hover:text-roomi-blue transition-colors">About Us</Link></li>
                <li><Link to="/trust-safety" className="hover:text-roomi-blue transition-colors">Trust & Safety</Link></li>
                <li><Link to="/contact" className="hover:text-roomi-blue transition-colors">Contact</Link></li>
              </ul>
            </nav>
            {!loading && !user && (
              <div className="flex space-x-4">
                <Link to="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">Sign Up</Button></Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-roomi-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden bg-white py-4"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <nav className="flex flex-col space-y-4">
              <Link to="/properties" className="px-4 py-2 hover:bg-gray-100 rounded-md">Properties</Link>
              <Link to="/about" className="px-4 py-2 hover:bg-gray-100 rounded-md">About Us</Link>
              <Link to="/trust-safety" className="px-4 py-2 hover:bg-gray-100 rounded-md">Trust & Safety</Link>
              <Link to="/contact" className="px-4 py-2 hover:bg-gray-100 rounded-md">Contact</Link>
              <hr className="my-2" />
              {!loading && !user && (
                <div className="flex flex-col space-y-2 px-4">
                  <Link to="/login"><Button variant="outline" fullWidth>Sign In</Button></Link>
                  <Link to="/register"><Button variant="primary" fullWidth>Sign Up</Button></Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
