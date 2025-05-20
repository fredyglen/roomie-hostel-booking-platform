
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

// Top rated hostels
const topRatedHostels = [
  { 
    id: '1', 
    name: 'Prestige Hostel',
    description: 'Located just opposite the UPSA, the Prestige hostel is a popular hostel in East Legon. The proximity to the campus makes it one of the most preferred hostels for UPSA students.',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
    rating: 4.8,
    location: 'East Legon',
    price: 1200
  },
  { 
    id: '2', 
    name: 'MB3 Hostel',
    description: 'A very neat and well organized hostel, MB3 hostel is a favourite for students due to its proximity to campus and the great facilities.',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
    rating: 4.7,
    location: 'Madina',
    price: 850
  },
  { 
    id: '3', 
    name: 'Heavens Gate Hostel',
    description: 'Heavens Gate hostel is located in East Legon and is now a twin hostel. The hostel has an old and a new block as well as spacious self contained rooms for students.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    rating: 4.6,
    location: 'East Legon',
    price: 950
  },
  { 
    id: '4', 
    name: 'Chika Hostel (All girls)',
    description: 'Chika house is an all girls hostel located in East Legon. The hostel has a spacious compound as well as well ventilated rooms.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    rating: 4.6,
    location: 'East Legon',
    price: 1100,
    tags: ['Girls Only']
  }
];

// All-girl hostels
const allGirlsHostels = [
  { 
    id: '5', 
    name: 'Kitatsu Hostel',
    description: 'This is an all girls hostel located very close to the UPSA. It\'s one of the few hostels located in Madina which take in only female students.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    rating: 4.5,
    location: 'Madina',
    price: 950,
    tags: ['Girls Only']
  },
  { 
    id: '6', 
    name: 'Student Hostel',
    description: 'This Student hostel is located in East Legon and it is an all female hostel. Students here have a large compound as well as lots of privacy within their rooms.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    rating: 4.4,
    location: 'East Legon',
    price: 1050,
    tags: ['Girls Only']
  }
];

// Near UPSA
const nearUPSAHostels = [
  { 
    id: '7', 
    name: 'Green Hostel',
    description: 'Located just behind the UPSA is Green hostel, a 3 storey building hostel for students. You can easily walk to campus from here.',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    rating: 4.3,
    location: 'East Legon',
    price: 900
  },
  { 
    id: '8', 
    name: 'Henrich Hostel',
    description: 'Henrich is a popular hostel located behind the UPSA. The proximity to campus makes this a preferred destination for many students.',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
    rating: 4.2,
    location: 'East Legon',
    price: 920
  }
];

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

  const handleHostelClick = (id: string) => {
    navigate(`/student/property/${id}`);
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" 
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
          
          {/* Top Rated Hostels */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Top Rated Hostels</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/student/properties?sort=rating')} 
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {topRatedHostels.map(hostel => (
                <Card 
                  key={hostel.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleHostelClick(hostel.id)}
                >
                  <div className="relative h-40">
                    <img 
                      src={hostel.image} 
                      alt={hostel.name}
                      className="w-full h-full object-cover"
                    />
                    {hostel.tags && hostel.tags.includes('Girls Only') && (
                      <div className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                        Girls Only
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 flex items-center">
                      <Icon icon="solar:star-bold" className="text-yellow-400 mr-1" width={14} height={14} />
                      <span className="text-xs font-semibold">{hostel.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-1">{hostel.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Icon icon="solar:map-point-linear" className="mr-1 text-blue-500" width={14} height={14} />
                      {hostel.location}
                    </div>
                    <p className="text-sm line-clamp-2 text-gray-600 mb-2">{hostel.description}</p>
                    <p className="font-bold text-blue-600">${hostel.price}/month</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* All-Girls Hostels */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">All-Girls Hostels</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/student/properties?tags=Girls Only')} 
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {allGirlsHostels.map(hostel => (
                <Card 
                  key={hostel.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleHostelClick(hostel.id)}
                >
                  <div className="relative h-40">
                    <img 
                      src={hostel.image} 
                      alt={hostel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                      Girls Only
                    </div>
                    <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 flex items-center">
                      <Icon icon="solar:star-bold" className="text-yellow-400 mr-1" width={14} height={14} />
                      <span className="text-xs font-semibold">{hostel.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-1">{hostel.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Icon icon="solar:map-point-linear" className="mr-1 text-blue-500" width={14} height={14} />
                      {hostel.location}
                    </div>
                    <p className="text-sm line-clamp-2 text-gray-600 mb-2">{hostel.description}</p>
                    <p className="font-bold text-blue-600">${hostel.price}/month</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Near UPSA */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Near UPSA</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/student/properties?university=UPSA')} 
                className="text-blue-500 px-0"
              >
                See all
                <Icon icon="solar:arrow-right-linear" className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {nearUPSAHostels.map(hostel => (
                <Card 
                  key={hostel.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleHostelClick(hostel.id)}
                >
                  <div className="relative h-40">
                    <img 
                      src={hostel.image} 
                      alt={hostel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 flex items-center">
                      <Icon icon="solar:star-bold" className="text-yellow-400 mr-1" width={14} height={14} />
                      <span className="text-xs font-semibold">{hostel.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-1">{hostel.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Icon icon="solar:map-point-linear" className="mr-1 text-blue-500" width={14} height={14} />
                      {hostel.location}
                    </div>
                    <p className="text-sm line-clamp-2 text-gray-600 mb-2">{hostel.description}</p>
                    <p className="font-bold text-blue-600">${hostel.price}/month</p>
                  </CardContent>
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
