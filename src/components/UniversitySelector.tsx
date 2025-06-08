import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { IMAGE_URLS } from '@/constants/images';

interface University {
  id: string;
  name: string;
  abbreviation: string;
  image: string;
  location: string;
}

const universities: University[] = [
  {
    id: 'upsa',
    name: 'University of Professional Studies',
    abbreviation: 'UPSA',
    image: IMAGE_URLS.SAMPLE_1,
    location: 'Accra'
  },
  {
    id: 'knust',
    name: 'Kwame Nkrumah University of Science and Technology',
    abbreviation: 'KNUST',
    image: IMAGE_URLS.SAMPLE_2,
    location: 'Kumasi'
  },
  {
    id: 'legon',
    name: 'University of Ghana',
    abbreviation: 'Legon',
    image: IMAGE_URLS.SAMPLE_3,
    location: 'Accra'
  },
  {
    id: 'central',
    name: 'University of Cape Coast',
    abbreviation: 'UCC',
    image: IMAGE_URLS.SAMPLE_4,
    location: 'Cape Coast'
  }
];

const UniversitySelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (universityId: string) => {
    // In a real app, we would store this selection
    ErrorHandler.log(`Selected university: ${universityId}`);
    // For now, just navigate to the student properties page
    navigate('/student/properties');
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Select Your University</h2>
      <p className="text-center text-gray-600 mb-8">We'll show you accommodations near your campus</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {universities.map((university) => (
          <div 
            key={university.id} 
            className="university-card"
            onClick={() => handleSelect(university.id)}
          >
            <img 
              src={university.image} 
              alt={university.name}
              className="university-image"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{university.abbreviation}</h3>
              <p className="text-sm text-gray-600">{university.name}</p>
              <p className="text-xs text-gray-500 mt-1">{university.location}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <p className="mb-4 text-gray-600">Don't see your university?</p>
        <Button variant="outline" onClick={() => navigate('/request-university')}>
          Request Your University
        </Button>
      </div>
    </div>
  );
};

export default UniversitySelector;
