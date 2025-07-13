
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
      title: '',
      type: '',
      propertyCategory: 'Hostel',
      address: '',
      city: '',
      region: 'Greater Accra',
      zip: '',
      price: 0,
      price_unit: 'semester',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      all_inclusive: false,
      status: 'Available',
      verification_status: 'pending',
      gender_restriction: 'mixed',
      pet_policy: 'not_allowed',
      parking_available: false,
      has_accessibility_features: false,
      cancellation_policy: 'moderate',
      internet_speed: 'standard',
      ...initialData
    },
  });

  const propertyCategory = form.watch('propertyCategory');

  // Show structure modal when switching to structure tab
  useEffect(() => {
    if (activeTab === 'structure' && !showStructureModal) {
      setShowStructureModal(true);
    }
  }, [activeTab]);

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

  const handleSubmit = (data: PropertyFormValues) => {
    setShowPreview(true);
  };

  const handleConfirmSubmission = () => {
    const formData = form.getValues();
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
            </TabsContent>

            <TabsContent value="rooms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Room types, pricing, and utilities</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RoomConfigurationFields form={form} propertyCategory={propertyCategory} />

                  {/* Category-specific fields */}
                  {propertyCategory === 'Hostel' && <HostelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />}
                  {propertyCategory === 'Homestel' && <HomestelFields form={form} updateOccupancyDetails={updateOccupancyDetails} />}
                  {propertyCategory === 'Apartment' && <ApartmentFields form={form} />}
                </CardContent>
              </Card>
            </TabsContent>



            <TabsContent value="amenities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <AmenitiesSelector form={form} />
                </CardContent>
              </Card>
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
