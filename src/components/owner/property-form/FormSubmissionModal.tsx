
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PropertyFormValues } from './PropertyFormSchema';
import { CheckCircle, MapPin, Calendar, DollarSign, Users, Home, Wifi, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FormSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: PropertyFormValues | null;
  isEdit: boolean;
  isLoading: boolean;
}

const FormSubmissionModal: React.FC<FormSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isEdit,
  isLoading
}) => {
  if (!formData) return null;

  const getOccupancyInfo = () => {
    if (formData.propertyCategory === 'Hostel') {
      return `${formData.beds_available || 0} beds available`;
    } else if (formData.propertyCategory === 'Homestel') {
      return `${formData.rooms_available || 0} rooms available`;
    } else {
      return `Max ${formData.max_occupants || 0} occupants`;
    }
  };

  const getAmenities = () => {
    const amenitiesList = formData.amenities?.split('\n').filter(Boolean) || [];
    return amenitiesList.slice(0, 6); // Show first 6 amenities
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            {isEdit ? 'Update Property Listing?' : 'Create Property Listing?'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-6">
              <p className="text-gray-600">
                Here's how your property listing will appear to students:
              </p>
              
              {/* Property Card Preview */}
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Cover Image */}
                {formData.image_url && (
                  <div className="aspect-video w-full">
                    <img
                      src={formData.image_url}
                      alt="Property cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/800x450?text=Property+Image";
                      }}
                    />
                  </div>
                )}
                
                {/* Property Details */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{formData.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{formData.city}, {formData.region}</span>
                      </div>
                      {formData.landmark && (
                        <p className="text-sm text-gray-500 mt-1">Near {formData.landmark}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ₵{formData.price?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per {formData.price_unit}</div>
                    </div>
                  </div>

                  {/* Property Type & Occupancy */}
                  <div className="flex gap-4 items-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {formData.propertyCategory} - {formData.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {getOccupancyInfo()}
                    </div>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                    <div className="text-center">
                      <div className="font-semibold">{formData.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{formData.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    {formData.distance_to_campus && (
                      <div className="text-center">
                        <div className="font-semibold text-sm">{formData.distance_to_campus}</div>
                        <div className="text-sm text-gray-600">To Campus</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-semibold">{formData.status}</div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  {getAmenities().length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {getAmenities().map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {formData.amenities?.split('\n').filter(Boolean).length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.amenities.split('\n').filter(Boolean).length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description Preview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {formData.description}
                    </p>
                  </div>

                  {/* Pricing Details */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Pricing Information</span>
                    </div>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>Base Price: ₵{formData.price?.toLocaleString()} per {formData.price_unit}</div>
                      {formData.propertyCategory !== 'Hostel' && formData.advance_payment_months && (
                        <div>Advance Payment: {formData.advance_payment_months} months required</div>
                      )}
                      {formData.all_inclusive && (
                        <div>✓ All utilities included in price</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {isEdit 
                    ? 'This will update your existing property listing. Students will see the updated information immediately.'
                    : 'Once created, your property will be visible to students searching for accommodation. You can edit or deactivate it anytime from your dashboard.'
                  }
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading 
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update Property' : 'Create Property')
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSubmissionModal;
