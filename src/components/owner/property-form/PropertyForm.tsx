
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { propertyFormSchema, PropertyFormValues } from './PropertyFormSchema';
// New restructured components
import PropertyInfoFields from './PropertyInfoFields';
import RoomConfigurationFields from './RoomConfigurationFields';
import AmenitiesSelector from './AmenitiesSelector';
import { MediaUploadFields } from './MediaUploadFields';
import FormSubmissionModal from './FormSubmissionModal';
// ✅ REMOVED: BuildingStructureFields, BuildingStructureManager, StructureTabModal, BuildingCreatorGatingModal
// Structure type is now determined by IntelligentPropertyRouter only
// Intelligent Property Router
import { IntelligentPropertyRouter } from '@/components/owner/IntelligentPropertyRouter';
// Enhanced toast utilities
import { showValidationErrorToast, showPropertyFormToasts } from '@/utils/toast';

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
import { Textarea } from '@/components/ui/textarea';

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
  // ✅ REMOVED: showStructureModal, gatingOpen, requiresStructure - no longer needed

  // ✅ INTELLIGENT ROUTER STATE
  const [showRouter, setShowRouter] = useState(!isEdit); // Show router for new properties only
  const [routerResult, setRouterResult] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

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
      price: undefined,
      room_type_pricing: {}, // Dynamic pricing matrix
      price_unit: 'semester',

      description: '',
      bedrooms: undefined,
      bathrooms: undefined,
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
  // Ensure booking_duration defaults match category without overriding user choice
  useEffect(() => {
    const current = form.getValues('booking_duration') as any;
    // RHF dirty check – avoid overriding explicit user selections
    const dirty = (form.formState?.dirtyFields as any)?.booking_duration;

    if (propertyCategory === 'Homestel') {
      if (!current || (!dirty && current === 'semester')) {
        form.setValue('booking_duration', 'month' as any, { shouldDirty: false, shouldValidate: true });
        form.setValue('price_unit', 'month' as any, { shouldDirty: false });
      }
    } else if (propertyCategory === 'Hostel') {
      if (!current || (!dirty && current === 'month')) {
        form.setValue('booking_duration', 'semester' as any, { shouldDirty: false, shouldValidate: true });
        form.setValue('price_unit', 'semester' as any, { shouldDirty: false });
      }
    }
  }, [propertyCategory]);

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

  // ✅ REMOVED: Structure modal useEffect - no longer needed

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

  // Intelligent tab navigation for validation errors
  const navigateToErrorTab = (errorType: string) => {
    const tabMapping = {
      'Room Types': 'rooms',
      'Room Types Mismatch': 'rooms',
      'Property Title': 'info',
      'Address': 'info',
      'Nearest University': 'info',
      'Description': 'info',
      'Pricing': 'rooms',
      'Incomplete Pricing': 'rooms',
      'Total Rooms': 'rooms',
      'Bathrooms': 'rooms',
      'Washroom Location': 'rooms',
      'Washroom Sharing': 'rooms'
    };

    const targetTab = tabMapping[errorType as keyof typeof tabMapping];
    if (targetTab && targetTab !== activeTab) {
      setActiveTab(targetTab);
      // Show navigation toast
      showValidationErrorToast("Navigation", `Switched to ${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)} tab to fix the issue.`);
    }
  };

  const handleSubmit = (data: PropertyFormValues) => {
    console.log('🚀 PROPERTY FORM SUBMIT CALLED', { isEdit, data });

    // FOR EDIT MODE - STILL VALIDATE BUT WITH RELAXED RULES
    if (isEdit) {
      console.log('🚀 EDIT MODE - VALIDATING WITH RELAXED RULES');

      // Basic validation for edit mode
      const errors = [];

      if (!data.title?.trim()) {
        errors.push("Property Title");
        showValidationErrorToast("Property Title", "Please enter a title for your property.");
        navigateToErrorTab("Property Title");
      }

      if (!data.address?.trim()) {
        errors.push("Address");
        showValidationErrorToast("Address", "Please enter the property address.");
        navigateToErrorTab("Address");
      }

      // If there are validation errors in edit mode, don't proceed
      if (errors.length > 0) {
        console.log('🚨 EDIT MODE VALIDATION ERRORS FOUND', errors);
        showValidationErrorToast("Form Incomplete", `Please complete all required fields. Found ${errors.length} issue(s).`);
        return;
      }

      console.log('🚀 EDIT MODE - VALIDATION PASSED, CALLING onSubmit');
      onSubmit(data);
      return;
    }

    // Enhanced validation with immediate toast feedback and intelligent navigation
    const errors = [];
    // const propertyCategoryForValidation = data.propertyCategory;

    // Validate basic required fields
    console.log('🚀 VALIDATING FIELDS', { title: data.title, address: data.address, description: data.description });

    let focused = false;
    if (!data.title) {
      console.log('🚨 TITLE MISSING');
      errors.push("Property Title");
      showValidationErrorToast("Property Title", "Please enter a title for your property.");
      navigateToErrorTab("Property Title");
      if (!focused) { form.setFocus('title' as any); focused = true; }
    }

    if (!data.address) {
      console.log('🚨 ADDRESS MISSING');
      errors.push("Address");
      showValidationErrorToast("Address", "Please enter the property address.");
      navigateToErrorTab("Address");
      if (!focused) { form.setFocus('address' as any); focused = true; }
    }

    if (!data.description || data.description.length < 10) {
      console.log('🚨 DESCRIPTION MISSING OR TOO SHORT');
      errors.push("Description");
      showValidationErrorToast("Description", "Please provide a description of at least 10 characters.");
      navigateToErrorTab("Description");
      if (!focused) { form.setFocus('description' as any); focused = true; }
    }

    // If there are validation errors, don't proceed to preview
    if (errors.length > 0) {
      console.log('🚨 VALIDATION ERRORS FOUND', errors);
      showValidationErrorToast("Form Incomplete", `Please complete all required fields. Found ${errors.length} issue(s).`);
      // DO NOT RESET FORM - KEEP USER DATA
      return;
    }

    // All validation passed, show preview
    setShowPreview(true);
  };

  const handleConfirmSubmission = () => {
    const formData = form.getValues();

    // Clear saved form data on successful submission
    if (!isEdit) {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }

    onSubmit(formData);
    setShowPreview(false);
  };

  // ✅ INTELLIGENT ROUTER HANDLER
  const handleRouterComplete = (result: any) => {
    console.log('🧠 Router Result:', result);

    // Store router result
    setRouterResult(result);

    // ✅ COMPOUND ROUTING: Redirect to dedicated compound creation page
    if (result.structureType === 'compound') {
      toast({
        title: "Compound Management",
        description: "Redirecting to compound creation workflow...",
      });

      // Navigate to compound creation page (will be created next)
      navigate('/owner/compounds/new', {
        state: { routerResult: result }
      });
      return;
    }

    // Auto-fill form based on router result
    const propertyType = result.propertyType as 'hostel' | 'homestel' | 'apartment';
    const propertyCategory = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);

    form.setValue('type', propertyType);
    form.setValue('propertyCategory', propertyCategory as any);

    // ✅ SAVE STRUCTURE TYPE TO FORM (will be persisted to database)
    form.setValue('structure_type' as any, result.structureType);

    // Close router and show form
    setShowRouter(false);

    toast({
      title: "Setup Complete",
      description: result.recommendedSetup,
    });
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
      {/* ✅ INTELLIGENT PROPERTY ROUTER */}
      <IntelligentPropertyRouter
        isOpen={showRouter}
        onClose={() => setShowRouter(false)}
        onComplete={handleRouterComplete}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="mx-auto max-w-[794px] px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6 sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b py-4 px-1">
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
                <Badge variant="outline" className="text-green-600 border-green-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  All changes saved
                </Badge>
              )}
            </div>

	          {/* Progress bar */}
	          <div className="mt-2">
	            <div className="w-full h-2 rounded-full bg-neutral-200">
	              <div
	                className="h-2 rounded-full bg-primary"
	                style={{ width: `${Math.round((stepProgress.completed / stepProgress.total) * 100)}%` }}
	              />
	            </div>
	          </div>

          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex border-b border-[#dbe0e6] px-1 md:px-2 gap-6 md:gap-8">
              {/* ✅ REMOVED 'structure' TAB - Structure type is determined by IntelligentPropertyRouter */}
              {(['info','rooms','amenities','media'] as const).map((tab) => {
                const hasError = tab === 'info'
                  ? (form.formState.errors.title || form.formState.errors.address || form.formState.errors.description || (form.formState.errors as any).nearest_university)
                  : tab === 'rooms'
                    ? (form.formState.errors.room_types || form.formState.errors.bedrooms || form.formState.errors.bathrooms || form.formState.errors.washroom_location || form.formState.errors.washroom_sharing)
                    : false;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative -mb-[1px] pb-3 text-sm font-semibold border-b-[3px] ${
                      activeTab === tab ? 'border-b-primary text-primary' : 'border-b-transparent text-[#617589] hover:text-gray-900'
                    }`}
                  >
                    {tab === 'info' ? 'Property Info' : tab === 'rooms' ? 'Room Config' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {hasError && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

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

              {/* House Rules Field (owners often missed this) */}
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="house_rules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rules and guidelines</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="e.g., No loud music after 10pm; Visitors must leave by 9pm; Keep shared areas clean"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>



            {/* ✅ REMOVED Structure TabsContent - Structure type determined by IntelligentPropertyRouter */}

            <TabsContent value="media" className="space-y-6">
              <MediaUploadFields form={form} />
            </TabsContent>
          </Tabs>

          <div className="border-t sticky bottom-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-4">
            <div className="mx-auto max-w-[794px] px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ['info', 'rooms', 'amenities', 'media'] as const;
                  const currentIndex = tabs.indexOf(activeTab as any);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1]);
                  }
                }}
                disabled={activeTab === 'info'}
              >
                Previous
              </Button>
            </div>

            <div className="flex items-center space-x-3">

              {activeTab !== 'media' ? (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      const tabs = ['info', 'rooms', 'amenities', 'media'] as const;
                      const currentIndex = tabs.indexOf(activeTab as any);
                      const next = tabs[currentIndex + 1];
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(next);
                      }
                    }}
                  >
                    Next
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="ml-2"
                    onClick={() => {
                      const draft = form.getValues();
                      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(draft));
                      showPropertyFormToasts.formSaved();
                    }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      console.log('🚀 UPDATE BUTTON CLICKED');
                      // Force form submission
                      const formData = form.getValues();
                      console.log('🚀 FORCING FORM SUBMIT WITH DATA', formData);
                      handleSubmit(formData);
                    }}
                  >
                    {isLoading ? 'Saving...' : isEdit ? 'Update Property' : 'Preview & Submit'}
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => {
                    console.log('🚀 MEDIA TAB UPDATE BUTTON CLICKED');
                    // Force form submission
                    const formData = form.getValues();
                    console.log('🚀 FORCING FORM SUBMIT WITH DATA', formData);
                    handleSubmit(formData);
                  }}
                >
                  {isLoading ? 'Saving...' : isEdit ? 'Update Property' : 'Preview & Submit'}
                </Button>
              )}
            </div>
          </div>
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

      {/* ✅ REMOVED: StructureTabModal and BuildingCreatorGatingModal - no longer needed */}
    </>
  );
};

export default PropertyForm;
