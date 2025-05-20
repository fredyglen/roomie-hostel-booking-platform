import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import PropertyHeader from '@/components/property/PropertyHeader';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyTabs from '@/components/property/PropertyTabs';
import PropertyOwnerCard from '@/components/property/PropertyOwnerCard';
import PropertyBookingCard from '@/components/property/PropertyBookingCard';

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
          <PropertyHeader 
            id={property.id}
            title={property.title}
            address={property.address}
            distanceToCampus={property.distanceToCampus}
            rating={property.rating}
            reviewCount={property.reviewCount}
          />
          
          {/* Property Images */}
          <PropertyImageGallery 
            images={property.images} 
            title={property.title} 
          />
          
          {/* Property Details and Booking Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <PropertyTabs
                  description={property.description}
                  address={property.address}
                  distanceToCampus={property.distanceToCampus}
                  houseRules={property.houseRules}
                  amenities={property.amenities}
                  type={property.type}
                  location={property.location}
                  availableUnits={property.availableUnits}
                  onTabChange={setActiveTab}
                />
              </div>
              
              {/* Owner/Agent Info */}
              <PropertyOwnerCard 
                name={property.owner.name}
                verified={property.owner.verified}
                responseRate={property.owner.responseRate}
              />
            </div>
            
            {/* Booking Card */}
            <div className="md:col-span-1">
              <PropertyBookingCard
                id={property.id}
                price={property.price}
                priceUnit={property.priceUnit}
                verified={property.verified}
                availableUnits={property.availableUnits}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
