
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UniversitySelector from '@/components/UniversitySelector';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={false} />
      <div className="flex-grow">
        <UniversitySelector />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
