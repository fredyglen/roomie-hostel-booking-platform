
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const ModernHomepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                ROOMi
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/student/properties" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Housing
              </Link>
              <Link to="/student/explore" className="text-gray-700 hover:text-blue-600 transition-colors">
                Explore
              </Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                List Property
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              #1 Student Housing Platform in Ghana
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-blue-600"> Student Home</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover verified hostels, homestels, and apartments near your university. 
              Safe, affordable, and student-friendly accommodation across Ghana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="px-8 py-3">
                  Start Your Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/student/properties">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Student Housing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked accommodations from trusted property owners across Ghana's top universities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "UPSA Hostel Block A",
                location: "University of Professional Studies",
                price: "₵800",
                period: "semester",
                rating: 4.8,
                image: "/lovable-uploads/849fd73d-2b2f-42b6-9446-0aa9226cc8e7.png",
                features: ["WiFi", "24/7 Security", "Study Areas"]
              },
              {
                title: "Legon Student Village",
                location: "University of Ghana",
                price: "₵1,200",
                period: "semester", 
                rating: 4.9,
                image: "/lovable-uploads/970163e0-e566-455b-9c65-4f97f9455dbe.png",
                features: ["Furnished", "Gym Access", "Cafeteria"]
              },
              {
                title: "KNUST Homestel",
                location: "Kwame Nkrumah University",
                price: "₵650",
                period: "semester",
                rating: 4.7,
                image: "/lovable-uploads/95228bae-e3b5-4237-b6fc-0d4cd53dbdbb.png",
                features: ["Home Cooking", "Family Environment", "Study Support"]
              }
            ].map((property, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/student/properties">
                  <div className="aspect-video relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-green-600">
                      Available
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{property.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{property.price}</span>
                        <span className="text-gray-600">/{property.period}</span>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* University Partnerships */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Universities
            </h2>
            <p className="text-gray-600">
              Official housing partner with Ghana's top educational institutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              "University of Ghana (Legon)",
              "KNUST",
              "UPSA", 
              "UCC"
            ].map((university, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800">{university}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ROOMi?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make student housing simple, safe, and affordable for every Ghanaian student
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                description: "All properties are inspected and verified for quality, safety, and authenticity"
              },
              {
                icon: Users,
                title: "Student-Focused",
                description: "Designed specifically for students with features like study areas and flexible payments"
              },
              {
                icon: CheckCircle,
                title: "Easy Booking",
                description: "Simple online booking process with secure payments and instant confirmation"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Home Away From Home?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect accommodation through ROOMi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Sign Up as Student
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ROOMi</h3>
              <p className="text-gray-400">
                Ghana's leading student housing platform, connecting students with verified accommodation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/student/properties" className="hover:text-white">Find Housing</Link></li>
                <li><Link to="/student/explore" className="hover:text-white">Explore Areas</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Property Owners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">List Property</Link></li>
                <li><Link to="/login" className="hover:text-white">Owner Portal</Link></li>
                <li><Link to="/register" className="hover:text-white">Join ROOMi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/login" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/login" className="hover:text-white">Safety</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ROOMi. All rights reserved. Made for Ghanaian students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomepage;
