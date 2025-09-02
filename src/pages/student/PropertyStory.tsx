import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryViewer from '@/components/StoryViewer';

const PropertyStory: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/student/properties');
  };

  if (!propertyId) {
    navigate('/student/properties');
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000000',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <StoryViewer 
        propertyId={propertyId} 
        onClose={handleClose}
      />
    </div>
  );
};

export default PropertyStory;
