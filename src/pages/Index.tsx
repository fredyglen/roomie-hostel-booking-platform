
import React, { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import UniversitySelector from '@/components/UniversitySelector';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/PropertyCard';
import Button from '@/components/common/Button';
import StoryViewer from '@/components/StoryViewer';

const propertyData = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    price: 850,
    priceUnit: 'month' as const,
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 23,
    verified: true
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: 500,
    priceUnit: 'month' as const,
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.2,
    reviewCount: 17,
    verified: true
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'semester' as const,
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 42,
    verified: false
  }
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showUniversitySelector, setShowUniversitySelector] = useState(false);
  const [viewingStory, setViewingStory] = useState<string | null>(null);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowUniversitySelector(true);
  };
  
  // In a real app, we would get these from the router or context
  const isAuthenticated = false;
  const userRole = null;

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showUniversitySelector) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <UniversitySelector />
        </div>
        <Footer />
      </div>
    );
  }

  if (viewingStory) {
    return (
      <StoryViewer 
        propertyId={viewingStory} 
        onClose={() => setViewingStory(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-roomi-blue py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                Find your perfect student accommodation
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Browse verified properties near your campus, take virtual tours, and book your stay in minutes.
              </p>
              
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>UPSA, Accra</option>
                      <option>KNUST, Kumasi</option>
                      <option>Legon, Accra</option>
                      <option>UCC, Cape Coast</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>All Types</option>
                      <option>Hostel</option>
                      <option>Homestel</option>
                      <option>Apartment</option>
                      <option>Studio</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-1 flex items-end">
                    <Button variant="primary" fullWidth>
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Properties</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyData.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Virtual Tours Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Take a Virtual Tour</h2>
              <Button variant="outline" size="sm">
                View All Tours
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {propertyData.map((property) => (
                <div key={property.id} className="relative rounded-lg overflow-hidden shadow-md group">
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold">{property.title}</h3>
                    <p className="text-gray-200 text-sm">{property.distanceToCampus} to campus</p>
                    
                    <Button 
                      variant="accent" 
                      size="sm" 
                      className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setViewingStory(property.id)}
                    >
                      View Tour
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">How ROOMi Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-roomi-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-roomi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Search</h3>
                <p className="text-gray-500">Browse verified properties near your campus with detailed information and pricing.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-roomi-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-roomi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Tour</h3>
                <p className="text-gray-500">Take virtual tours of properties without traveling, saving time and money.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-roomi-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-roomi-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Book</h3>
                <p className="text-gray-500">Book your stay with transparent pricing and secure online payment.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="bg-roomi-blue py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">What Students Say About Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Ama Mensah</h4>
                    <p className="text-sm text-gray-500">UPSA Student</p>
                  </div>
                </div>
                <p className="text-gray-600">"ROOMi saved me so much time in finding my accommodation. The virtual tours were especially helpful as I could see multiple places in one day."</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Kwame Boateng</h4>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
                <p className="text-gray-600">"As a property owner, ROOMi has increased my occupancy rate significantly. The platform is easy to use and the team is very supportive."</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Eric Adjei</h4>
                    <p className="text-sm text-gray-500">Property Agent</p>
                  </div>
                </div>
                <p className="text-gray-600">"ROOMi has completely transformed how I work as an agent. I can manage multiple properties efficiently and the commission structure is very transparent."</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="bg-roomi-orange/10 rounded-xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-roomi-dark">Ready to find your perfect student accommodation?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">Join thousands of students who have found their ideal home away from campus with ROOMi.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="primary" size="lg">
                  Sign Up as Student
                </Button>
                <Button variant="outline" size="lg">
                  List Your Property
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
