
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface BookingSummaryProps {
  propertyTitle: string;
  propertyImage: string;
  roomType: string;
  duration: string;
  durationType: string;
  checkInDate: string;
  fullName: string;
  price: number;
  priceUnit?: string;
  termsAgreed: boolean;
  onCheckboxChange: (name: string, checked: boolean) => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  propertyTitle,
  propertyImage,
  roomType,
  duration,
  durationType,
  checkInDate,
  fullName,
  price,
  priceUnit,
  termsAgreed,
  onCheckboxChange
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <img 
          src={propertyImage} 
          alt={propertyTitle} 
          className="w-20 h-20 object-cover rounded-md mr-4"
        />
        <div>
          <h3 className="font-semibold">{propertyTitle}</h3>
          <p className="text-sm text-gray-600">{roomType || 'Standard Room'}</p>
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Room Type</span>
          <span>{roomType || 'Standard Room'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Duration</span>
          <span>{duration} {durationType}(s)</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Check-in Date</span>
          <span>{checkInDate ? new Date(checkInDate).toLocaleDateString() : 'Not selected'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Booking Name</span>
          <span>{fullName || 'Not provided'}</span>
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
        <span className="font-bold">${price * parseInt(duration) + 100 + 50}</span>
      </div>
      
      <div className="border rounded-md p-4 mb-4 h-40 overflow-y-auto">
        <h3 className="font-semibold mb-2">Terms and Conditions</h3>
        <p className="text-sm text-gray-600">
          By booking this accommodation, you agree to abide by the house rules, payment terms, 
          and cancellation policy. All bookings require a security deposit which is refundable 
          subject to inspection at the end of your stay. Please note that failure to comply with 
          the house rules may result in termination of your tenancy.
        </p>
      </div>
      
      <div className="flex items-start mb-4">
        <Checkbox
          id="termsAgreed"
          checked={termsAgreed}
          onCheckedChange={(checked) => onCheckboxChange("termsAgreed", checked === true)}
        />
        <label htmlFor="termsAgreed" className="text-sm ml-2">
          I agree to the terms and conditions
        </label>
      </div>
    </div>
  );
};

export default BookingSummary;
