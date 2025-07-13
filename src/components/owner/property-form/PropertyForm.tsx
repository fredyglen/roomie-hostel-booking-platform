
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { propertyFormSchema, PropertyFormValues } from './PropertyFormSchema';
// New restructured components
import PropertyInfoFields from './PropertyInfoFields';
import RoomConfigurationFields from './RoomConfigurationFields';
import AmenitiesSelector from './AmenitiesSelector';
import BuildingStructureFields from './BuildingStructureFields';
import MediaUploadTabs from './MediaUploadTabs';
import FormSubmissionModal from './FormSubmissionModal';
import BuildingStructureManager from '../BuildingStructureManager';
import StructureTabModal from '../StructureTabModal';

// BE CONSCIOUS: New enhanced components for comprehensive form improvements
import BookingDurationFields from './BookingDurationFields';
import DynamicPricingMatrix from './DynamicPricingMatrix';
import SmartWashroomConfig from './SmartWashroomConfig';
import CriticalFieldsRestoration from './CriticalFieldsRestoration';
import TagBasedAmenitiesSelector from './TagBasedAmenitiesSelector';
import PropertySubmissionWorkflow from './PropertySubmissionWorkflow';

// Category-specific components
import HostelFields from './HostelFields';
import HomestelFields from './HomestelFields';
import ApartmentFields from './ApartmentFields';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<PropertyFormValues>;
  isEdit?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData,
  isEdit = false 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showStructureModal, setShowStructureModal] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      title: '',
      type: 'hostel', // Fixed: set default type to match schema
      propertyCategory: 'Hostel',
      address: '',
      city: '',
      state: 'Greater Accra', // Fixed: added state field
      region: 'Greater Accra',
      zip: '',
      nearest_university: '',

      // BE CONSCIOUS: Enhanced booking duration and pricing system
      booking_duration: 'semester', // Ghana university standard
      custom_duration_weeks: undefined,
      price: 0,
      room_type_pricing: {}, // Dynamic pricing matrix
      price_unit: 'semester',

      description: '',
      bedrooms: 1,
      bathrooms: 1,
      all_inclusive: false,
      status: 'available', // Fixed: lowercase to match schema
      verification_status: 'pending',

      // BE CONSCIOUS: Critical fields restoration - Ghana university compliance
      gender_restriction: 'mixed', // Essential for university housing compliance
      semester_availability: ['semester_1', 'semester_2'], // Ghana academic calendar

      pet_policy: 'not_allowed',
      parking_available: false,
      has_accessibility_features: false,
      cancellation_policy: 'moderate',
      internet_speed: 'standard',
      room_types: ['1_in_a_room'],

      // BE CONSCIOUS: Redesigned washroom configuration
      washroom_location: undefined,
      washroom_sharing: undefined,
      people_per_washroom: undefined,

      ...initialData
    },
  });

  const propertyCategory = form.watch('propertyCategory');

  // Form persistence constants
  const FORM_STORAGE_KEY = 'roomi_property_form_draft';

  // BE CONSCIOUS: Clear any legacy localStorage data with invalid status values
  useEffect(() => {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.status === 'Available' || parsedData.status === 'Partially Occupied' || parsedData.status === 'Fully Occupied') {
          console.log('🧹 Clearing legacy localStorage data with invalid status values');
          localStorage.removeItem(FORM_STORAGE_KEY);
        }
      } catch (error) {
        localStorage.removeItem(FORM_STORAGE_KEY);
      }
    }
  }, []);

  // Watch all form values for auto-save
  const formValues = form.watch();

  // Show structure modal when switching to structure tab
  useEffect(() => {
    if (activeTab === 'structure' && !showStructureModal) {
      setShowStructureModal(true);
    }
  }, [activeTab]);

  // Auto-save form data to localStorage (only for new properties, not edits)
  useEffect(() => {
    if (!isEdit && formValues) {
      // Only save if there's meaningful data (not just default values)
      const hasData = formValues.title || formValues.name || formValues.address || formValues.description;
      if (hasData) {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formValues));
      }
    }
  }, [formValues, isEdit]);

  // Restore saved form data on component mount (only for new properties)
  useEffect(() => {
    if (!isEdit && !initialData) {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);

          // BE CONSCIOUS: Sanitize and validate restored data
          const sanitizedData = {
            ...parsedData,
            // Fix any legacy capitalized status values
            status: parsedData.status === 'Available' ? 'available' :
                   parsedData.status === 'Partially Occupied' ? 'unavailable' :
                   parsedData.status === 'Fully Occupied' ? 'unavailable' :
                   parsedData.status || 'available',
            // Ensure type field is valid
            type: parsedData.type || 'hostel',
            // Ensure state field exists
            state: parsedData.state || 'Greater Accra'
          };

          // Reset form with sanitized data, keeping current defaults for missing fields
          form.reset({
            ...form.getValues(), // Keep current defaults
            ...sanitizedData // Override with sanitized saved data
          });
        } catch (error) {
          console.error('Failed to restore saved form data:', error);
          localStorage.removeItem(FORM_STORAGE_KEY);
        }
      }
    }
  }, [isEdit, initialData, form]);

  // Calculate occupancy details based on property type
  const updateOccupancyDetails = () => {
    const category = form.getValues("propertyCategory");
    const totalRooms = form.getValues("total_rooms") || 0;
    const roomsAvailable = form.getValues("rooms_available") || 0;
    const bedsPerRoom = form.getValues("beds_per_room") || 0;
    const bedsAvailable = form.getValues("beds_available") || 0;
    
    let occupancyText = "";
    
    if (category === "Hostel") {
      occupancyText = `${bedsAvailable}/${totalRooms * bedsPerRoom} beds`;
    } else if (category === "Homestel") {
      occupancyText = `${roomsAvailable}/${totalRooms} rooms`;
    } else {
      // Apartment
      occupancyText = `${form.getValues("max_occupants") || 0} max occupants`;
    }
    
    return occupancyText;
  };

  const handleSubmit = (_data: PropertyFormValues) => {
    setShowPreview(true);
  };

  const handleConfirmSubmission = () => {
    const formData = form.getValues();

    // Clear saved form data on successful submission
    localStorage.removeItem(FORM_STORAGE_KEY);

    onSubmit(formData);
    setShowPreview(false);
  };

  const getCurrentStepCount = () => {
    const formData = form.getValues();
    let completedSteps = 0;
    
    // Basic Info
    if (formData.title && formData.propertyCategory && formData.type) completedSteps++;
    
    // Location
    if (formData.address && formData.city && formData.region) completedSteps++;
    
    // Details & Pricing
    if (formData.price > 0 && formData.price_unit && formData.bedrooms && formData.bathrooms) completedSteps++;
    
    // Description
    if (formData.description && formData.description.length >= 10) completedSteps++;
    
    return { completed: completedSteps, total: 5 };
  };

  const stepProgress = getCurrentStepCount();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
              <p className="text-gray-600">Create a comprehensive listing for your {propertyCategory.toLowerCase()}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline">
                Progress: {stepProgress.completed}/{stepProgress.total}
              </Badge>
              <Badge variant={stepProgress.completed >= 4 ? "default" : "secondary"}>
                {stepProgress.completed >= 4 ? "Ready to Submit" : "In Progress"}
              </Badge>
              {!isEdit && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  📝 Auto-saving
                </Badge>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="info">Property Info</TabsTrigger>
              <TabsTrigger value="rooms">Room Config</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Information</CardTitle>
                  <p className="text-sm text-gray-600">Basic details, location, and description</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PropertyInfoFields form={form} />
                </CardContent>
              </Card>

              {/* BE CONSCIOUS: Critical Fields Restoration */}
              <CriticalFieldsRestoration form={form} propertyCategory={propertyCategory} />
            </TabsContent>

            <TabsContent value="rooms" className="space-y-6">
              {/* BE CONSCIOUS: Booking Duration System */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Duration & Pricing</CardTitle>
                  <p className="text-sm text-gray-600">Configure booking periods and pricing structure</p>
                </CardHeader>
                <CardContent>
                  <BookingDurationFields form={form} propertyCategory={propertyCategory} />
                </CardContent>
              </Card>

              {/* Room Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Room types and basic configuration</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RoomConfigurationFields form={form} propertyCategory={propertyCategory} />

                  {/* BE CONSCIOUS: Dynamic Pricing Matrix - moved below room config */}
                  <DynamicPricingMatrix form={form} propertyCategory={propertyCategory} />

                  {/* Category-specific fields */}
                  {propertyCategory === 'Hostel' && <HostelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />}
                  {propertyCategory === 'Homestel' && <HomestelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />}
                  {propertyCategory === 'Apartment' && <ApartmentFields form={form} />}
                </CardContent>
              </Card>

              {/* BE CONSCIOUS: Washroom Configuration */}
              <SmartWashroomConfig form={form} propertyCategory={propertyCategory} />
            </TabsContent>



            <TabsContent value="amenities" className="space-y-6">
              {/* BE CONSCIOUS: Tag-Based Amenities System */}
              <TagBasedAmenitiesSelector form={form} propertyCategory={propertyCategory} />
            </TabsContent>



            <TabsContent value="structure" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Building Structure</CardTitle>
                  <p className="text-sm text-gray-600">
                    Create detailed building layouts with multiple floors and rooms (Premium Feature)
                  </p>
                </CardHeader>
                <CardContent>
                  <BuildingStructureManager form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <MediaUploadTabs form={form} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentIndex = ['info', 'rooms', 'amenities', 'structure', 'media'].indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(['info', 'rooms', 'amenities', 'structure', 'media'][currentIndex - 1]);
                  }
                }}
                disabled={activeTab === 'info'}
              >
                Previous
              </Button>
              
              {activeTab !== 'media' ? (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      const currentIndex = ['info', 'rooms', 'amenities', 'structure', 'media'].indexOf(activeTab);
                      if (currentIndex < 4) {
                        setActiveTab(['info', 'rooms', 'amenities', 'structure', 'media'][currentIndex + 1]);
                      }
                    }}
                  >
                    Next
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="outline"
                    className="ml-2"
                  >
                    {isLoading ? 'Saving...' : isEdit ? 'Update Property' : 'Preview & Submit'}
                  </Button>
                </>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : isEdit ? 'Update Property' : 'Preview & Submit'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>

      <FormSubmissionModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmSubmission}
        formData={form.getValues()}
        isLoading={isLoading}
        isEdit={isEdit}
      />

      <StructureTabModal
        isOpen={showStructureModal}
        onClose={() => setShowStructureModal(false)}
      />
    </>
  );
};

export default PropertyForm;
