
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { propertyFormSchema, PropertyFormValues } from './PropertyFormSchema';
import PropertyTypeFields from './PropertyTypeFields';
import LocationFields from './LocationFields';
import PropertyDetailsFields from './PropertyDetailsFields';
import PricingFields from './PricingFields';
import RoomFeaturesFields from './RoomFeaturesFields';
import AmenitiesSelector from './AmenitiesSelector';
import DescriptionFields from './DescriptionFields';
import MediaUploadTabs from './MediaUploadTabs';
import FormSubmissionModal from './FormSubmissionModal';
import BuildingStructureFields from './BuildingStructureFields';
import EnhancedPropertyFields from './EnhancedPropertyFields';

// Category-specific components
import HostelFields from './HostelFields';
import HomestelFields from './HomestelFields';
import ApartmentFields from './ApartmentFields';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<PropertyFormValues>;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialData 
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

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
    
    return { completed: completedSteps, total: 7 };
  };

  const stepProgress = getCurrentStepCount();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Add New Property</h2>
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
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Property Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PropertyTypeFields form={form} />
                  <PricingFields form={form} propertyCategory={propertyCategory} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationFields form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <PropertyDetailsFields form={form} />
                  
                  {/* Category-specific fields */}
                  {propertyCategory === 'Hostel' && <HostelFields form={form} />}
                  {propertyCategory === 'Homestel' && <HomestelFields form={form} />}
                  {propertyCategory === 'Apartment' && <ApartmentFields form={form} />}
                  
                  <DescriptionFields form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Features & Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RoomFeaturesFields form={form} propertyCategory={propertyCategory} />
                  
                  {/* Multi-level building structure - Premium feature */}
                  <div className="mt-8">
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Advanced Property Structure</h3>
                        <Badge variant="secondary">Premium Feature</Badge>
                      </div>
                      <BuildingStructureFields form={form} propertyCategory={propertyCategory} />
                    </div>
                  </div>
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

            <TabsContent value="enhanced" className="space-y-6">
              <EnhancedPropertyFields form={form} propertyCategory={propertyCategory} />
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
                  const currentIndex = ['basic', 'location', 'details', 'features', 'amenities', 'enhanced', 'media'].indexOf(activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(['basic', 'location', 'details', 'features', 'amenities', 'enhanced', 'media'][currentIndex - 1]);
                  }
                }}
                disabled={activeTab === 'basic'}
              >
                Previous
              </Button>
              
              {activeTab !== 'media' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = ['basic', 'location', 'details', 'features', 'amenities', 'enhanced', 'media'].indexOf(activeTab);
                    if (currentIndex < 6) {
                      setActiveTab(['basic', 'location', 'details', 'features', 'amenities', 'enhanced', 'media'][currentIndex + 1]);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Preview & Submit'}
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
      />
    </>
  );
};

export default PropertyForm;
