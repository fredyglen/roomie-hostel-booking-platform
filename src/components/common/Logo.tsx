
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  size = 'md',
  withText = true 
}) => {
  const getSize = () => {
    switch(size) {
      case 'sm': return 'h-6 w-6';
      case 'lg': return 'h-10 w-10';
      default: return 'h-8 w-8';
    }
  };
  
  const getTextSize = () => {
    switch(size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      default: return 'text-2xl';
    }
  };

  const color = variant === 'white' ? 'text-white' : 'text-roomi-blue';

  return (
    <Link to="/" className="flex items-center">
      <div className={`${getSize()} rounded-md bg-gradient-to-br from-roomi-blue to-roomi-teal flex items-center justify-center`}>
        <span className="text-white font-bold text-xs">R</span>
      </div>
      {withText && (
        <span className={`${color} ${getTextSize()} font-bold ml-2`}>
          ROOMi
        </span>
      )}
    </Link>
  );
};

export default Logo;
