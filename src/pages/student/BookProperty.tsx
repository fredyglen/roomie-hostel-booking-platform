
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';

const BookProperty: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <BookingStepsContainer />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookProperty;
