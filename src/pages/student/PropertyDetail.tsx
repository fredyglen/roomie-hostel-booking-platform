import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, CheckCircle, Info, Home } from 'lucide-react';

// Sample property data matching the data structure from the Properties page
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 23,
    verified: true,
    amenities: ['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Security'],
    description: 'This cozy studio apartment is perfect for students looking for a comfortable and convenient living space near UPSA. The apartment features a modern design, fully furnished with all the essential amenities to make your stay as comfortable as possible.',
    houseRules: [
      'No smoking',
      'No pets',
      'No parties',
      'Quiet hours from 10 PM to 6 AM'
    ],
    availableUnits: 3,
    owner: {
      name: 'Mr. Kwame Boateng',
      phone: '+233 50 123 4567',
      responseRate: '95%',
      verified: true
    },
    location: 'East Legon'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: 500,
    priceUnit: 'month',
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
    ],
    rating: 4.2,
    reviewCount: 17,
    verified: true,
    amenities: ['Wi-Fi', 'Shared Kitchen', 'Laundry', 'Water Supply'],
    description: 'Share a spacious 2-bedroom apartment with a fellow student. The apartment is fully furnished with a shared kitchen, living room, and bathroom. Each bedroom is private and comes with a desk, chair, and wardrobe.',
    houseRules: [
      'No smoking',
      'No pets',
      'Clean common areas after use',
      "Respect roommates' space and belongings"
    ],
    availableUnits: 1,
    owner: {
      name: 'Mrs. Adwoa Mensah',
      phone: '+233 24 567 8901',
      responseRate: '87%',
      verified: true
    }
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'semester',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 42,
    verified: false,
    amenities: ['Wi-Fi', 'Study Area', 'Cafeteria', '24/7 Security'],
    description: 'Our premium single rooms offer students a comfortable and private space to live and study. The hostel is located just a 2-minute walk from campus and features various amenities including a cafeteria, study areas, and 24/7 security.',
    houseRules: [
      'No visitors after 10 PM',
      'No cooking in rooms',
      'Keep noise levels down',
      'No alcohol on premises'
    ],
    availableUnits: 5,
    owner: {
      name: 'University Housing Ltd',
      phone: '+233 32 876 5432',
      responseRate: '100%',
      verified: true
    }
  }
];

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  
  // Find the property with the matching ID
  const property = sampleProperties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/student/properties">
              <Button variant="primary">Browse Properties</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Property Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
              <div className="flex space-x-2">
                <Link to={`/student/property/${id}/story`}>
                  <Button variant="outline" size="sm">View Story</Button>
                </Link>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{property.address}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">{property.distanceToCampus} to campus</span>
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                {property.rating} ({property.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          {/* Property Images */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden h-64">
                  <img 
                    src={image} 
                    alt={`${property.title} - Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Property Details and Booking Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-4">
                    <h2 className="text-xl font-bold mb-2">About this property</h2>
                    <p className="text-gray-700">{property.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm text-gray-500">Type</div>
                        <div className="font-medium">{property.type}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{property.location}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm text-gray-500">Available Units</div>
                        <div className="font-medium">{property.availableUnits}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm text-gray-500">Distance</div>
                        <div className="font-medium">{property.distanceToCampus}</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location">
                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">Address</h3>
                        <p className="text-gray-700">{property.address}</p>
                        <p className="text-gray-600 text-sm mt-1">{property.distanceToCampus} to campus</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 h-48 rounded-md flex items-center justify-center mt-4">
                      <p className="text-gray-500">Map view coming soon</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rules">
                    <h3 className="text-lg font-semibold mb-3">House Rules</h3>
                    <ul className="space-y-2">
                      {property.houseRules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <Info className="h-5 w-5 text-roomi-blue mr-2 flex-shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="amenities">
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Owner/Agent Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Hosted by {property.owner.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                    <Home className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    {property.owner.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                    )}
                    <p className="mt-1">Response rate: {property.owner.responseRate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-roomi-blue">₵{property.price}</span>
                    <span className="text-gray-600">/{property.priceUnit}</span>
                  </div>
                  {property.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                  )}
                </div>
                
                <p className="mb-4 text-sm">{property.availableUnits} units available</p>
                
                <Link to={`/student/property/${id}/book`} className="block mb-4">
                  <Button variant="primary" fullWidth>
                    Book Now
                  </Button>
                </Link>
                
                <Button variant="outline" fullWidth>
                  Request a Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
