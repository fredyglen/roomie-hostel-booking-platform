
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import BookingHistory from '@/components/student/BookingHistory';

const BookingHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your accommodation bookings</p>
          </div>
          <BookingHistory />
        </div>
      </main>
      <Footer />
      <StudentNavBar />
    </div>
  );
};

export default BookingHistoryPage;
