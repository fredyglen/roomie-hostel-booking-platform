
import React from 'react';
import { X } from 'lucide-react';

interface StoryHeaderProps {
  title: string;
  distanceToCampus: string;
  imageUrl: string;
  onClose: () => void;
}

const StoryHeader: React.FC<StoryHeaderProps> = ({ 
  title, 
  distanceToCampus, 
  imageUrl, 
  onClose 
}) => {
  return (
    <div className="absolute top-12 left-0 right-0 z-20 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 overflow-hidden">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-medium">{title}</p>
            <p className="text-white/80 text-xs">{distanceToCampus} to campus</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white bg-black/30 rounded-full p-1"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default StoryHeader;
