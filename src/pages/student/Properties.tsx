
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyListContainer from '@/components/properties/PropertyListContainer';
import { usePropertyData } from '@/hooks/property/usePropertyData';
import { Loader2 } from 'lucide-react';

const Properties: React.FC = () => {
  const { properties, loading, error } = usePropertyData();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading properties: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Student Properties - ROOMi</title>
        <meta name="description" content="Browse available student accommodation properties" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Properties</h1>
            <p className="text-gray-600">
              {properties.length} properties available for student accommodation
            </p>
          </div>
          
          <PropertyListContainer 
            properties={properties} 
            isLoading={loading}
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Properties;
