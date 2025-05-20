
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export const STEP_LABELS = ["Room", "Date", "Personal", "Emergency", "Verification", "Summary", "Payment"];

export const useBookingViewModel = () => {
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
  
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.roomType) {
          toast({
            title: "Please select a room type",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (!formData.checkInDate) {
          toast({
            title: "Please select a check-in date",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!formData.fullName || !formData.phone || !formData.email) {
          toast({
            title: "Please fill all required fields",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 6:
        if (!formData.termsAgreed) {
          toast({
            title: "Please agree to the terms and conditions",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };
  
  const handleNext = () => {
    if (!validateCurrentStep()) {
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
  const selectedRoomType = property?.roomTypes.find(room => room.name === formData.roomType);
  const selectedPrice = selectedRoomType ? selectedRoomType.price : property?.price || 0;
  const selectedUnit = selectedRoomType ? selectedRoomType.unit : property?.priceUnit || '';
  
  // Calculate total price based on duration
  const totalPrice = selectedPrice * parseInt(formData.duration) + 100 + 50; // Adding security deposit and service fee

  return {
    property,
    currentStep,
    formData,
    selectedPaymentMethod,
    selectedRoomType,
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
