// Enhanced Booking Form for ROOMi Ghana Hostel Bookings
// Integrates with BookingService and Paystack payment processing

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/types/property';
import { useEnhancedBooking } from '@/hooks/booking/useEnhancedBooking';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';

// Import step components (mobile-first)
import StudentInfoStep from './steps/mobile/StudentInfoStep';
import DateSelectionStep from './steps/DateSelectionStep';
import RoomAndPreferencesStep from './steps/mobile/RoomAndPreferencesStep';
import VerificationStep from './steps/VerificationStep';
import PaymentStep from './PaymentStep';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import ResponsiveBookingLayout from './ResponsiveBookingLayout';
import BookingSummarySidebar from './BookingSummarySidebar';


interface EnhancedBookingFormProps {
  property: Property;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
}

// Interface moved to useEnhancedBooking hook

const STEPS = [
  { id: 1, title: 'Your Info', icon: Users },
  { id: 2, title: 'Stay Details', icon: Calendar },
  { id: 3, title: 'Room & Preferences', icon: Users },
  { id: 4, title: 'Verification', icon: CheckCircle },
  { id: 5, title: 'Payment', icon: CreditCard }
];

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  property,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();

  // Use our enhanced booking hook
  const {
    formData,
    currentStep,

    pricing,
    updateFormData,
    recomputePricing,
    nextStep,
    previousStep,
    validateStep,
    createBooking,
    createBookingWithPayment
  } = useEnhancedBooking(property);

  const [isVerifying, setIsVerifying] = useState(false);

  // Handler functions

  const handleDateChange = (field: string, value: Date | string) => {
    updateFormData(field, value);
  };

  const handleRoomOptionChange = (field: string, value: string) => {
    updateFormData(field, value);
  };

  const handleRoomTypeSelect = (value: string, price: number) => {
    updateFormData('roomType', value);
    recomputePricing(price);
  };



  const handleVerificationChange = (field: string, value: string | File | boolean) => {
    updateFormData(field, value);
  };

  const handleVerifyStudent = async () => {
    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateFormData('verified', true);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handlePaymentProceed = async () => {
    const bookingId = await createBooking();

    if (bookingId) {
      // Here you would integrate with Paystack payment
      // For now, we'll simulate success
      if (onSuccess) {
        onSuccess(bookingId);
      } else {
        navigate(`/student/booking-confirmation?id=${bookingId}`);
      }
    }
  };

  const handlePaymentVerified = async (payment: { reference: string; channel?: string; id?: number; metadata?: Record<string, unknown> }) => {
    const bookingId = await createBookingWithPayment(payment);
    if (bookingId) {
      if (onSuccess) {
        onSuccess(bookingId);
      } else {
        navigate(`/student/booking-confirmation?id=${bookingId}`);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StudentInfoStep
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            phone={formData.phone}
            emergencyName={formData.emergencyName}
            emergencyPhone={formData.emergencyPhone}
            emergencyRelationship={formData.emergencyRelationship}
            onFieldChange={(field, value) => updateFormData(field as any, value as any)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <DateSelectionStep
            startDate={formData.startDate}
            endDate={formData.endDate}
            selectedDuration={formData.duration}
            onStartDateChange={(date) => handleDateChange('startDate', date)}
            onEndDateChange={(date) => handleDateChange('endDate', date)}
            onDurationChange={(duration) => handleDateChange('duration', duration)}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <RoomAndPreferencesStep
            selectedRoomType={formData.roomType}
            extraRequests={formData.extraRequests}
            onRoomTypeChange={(value: string) => handleRoomOptionChange('roomType', value)}
            onRoomTypeSelect={handleRoomTypeSelect}
            onRequestsChange={(value: string) => handleRoomOptionChange('extraRequests', value)}
            preferences={{
              studyHabits: formData.studyHabits,
              sleepSchedule: formData.sleepSchedule,
              cleanliness: formData.cleanliness,
              socialPreference: formData.socialPreference,
              hobbies: formData.hobbies,
              dietary: formData.dietary,
              smoking: formData.smoking,
              noiseSensitivity: formData.noiseSensitivity
            }}
            onPreferenceChange={(field, value) => updateFormData(field as any, value as any)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            propertyId={property.id}
            propertyCategory={property.property_category}
          />
        );
      case 4:
        return (
          <VerificationStep
            idType={formData.idType}
            studentId={formData.studentId}
            university={formData.university}
            program={formData.program}
            onInputChange={handleVerificationChange}
            onFileUpload={(file) => updateFormData('idImage', file)}
            onVerify={handleVerifyStudent}
            isVerifying={isVerifying}
            verified={formData.verified}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <PaymentStep
            totalAmount={pricing.totalAmount}
            onPaymentMethodSelect={(method) => updateFormData('paymentMethod', method)}
            termsAgreed={formData.termsAgreed}
            onTermsChange={(agreed) => updateFormData('termsAgreed', agreed)}
            onPaymentProceed={handlePaymentProceed}
            onPaymentVerified={handlePaymentVerified}
            onPrevious={handlePrevious}
            paystackMetadata={{
              commission_breakdown: centralizedCommissionEngine.calculateCommissions(
                pricing.propertyRent,
                Boolean(property.agent_id)
              ),
              base_amount_ghs: pricing.propertyRent,
              total_amount_ghs: pricing.totalAmount,
              platform_fee_ghs: pricing.platformCommission + pricing.platformFixedFee,
              agent_fee_ghs: pricing.agentFee,
              commission_version: centralizedCommissionEngine.getConfigurationInfo().version,
              property_id: property.id,
              propertyTitle: property.title || property.name,
              propertyCoverImage: (() => {
                // Prefer cover media marked as cover
                const media = Array.isArray(property.media) ? property.media : [];
                const cover = media.find((m: any) => m && m.isCover && m.type === 'image' && typeof m.url === 'string' && m.url.trim());
                if (cover?.url) return cover.url as string;
                // Then try a direct image_url field if present
                const direct = (property as any).image_url;
                if (typeof direct === 'string' && direct.trim()) return direct;
                // Finally, fallback to first valid string in images array
                const imgs = Array.isArray(property.images)
                  ? property.images
                  : (typeof (property as any).images === 'string' ? [(property as any).images] : []);
                const valid = imgs.find((img: any) => typeof img === 'string' && img.trim() && !img.includes('blob:') && !img.includes('localhost'));
                return valid || '';
              })()
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto md:px-4 md:py-4">
      {/* Header (desktop only) */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center gap-4 mb-4">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Book {property.title}</h1>
            <p className="text-gray-600">{property.address}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle size={20} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveBookingLayout
        property={property}
        sidebar={
          <BookingSummarySidebar
            property={property}
            pricing={pricing}
            formData={formData}
            currentStep={currentStep}
          />
        }
      >
        {/* Mobile: render step edge-to-edge without Card */}
        <div className="md:hidden">
          {renderStep()}
        </div>
        {/* Desktop: render inside Card */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </ResponsiveBookingLayout>
    </div>
  );
};

export default EnhancedBookingForm;
