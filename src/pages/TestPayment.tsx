
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PaymentTestPanel from '@/components/payment/PaymentTestPanel';

const TestPayment: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Testing</h1>
            <p className="text-gray-600">Test the payment flow with different package types</p>
          </div>
          <PaymentTestPanel />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestPayment;
