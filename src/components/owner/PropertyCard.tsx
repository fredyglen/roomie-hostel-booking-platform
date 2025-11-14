import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/utils/currency';
import { IMAGE_URLS } from '@/constants/images';
import { PropertyId, PropertyPrice } from '@/types/property';

interface PropertyCardProps {
  property: {
    readonly id: PropertyId | string;
    readonly title: string;
    readonly type: string;
    readonly address: string;
    readonly price: PropertyPrice | number;
    readonly price_unit: string;
    readonly status: string;
    readonly occupancy: string;
    readonly image_url: string;
  };
  onDelete: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Avoid local blob URLs saved in drafts; use only persisted URLs
  const safeImageUrl = property.image_url && property.image_url.startsWith('blob:') ? '' : property.image_url;

  return (
    <Card className="overflow-hidden">
      <div className="h-40 relative bg-gray-100">
        {safeImageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 absolute inset-0">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-sm">Loading...</div>
                </div>
              </div>
            )}
            <img
              src={safeImageUrl}
              alt={property.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.log('🚨 IMAGE LOAD ERROR', safeImageUrl);
                setImageError(true);
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
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
            <span className="font-bold text-lg">{formatCurrency(property.price)}</span>
            <span className="text-sm text-gray-500">per {property.price_unit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Type: {property.type}</span>
            <span>Occupancy: {property.occupancy}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Link to={`/owner/property/${property.id}/view`}>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
        </Link>
        <Link to={`/owner/properties/${property.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" /> Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this property and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(property.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
