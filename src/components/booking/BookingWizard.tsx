
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Users, CreditCard, Info } from 'lucide-react';
import { Property } from '@/types/property';

interface BookingWizardProps {
  property: Property;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ property }) => {
  const navigate = useNavigate();

  const handleStartBooking = () => {
    // Navigate to the booking steps container
    navigate(`/student/book/${property.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Good to Know Alert */}
      {property.good_to_know && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Good to Know</AlertTitle>
          <AlertDescription>
            {property.good_to_know}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Book {property.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Choose Dates</p>
                <p className="text-sm text-gray-600">Select move-in and move-out dates</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Room Selection</p>
                <p className="text-sm text-gray-600">Pick your preferred room type</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-gray-600">Complete your booking safely</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-semibold">₵{property.rent?.toLocaleString() || property.price || '0'}</p>
                <p className="text-sm text-gray-600">per semester</p>
              </div>
              <Button onClick={handleStartBooking} size="lg">
                Start Booking Process
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingWizard;
