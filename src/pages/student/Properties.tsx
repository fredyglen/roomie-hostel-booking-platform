
import React from 'react';
import Header from '@/components/layout/Header';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import PropertyListContainer from '@/components/properties/PropertyListContainer';
import { sampleProperties } from '@/data/sampleProperties';

const Properties: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-1 sm:px-2 md:px-4">
        <div className="container mx-auto max-w-[2000px]">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 px-1">Find Your Perfect Student Accommodation</h1>
          
          {/* Property List Container - handles filtering and displaying properties */}
          <PropertyListContainer properties={sampleProperties} />
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Properties;
