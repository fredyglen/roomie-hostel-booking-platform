
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { Icon } from '@iconify/react';

// Sample location data
const popularLocations = [
  { id: 1, name: 'East Legon', count: 42, image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80' },
  { id: 2, name: 'Legon', count: 27, image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80' },
  { id: 3, name: 'Atomic', count: 15, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80' },
  { id: 4, name: 'Madina', count: 31, image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80' },
];

const universities = [
  { id: 1, name: 'University of Ghana', acronym: 'UG' },
  { id: 2, name: 'Ghana Institute of Management and Public Administration', acronym: 'GIMPA' },
  { id: 3, name: 'University of Professional Studies, Accra', acronym: 'UPSA' },
  { id: 4, name: 'Central University', acronym: 'CU' },
  { id: 5, name: 'Accra Technical University', acronym: 'ATU' },
];

const recentSearches = ['East Legon hostels', 'UPSA 2 in a room', 'Legon apartments', 'Affordable hostels in Madina'];

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/student/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLocationClick = (location: string) => {
    navigate(`/student/properties?location=${encodeURIComponent(location)}`);
  };
  
  const handleUniversityClick = (university: string) => {
    navigate(`/student/properties?university=${encodeURIComponent(university)}`);
  };
  
  const handleRecentSearch = (search: string) => {
    navigate(`/student/properties?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk pb-16">
      <Header />
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Explore</h1>
          
          {/* Search Box */}
          <div className="relative mb-8">
            <Icon 
              icon="solar:search-linear" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-blue-500" 
              width={20} 
              height={20} 
            />
            <Input
              type="text"
              placeholder="Search by location, university or property type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full rounded-l-none"
            >
              Search
            </Button>
          </div>
          
          {/* Recent Searches */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  className="rounded-full flex items-center"
                  onClick={() => handleRecentSearch(search)}
                >
                  <Icon icon="solar:clock-circle-linear" className="mr-1 text-blue-500" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Popular Locations */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Popular Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularLocations.map(location => (
                <Card 
                  key={location.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLocationClick(location.name)}
                >
                  <div className="relative h-32">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-3">
                      <p className="text-white font-semibold">{location.name}</p>
                      <p className="text-white text-sm">{location.count} properties</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Universities */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Universities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {universities.map(university => (
                <Card 
                  key={university.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleUniversityClick(university.name)}
                >
                  <CardContent className="flex items-center p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg font-bold mr-3">
                      {university.acronym}
                    </div>
                    <span className="font-medium">{university.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <StudentNavBar />
    </div>
  );
};

export default Explore;
