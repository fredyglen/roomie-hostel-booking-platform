import React from 'react';
import PropertyCard from '@/components/properties/PropertyCard';

// Mock data based on real Ghana hostel listings from the documentation
const mockGhanaHostels = [
  {
    id: '1',
    title: "Heaven's Gate Hostel",
    rent: 2600,
    location: "East Legon, 5 min walk to campus",
    bedrooms: 4,
    bathrooms: 2,
    maxOccupants: 4,
    images: ['/api/placeholder/400/300'],
    amenities: ['WiFi', 'AC', 'Laundry', 'Study Area'],
    propertyType: 'Hostel',
    genderRestriction: 'male',
    isAvailable: true,
    roomTypes: [
      { type: '4 in a room', price: 2600, bedsAvailable: 5, totalBeds: 8 },
      { type: '2 in a room', price: 4200, bedsAvailable: 2, totalBeds: 4 }
    ],
    distanceToCampus: '5 min walk',
    totalBedsAvailable: 7,
    totalBeds: 12,
    priceUnit: 'semester' as const
  },
  {
    id: '2',
    title: "Campus View Lodge",
    rent: 2200,
    location: "Okponglo, 3 min walk",
    bedrooms: 3,
    bathrooms: 1,
    maxOccupants: 3,
    images: ['/api/placeholder/400/300'],
    amenities: ['AC', 'Kitchen', 'Study Area', 'Security'],
    propertyType: 'Homestel',
    genderRestriction: 'female',
    isAvailable: true,
    roomTypes: [
      { type: '3 in a room', price: 2200, bedsAvailable: 2, totalBeds: 6 }
    ],
    distanceToCampus: '3 min walk',
    totalBedsAvailable: 2,
    totalBeds: 6,
    priceUnit: 'semester' as const
  },
  {
    id: '3',
    title: "Unity Residence",
    rent: 3500,
    location: "Madina, 8 min drive",
    bedrooms: 2,
    bathrooms: 2,
    maxOccupants: 2,
    images: ['/api/placeholder/400/300'],
    amenities: ['AC', 'Kitchen', 'WiFi', 'Security'],
    propertyType: 'Apartment',
    genderRestriction: 'mixed',
    isAvailable: true,
    roomTypes: [
      { type: '2 in a room', price: 3500, bedsAvailable: 0, totalBeds: 4 }
    ],
    distanceToCampus: '8 min drive',
    totalBedsAvailable: 0,
    totalBeds: 4,
    priceUnit: 'semester' as const
  },
  {
    id: '4',
    title: "Scholars Haven",
    rent: 3200,
    location: "Dzorwulu, 6 min walk",
    bedrooms: 1,
    bathrooms: 1,
    maxOccupants: 1,
    images: ['/api/placeholder/400/300'],
    amenities: ['AC', 'Kitchen', 'WiFi', 'Laundry'],
    propertyType: 'Hostel',
    genderRestriction: 'female',
    isAvailable: true,
    roomTypes: [
      { type: '1 in a room', price: 3200, bedsAvailable: 1, totalBeds: 2 }
    ],
    distanceToCampus: '6 min walk',
    totalBedsAvailable: 1,
    totalBeds: 2,
    priceUnit: 'semester' as const
  },
  {
    id: '5',
    title: "Metro Student Hub",
    rent: 1800,
    location: "Cantonment, 12 min drive",
    bedrooms: 4,
    bathrooms: 2,
    maxOccupants: 4,
    images: ['/api/placeholder/400/300'],
    amenities: ['Kitchen', 'WiFi', 'Study Area'],
    propertyType: 'Homestel',
    genderRestriction: 'male',
    isAvailable: true,
    roomTypes: [
      { type: '4 in a room', price: 1800, bedsAvailable: 3, totalBeds: 16 }
    ],
    distanceToCampus: '12 min drive',
    totalBedsAvailable: 3,
    totalBeds: 16,
    priceUnit: 'semester' as const
  },
  {
    id: '6',
    title: "Green Valley Hostel",
    rent: 2600,
    location: "Asylum Down, 4 min walk",
    bedrooms: 3,
    bathrooms: 2,
    maxOccupants: 3,
    images: ['/api/placeholder/400/300'],
    amenities: ['AC', 'Kitchen', 'WiFi', 'Security'],
    propertyType: 'Hostel',
    genderRestriction: 'mixed',
    isAvailable: true,
    roomTypes: [
      { type: '3 in a room', price: 2600, bedsAvailable: 1, totalBeds: 9 }
    ],
    distanceToCampus: '4 min walk',
    totalBedsAvailable: 1,
    totalBeds: 9,
    priceUnit: 'semester' as const
  }
];

const EnhancedPropertyCardsDemo: React.FC = () => {
  const handleViewDetails = (id: string) => {
    console.log('View details for property:', id);
  };

  const handleViewStory = (id: string) => {
    console.log('View story for property:', id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-width-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced ROOMi Property Cards
          </h1>
          <p className="text-gray-600">
            Demonstrating the new property card design with Ghana student housing context, 
            real-time bed availability, and Solar icons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockGhanaHostels.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              rent={property.rent}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              maxOccupants={property.maxOccupants}
              images={property.images}
              amenities={property.amenities}
              propertyType={property.propertyType}
              genderRestriction={property.genderRestriction}
              isAvailable={property.isAvailable}
              roomTypes={property.roomTypes}
              distanceToCampus={property.distanceToCampus}
              totalBedsAvailable={property.totalBedsAvailable}
              totalBeds={property.totalBeds}
              priceUnit={property.priceUnit}
              onViewDetails={() => handleViewDetails(property.id)}
              onViewStory={() => handleViewStory(property.id)}
              showActions={true}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Key Features Demonstrated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Enhanced Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Increased card height (280px) for better image visibility</li>
                <li>• Real-time bed availability with color coding</li>
                <li>• Ghana-specific pricing in GHS (¢)</li>
                <li>• Room types in "X in a room" format</li>
                <li>• Distance to campus display</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">ROOMi Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gender-specific housing indicators</li>
                <li>• Solar icons for amenities</li>
                <li>• Semester-based pricing</li>
                <li>• Property type badges (Hostel/Homestel/Apartment)</li>
                <li>• Story view functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPropertyCardsDemo;
