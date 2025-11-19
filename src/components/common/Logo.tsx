import React from 'react';
import { Link } from 'react-router-dom';
import roomieLogo from '../../../assets/design-system/image-uploads/ROOMie.png';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  size = 'md',
  withText = false
}) => {
  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-6';
      case 'lg':
        return 'h-10';
      default:
        return 'h-8';
    }
  };

  return (
    <Link to="/" className="flex items-center">
      <img
        src={roomieLogo}
        alt="ROOMie"
        className={`${getHeight()} w-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;
