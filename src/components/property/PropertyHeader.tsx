
import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

interface PropertyHeaderProps {
  id: string;
  title: string;
  address: string;
  distanceToCampus?: string;
  rating?: number;
  reviewCount?: number;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  id, title, address, distanceToCampus, rating, reviewCount
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <div className="flex space-x-2">
          <Link to={`/student/property/${id}/story`}>
            <Button variant="outline" size="sm">View Story</Button>
          </Link>
        </div>
      </div>
      <p className="text-gray-600 mb-2">{address}</p>
      <div className="flex items-center text-sm text-gray-500">
        {distanceToCampus && <span className="mr-4">{distanceToCampus} to campus</span>}
        {rating && reviewCount && (
          <span className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            {rating} ({reviewCount} reviews)
          </span>
        )}
      </div>
    </div>
  );
};

export default PropertyHeader;
