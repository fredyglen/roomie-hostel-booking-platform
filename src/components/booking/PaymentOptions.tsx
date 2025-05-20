
import React from 'react';

interface PaymentOptionsProps {
  totalPrice: number;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  totalPrice,
  selectedPaymentMethod,
  onSelectPaymentMethod
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Select Payment Method</h3>
      
      <div className="flex flex-col space-y-3">
        <div 
          className={`border rounded-lg p-4 cursor-pointer ${selectedPaymentMethod === 'card' ? 'border-roomi-blue bg-blue-50' : ''}`}
          onClick={() => onSelectPaymentMethod('card')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-roomi-blue"
              checked={selectedPaymentMethod === 'card'}
              onChange={() => onSelectPaymentMethod('card')}
            />
            <div className="ml-3">
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-8 h-5 bg-blue-600 rounded"></div>
              <div className="w-8 h-5 bg-red-500 rounded"></div>
              <div className="w-8 h-5 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer ${selectedPaymentMethod === 'momo' ? 'border-roomi-blue bg-blue-50' : ''}`}
          onClick={() => onSelectPaymentMethod('momo')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-roomi-blue"
              checked={selectedPaymentMethod === 'momo'}
              onChange={() => onSelectPaymentMethod('momo')}
            />
            <div className="ml-3">
              <p className="font-medium">Mobile Money</p>
              <p className="text-sm text-gray-600">MTN, Vodafone, AirtelTigo</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-8 h-5 bg-yellow-500 rounded"></div>
              <div className="w-8 h-5 bg-red-600 rounded"></div>
              <div className="w-8 h-5 bg-blue-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span>${totalPrice}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          You will be redirected to our payment provider to complete the transaction.
        </p>
      </div>
    </div>
  );
};

export default PaymentOptions;
