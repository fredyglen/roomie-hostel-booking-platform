import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { toast } from '@/hooks/use-toast';
import BookingSteps from '@/components/booking/BookingSteps';
import RoomTypeSelection from '@/components/booking/RoomTypeSelection';
import DurationSelection from '@/components/booking/DurationSelection';
import PersonalInfoForm from '@/components/booking/PersonalInfoForm';
import EmergencyContactForm from '@/components/booking/EmergencyContactForm';
import StudentVerification from '@/components/booking/StudentVerification';
import BookingSummary from '@/components/booking/BookingSummary';
import PaymentOptions from '@/components/booking/PaymentOptions';

// Sample property data for demonstration
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Studio',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    roomTypes: [
      { name: 'Single Room', price: 850, unit: 'month' },
      { name: 'Double Room', price: 1200, unit: 'month' }
    ],
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Shared',
    price: 500,
    priceUnit: 'month',
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    roomTypes: [
      { name: 'Shared Room', price: 500, unit: 'month' },
      { name: 'Private Room', price: 750, unit: 'month' }
    ],
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Hostel',
    price: 950,
    priceUnit: 'semester',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    roomTypes: [
      { name: 'Standard Room', price: 950, unit: 'semester' },
      { name: 'Premium Room', price: 1250, unit: 'semester' },
      { name: 'Executive Room', price: 1500, unit: 'semester' }
    ],
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80'
  }
];

const STEP_LABELS = ["Room", "Date", "Personal", "Emergency", "Verification", "Summary", "Payment"];

const BookProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    roomType: '',
    duration: '1',
    durationType: 'month',
    checkInDate: '',
    fullName: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    idType: 'studentId',
    termsAgreed: false
  });
  
  // Find the property with the matching ID
  const property = sampleProperties.find(p => p.id === id);
  
  // Load saved form data from localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem(`booking_${id}`);
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, [id]);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`booking_${id}`, JSON.stringify(formData));
  }, [formData, id]);
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button variant="primary" onClick={() => navigate('/student/properties')}>
              Browse Properties
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleNext = () => {
    // Validation for different steps
    if (currentStep === 1 && !formData.roomType) {
      toast({
        title: "Please select a room type",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2 && !formData.checkInDate) {
      toast({
        title: "Please select a check-in date",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3 && (!formData.fullName || !formData.phone || !formData.email)) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 6 && !formData.termsAgreed) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 7) {
      // Mock payment processing
      toast({
        title: "Processing Payment...",
        variant: "default"
      });
      
      setTimeout(() => {
        toast({
          title: "Booking Successful!",
          description: "Your booking has been confirmed.",
          variant: "default"
        });
        // Clear the saved form data
        localStorage.removeItem(`booking_${id}`);
        navigate('/student/dashboard');
      }, 1500);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(`/student/property/${id}`);
    }
  };
  
  // Calculate the selected room price
  const selectedRoomType = property.roomTypes.find(room => room.name === formData.roomType);
  const selectedPrice = selectedRoomType ? selectedRoomType.price : property.price;
  const selectedUnit = selectedRoomType ? selectedRoomType.unit : property.priceUnit;
  
  // Calculate total price based on duration
  const totalPrice = selectedPrice * parseInt(formData.duration) + 100 + 50; // Adding security deposit and service fee

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Book {property.title}</h1>
            <p className="text-gray-600">{property.address}</p>
          </div>
          
          {/* Progress Steps */}
          <BookingSteps 
            currentStep={currentStep}
            totalSteps={7}
            stepLabels={STEP_LABELS}
          />
          
          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Step 1: Choose Room Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Choose Room Type</h2>
                <RoomTypeSelection 
                  roomTypes={property.roomTypes}
                  selectedRoomType={formData.roomType}
                  onSelectRoomType={(roomType) => setFormData({...formData, roomType})}
                />
              </div>
            )}
            
            {/* Step 2: Select Duration and Date */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Duration and Date</h2>
                <DurationSelection 
                  duration={formData.duration}
                  durationType={formData.durationType}
                  checkInDate={formData.checkInDate}
                  onInputChange={handleInputChange}
                />
              </div>
            )}
            
            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <PersonalInfoForm 
                  fullName={formData.fullName}
                  phone={formData.phone}
                  email={formData.email}
                  onInputChange={handleInputChange}
                />
              </div>
            )}
            
            {/* Step 4: Emergency Contact */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Emergency Contact</h2>
                <EmergencyContactForm 
                  emergencyContact={formData.emergencyContact}
                  emergencyPhone={formData.emergencyPhone}
                  onInputChange={handleInputChange}
                />
              </div>
            )}
            
            {/* Step 5: Student Verification */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Student Verification</h2>
                <StudentVerification 
                  idType={formData.idType}
                  onInputChange={handleInputChange}
                />
              </div>
            )}
            
            {/* Step 6: Booking Summary */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                <BookingSummary 
                  propertyTitle={property.title}
                  propertyImage={property.image}
                  roomType={formData.roomType}
                  duration={formData.duration}
                  durationType={formData.durationType}
                  checkInDate={formData.checkInDate}
                  fullName={formData.fullName}
                  price={selectedPrice}
                  termsAgreed={formData.termsAgreed}
                  onCheckboxChange={handleCheckboxChange}
                />
              </div>
            )}
            
            {/* Step 7: Payment */}
            {currentStep === 7 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Payment</h2>
                <PaymentOptions 
                  totalPrice={totalPrice}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onSelectPaymentMethod={setSelectedPaymentMethod}
                />
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleNext}
                disabled={currentStep === 6 && !formData.termsAgreed}
              >
                {currentStep === 7 ? 'Make Payment' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookProperty;
