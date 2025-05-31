
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import { usePropertyLoader } from '@/hooks/property/usePropertyLoader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageWithFallback from '@/components/common/ImageWithFallback';

const EnhancedStoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = usePropertyLoader(id);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Property story not found. The property may have been removed or the URL is incorrect.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/student/properties')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate(`/student/property/${id}`)}
            variant="ghost"
            className="flex items-center mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600">{property.address}, {property.city}</p>
            </div>

            {/* Enhanced Story Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <ImageWithFallback
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No images available for this property story.</p>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Bedrooms</span>
                  <p className="font-medium">{property.bedrooms}</p>
                </div>
                <div>
                  <span className="text-gray-500">Bathrooms</span>
                  <p className="font-medium">{property.bathrooms}</p>
                </div>
                <div>
                  <span className="text-gray-500">Max Occupants</span>
                  <p className="font-medium">{property.maxOccupants}</p>
                </div>
                <div>
                  <span className="text-gray-500">Property Type</span>
                  <p className="font-medium">{property.propertyType}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-gray-500 text-sm">Description</span>
                <p className="mt-1">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-500 text-sm">Amenities</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <StudentNavBar />
    </div>
  );
};

export default EnhancedStoryPage;
