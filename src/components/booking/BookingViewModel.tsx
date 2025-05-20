import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const STEP_LABELS = [
  'Room Type',
  'Duration',
  'Personal Info',
  'Emergency Contact',
  'Verification',
  'Summary',
  'Payment'
];

// Sample property data
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment Near UPSA',
    type: 'Homestel',
    price: 850,
    priceUnit: 'month',
    address: '123 University Road, East Legon, Accra',
    distanceToCampus: '5 min walk',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
    roomTypes: [
      { name: '1 in a room', price: 1700, unit: 'month' },
      { name: '2 in a room', price: 1200, unit: 'month' }
    ],
    occupancy: '1-2 students'
  },
  {
    id: '2',
    title: 'Shared 2-Bedroom Apartment',
    type: 'Hostel',
    price: 4000,
    priceUnit: 'semester',
    address: '456 College Avenue, Legon, Accra',
    distanceToCampus: '10 min walk',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80',
    roomTypes: [
      { name: '2 in a room', price: 4000, unit: 'semester' },
      { name: '3 in a room', price: 3600, unit: 'semester' }
    ],
    occupancy: '2-3 students'
  },
  {
    id: '3',
    title: 'Premium Single Room in Hostel',
    type: 'Apartment',
    price: 2600,
    priceUnit: 'month',
    address: '789 Campus Drive, Ayeduase, Kumasi',
    distanceToCampus: '2 min walk',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80',
    roomTypes: [
      { name: 'Entire apartment', price: 2600, unit: 'month' },
      { name: 'Shared apartment (per student)', price: 950, unit: 'month' }
    ],
    occupancy: '2-4 students'
  }
];

export const useBookingViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  const [formData, setFormData] = useState(() => {
    // Try to load from localStorage
    const savedData = localStorage.getItem(`booking_form_${id}`);
    return savedData ? JSON.parse(savedData) : {
      roomType: '',
      duration: '',
      durationType: 'semester',
      checkInDate: '',
      fullName: '',
      phone: '',
      email: '',
      emergencyContact: '',
      emergencyPhone: '',
      idType: 'student_id',
      idNumber: '',
      idImage: null,
      termsAgreed: false
    };
  });
  
  // Find the property with the matching ID
  const property = sampleProperties.find(p => p.id === id);
  
  // Selected room type and price
  const selectedRoomType = property?.roomTypes?.find(r => r.name === formData.roomType);
  const selectedPrice = selectedRoomType?.price || 0;
  const selectedUnit = selectedRoomType?.unit || 'semester';
  
  // Calculate total price based on duration
  const totalPrice = calculateTotalPrice(selectedPrice, formData.duration, formData.durationType, selectedUnit);
  
  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`booking_form_${id}`, JSON.stringify(formData));
  }, [formData, id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) return;
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Process payment
      processPayment();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(`/student/property/${id}`);
    }
  };
  
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Room Type
        if (!formData.roomType) {
          toast.error('Please select a room type');
          return false;
        }
        return true;
        
      case 2: // Duration
        if (!formData.duration) {
          toast.error('Please enter duration');
          return false;
        }
        if (!formData.checkInDate) {
          toast.error('Please select check-in date');
          return false;
        }
        return true;
        
      case 3: // Personal Info
        if (!formData.fullName || !formData.phone || !formData.email) {
          toast.error('Please fill in all personal information');
          return false;
        }
        return true;
        
      case 4: // Emergency Contact
        if (!formData.emergencyContact || !formData.emergencyPhone) {
          toast.error('Please fill in all emergency contact information');
          return false;
        }
        return true;
        
      case 5: // Verification
        if (!formData.idNumber) {
          toast.error('Please enter your ID number');
          return false;
        }
        return true;
        
      case 6: // Summary
        if (!formData.termsAgreed) {
          toast.error('Please agree to the terms and conditions');
          return false;
        }
        return true;
        
      case 7: // Payment
        if (!selectedPaymentMethod) {
          toast.error('Please select a payment method');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  const processPayment = () => {
    // Simulate payment processing
    toast.loading('Processing payment...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Payment successful! Booking confirmed.');
      
      // Clear booking form data from localStorage
      localStorage.removeItem(`booking_form_${id}`);
      
      // Redirect to dashboard
      navigate('/student/dashboard');
    }, 2000);
  };
  
  return {
    property,
    currentStep,
    formData,
    selectedPaymentMethod,
    selectedPrice,
    selectedUnit,
    totalPrice,
    handleInputChange,
    handleCheckboxChange,
    handleNext,
    handleBack,
    setSelectedPaymentMethod
  };
};

// Helper function to calculate total price
function calculateTotalPrice(
  basePrice: number,
  duration: string,
  durationType: string,
  propertyPriceUnit: string
): number {
  if (!basePrice || !duration) return 0;
  
  const durationNum = parseInt(duration, 10);
  
  if (isNaN(durationNum) || durationNum <= 0) return 0;
  
  // If durationType matches property's price unit, simple multiplication
  if (durationType === propertyPriceUnit) {
    return basePrice * durationNum;
  }
  
  // Handle conversions between different duration types
  if (propertyPriceUnit === 'month' && durationType === 'semester') {
    // Semester is approximately 4 months
    return basePrice * 4 * durationNum;
  } else if (propertyPriceUnit === 'semester' && durationType === 'month') {
    // Convert semester price to monthly
    return (basePrice / 4) * durationNum;
  } else if (propertyPriceUnit === 'month' && durationType === 'year') {
    // Year is 12 months
    return basePrice * 12 * durationNum;
  } else if (propertyPriceUnit === 'year' && durationType === 'month') {
    // Convert yearly price to monthly
    return (basePrice / 12) * durationNum;
  } else if (propertyPriceUnit === 'semester' && durationType === 'year') {
    // Year is typically 2 semesters
    return basePrice * 2 * durationNum;
  } else if (propertyPriceUnit === 'year' && durationType === 'semester') {
    // Convert yearly price to semester
    return (basePrice / 2) * durationNum;
  }
  
  // Default fallback
  return basePrice * durationNum;
}
