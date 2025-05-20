
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

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

const BookProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    
    if (currentStep === 4 && !formData.termsAgreed) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mock payment processing
      setTimeout(() => {
        toast({
          title: "Booking Successful!",
          description: "Your booking has been confirmed.",
          variant: "default"
        });
        navigate('/student/dashboard');
      }, 1500);
    }
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
  const totalPrice = selectedPrice * parseInt(formData.duration);

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
          <div className="mb-8">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === currentStep ? 'bg-roomi-blue text-white' : 
                      step < currentStep ? 'bg-roomi-teal text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${step === currentStep ? 'text-roomi-blue font-medium' : ''}`}>
                    {step === 1 && "Room"}
                    {step === 2 && "Date"}
                    {step === 3 && "Info"}
                    {step === 4 && "Terms"}
                    {step === 5 && "Payment"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
              <div 
                className="absolute top-0 h-1 bg-roomi-blue transition-all duration-300"
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Step 1: Choose Room Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Choose Room Type</h2>
                <div className="space-y-4">
                  {property.roomTypes.map((room, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.roomType === room.name ? 'border-roomi-blue bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData({...formData, roomType: room.name})}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{room.name}</h3>
                          <p className="text-sm text-gray-500">Suitable for 1-2 persons</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-roomi-blue">${room.price}</span>
                          <span className="text-gray-600">/{room.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 2: Select Duration and Date */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Duration and Date</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex items-center">
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-24 p-2 border rounded-md mr-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    
                    <select
                      name="durationType"
                      value={formData.durationType}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md"
                    >
                      <option value="month">Month(s)</option>
                      <option value="semester">Semester(s)</option>
                      <option value="year">Year(s)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <Input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <Input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <Input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="Emergency contact phone"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="studentId">Student ID</option>
                    <option value="nationalId">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="driverLicense">Driver's License</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Step 4: Terms and Conditions */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
                
                <div className="border rounded-md p-4 mb-4 h-56 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Booking Terms</h3>
                  <p className="text-sm mb-4">
                    This agreement outlines the terms and conditions for booking a property through ROOMi. 
                    Please read carefully before proceeding with your booking.
                  </p>
                  
                  <h4 className="font-semibold mb-1">1. Booking and Payments</h4>
                  <p className="text-sm mb-2">
                    - A non-refundable booking fee of 20% is required to secure your reservation.<br />
                    - Full payment must be made 7 days before check-in.<br />
                    - The property owner reserves the right to cancel the reservation if payment is not received on time.
                  </p>
                  
                  <h4 className="font-semibold mb-1">2. Cancellation Policy</h4>
                  <p className="text-sm mb-2">
                    - Full refund if canceled 7 or more days before check-in date.<br />
                    - 70% refund if canceled between 3-7 days before check-in date.<br />
                    - No refund for cancellations less than 3 days before check-in date.
                  </p>
                  
                  <h4 className="font-semibold mb-1">3. Check-in and Check-out</h4>
                  <p className="text-sm mb-2">
                    - Check-in time is after 2:00 PM.<br />
                    - Check-out time is before 10:00 AM.<br />
                    - Early check-in or late check-out may incur additional fees.
                  </p>
                  
                  <h4 className="font-semibold mb-1">4. Property Rules</h4>
                  <p className="text-sm mb-2">
                    - Guests must comply with the house rules provided by the property owner.<br />
                    - Any damage to the property will be the responsibility of the guest and may result in additional charges.<br />
                    - Guests are responsible for maintaining the cleanliness and security of the property during their stay.
                  </p>
                </div>
                
                <div className="flex items-start mb-4">
                  <Checkbox
                    id="termsAgreed"
                    checked={formData.termsAgreed}
                    onCheckedChange={(checked) => handleCheckboxChange("termsAgreed", checked === true)}
                  />
                  <label htmlFor="termsAgreed" className="text-sm ml-2">
                    I agree to the terms and conditions
                  </label>
                </div>
              </div>
            )}
            
            {/* Step 5: Payment Summary */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
                
                <div className="flex items-center mb-4">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-gray-600">{formData.roomType || 'Standard Room'}</p>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{formData.roomType || 'Room'} x {formData.duration} {formData.durationType}(s)</span>
                    <span>${selectedPrice} x {formData.duration}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Security Deposit</span>
                    <span>$100</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span>$50</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${totalPrice + 100 + 50}</span>
                </div>
                
                {/* Mock Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="flex space-x-2">
                    <div className="border rounded-md p-3 flex-grow text-center cursor-pointer bg-gray-50">
                      Credit/Debit Card
                    </div>
                    <div className="border rounded-md p-3 flex-grow text-center cursor-pointer">
                      Mobile Money
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                {currentStep === 5 ? 'Make Payment' : 'Next'}
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
