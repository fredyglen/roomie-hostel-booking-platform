
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

const StudentDashboard: React.FC = () => {
  // In a real app, we would fetch this data from an API
  const studentData = {
    name: "Ama Mensah",
    university: "UPSA",
    bookings: [
      { id: 'b1', property: "Cozy Studio Near UPSA", checkIn: "2023-09-01", checkOut: "2024-06-30", status: "active" }
    ],
    favorites: [
      { id: '2', title: "Shared 2-Bedroom Apartment", type: "Shared", price: 500 }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {studentData.name}!
            </h1>
            <Link to="/student/properties">
              <Button variant="primary">Find Accommodation</Button>
            </Link>
          </div>
          
          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">University</h3>
              <p>{studentData.university}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">Active Bookings</h3>
              <p>{studentData.bookings.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-2">Saved Properties</h3>
              <p>{studentData.favorites.length}</p>
            </div>
          </div>
          
          {/* Active Booking Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Active Bookings</h2>
            {studentData.bookings.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentData.bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.property}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.checkIn}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.checkOut}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No active bookings found.</p>
            )}
          </section>
          
          {/* Favorites Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
            {studentData.favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentData.favorites.map((property) => (
                  <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{property.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{property.type}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-roomi-blue">${property.price}/month</span>
                        <Link to={`/student/property/${property.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No saved properties found.</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
