
import React from 'react';
import { Link } from 'react-router-dom';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

// Mock property data
const propertyList = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    address: '123 University Road, East Legon, Accra',
    price: 850,
    priceUnit: 'month',
    status: 'Available',
    occupancy: '0/1',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    address: '456 College Avenue, Legon, Accra',
    price: 500,
    priceUnit: 'month',
    status: 'Partially Occupied',
    occupancy: '1/2',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    price: 950,
    priceUnit: 'semester',
    status: 'Fully Occupied',
    occupancy: '5/5',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
  }
];

const Properties: React.FC = () => {
  return (
    <OwnerLayout pageTitle="My Properties">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Total Properties: {propertyList.length}</h2>
            <p className="text-sm text-gray-500">Manage your property listings</p>
          </div>
          <Link to="/owner/property/new">
            <Button><Plus className="mr-2 h-4 w-4" />Add New Property</Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {propertyList.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'Available' ? 'bg-green-100 text-green-800' : 
                    property.status === 'Partially Occupied' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h3 className="font-semibold truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{property.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${property.price}</span>
                    <span className="text-sm text-gray-500">per {property.priceUnit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type: {property.type}</span>
                    <span>Occupancy: {property.occupancy}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>
                <Link to={`/owner/property/${property.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
};

export default Properties;
