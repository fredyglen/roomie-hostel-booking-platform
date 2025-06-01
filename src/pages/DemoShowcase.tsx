
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DemoPropertiesShowcase } from '@/components/demo/DemoPropertiesShowcase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Upload, Users, Shield } from 'lucide-react';

const DemoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Demo Property System
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Complete Property Owner System with Ghana University Listings
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Upload className="h-5 w-5 mr-2" />
                Image Upload System
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Home className="h-5 w-5 mr-2" />
                10 Demo Properties
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Users className="h-5 w-5 mr-2" />
                5 Demo Owners
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Shield className="h-5 w-5 mr-2" />
                Verification System
              </Badge>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                System Features Implemented
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete property management system with realistic Ghana university data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <CardTitle>Image Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Supabase Storage integration</li>
                    <li>• Drag & drop interface</li>
                    <li>• Image reordering</li>
                    <li>• 5MB file size limit</li>
                    <li>• Multiple format support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Home className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <CardTitle>Demo Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• 10 realistic properties</li>
                    <li>• UG, KNUST, UCC locations</li>
                    <li>• Ghana Cedis pricing</li>
                    <li>• Local amenities</li>
                    <li>• Verified ownership</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                  <CardTitle>Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• 5 demo owner profiles</li>
                    <li>• Ghana names & contacts</li>
                    <li>• Business verification</li>
                    <li>• Response rate tracking</li>
                    <li>• Owner dashboards</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 mx-auto text-orange-600 mb-4" />
                  <CardTitle>Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Property verification</li>
                    <li>• Admin approval workflow</li>
                    <li>• Status tracking</li>
                    <li>• Document upload</li>
                    <li>• Quality assurance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Properties Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <DemoPropertiesShowcase />
          </div>
        </section>

        {/* Testing Instructions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Testing Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">1. Property Owner Testing</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Register as property owner</li>
                      <li>• Create new property listing</li>
                      <li>• Upload multiple images</li>
                      <li>• Test image reordering</li>
                      <li>• Publish property</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">2. Student User Testing</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Browse property listings</li>
                      <li>• Filter by location/price</li>
                      <li>• View property details</li>
                      <li>• Check image galleries</li>
                      <li>• Contact property owners</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">3. Admin Testing</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Review pending properties</li>
                      <li>• Approve/reject listings</li>
                      <li>• Monitor property quality</li>
                      <li>• Check verification status</li>
                      <li>• View platform analytics</li>
                    </ul>
                  </div>
                </div>

                <div className="text-center pt-6 border-t">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={() => window.open('/owner/properties/new', '_blank')}>
                      Test Property Creation
                    </Button>
                    <Button variant="outline" onClick={() => window.open('/properties', '_blank')}>
                      Browse Properties
                    </Button>
                    <Button variant="outline" onClick={() => window.open('/test-payment', '_blank')}>
                      Test Payment Flow
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DemoShowcase;
