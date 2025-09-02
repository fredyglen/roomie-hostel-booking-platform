/**
 * Property Card Overlay Demo Component
 * 
 * Showcases different overlay variants and real-time information display.
 * Perfect for testing and demonstrating the overlay system.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyCardOverlay from '@/components/property/PropertyCardOverlay';

const PropertyCardOverlayDemo: React.FC = () => {
  // Sample property data
  const sampleProperties = [
    {
      id: '14b06d8e-24e2-4b61-8748-f87519ab13d1',
      title: 'Modern Hostel - Full Overlay',
      price: 4890,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      variant: 'default' as const
    },
    {
      id: '54ee0333-e385-4a76-9013-1ec44ef83c98',
      title: 'Compact Card - Mobile Optimized',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
      variant: 'compact' as const
    },
    {
      id: '14b06d8e-24e2-4b61-8748-f87519ab13d1',
      title: 'Minimal - Status Only',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      variant: 'minimal' as const
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Property Card Overlay System
        </h1>
        <p className="text-gray-600">
          Production-grade real-time information overlays for property cards
        </p>
      </div>

      {/* Full Overlay Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Default Variant - Full Overlay</h2>
        <Card className="max-w-md mx-auto">
          <div className="relative h-64">
            <img
              src={sampleProperties[0].image}
              alt={sampleProperties[0].title}
              className="w-full h-full object-cover"
            />
            <PropertyCardOverlay
              propertyId={sampleProperties[0].id}
              price={sampleProperties[0].price}
              priceUnit="semester"
              variant="default"
              isVerified={true}
              isPopular={true}
              viewCount={127}
              showLiveIndicator={true}
              showPrice={true}
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900">{sampleProperties[0].title}</h3>
            <p className="text-sm text-gray-600">
              Complete overlay with all real-time information, verification badges, 
              popularity indicators, and live status updates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compact Overlay Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Compact Variant - Mobile Optimized</h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <Card>
            <div className="relative h-32">
              <img
                src={sampleProperties[1].image}
                alt={sampleProperties[1].title}
                className="w-full h-full object-cover"
              />
              <PropertyCardOverlay
                propertyId={sampleProperties[1].id}
                price={sampleProperties[1].price}
                priceUnit="semester"
                variant="compact"
                isVerified={true}
                showLiveIndicator={true}
                showPrice={true}
              />
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm text-gray-900">{sampleProperties[1].title}</h4>
              <p className="text-xs text-gray-600">Perfect for mobile property cards</p>
            </CardContent>
          </Card>

          <Card>
            <div className="relative h-32">
              <img
                src={sampleProperties[2].image}
                alt={sampleProperties[2].title}
                className="w-full h-full object-cover"
              />
              <PropertyCardOverlay
                propertyId={sampleProperties[2].id}
                price={sampleProperties[2].price}
                priceUnit="semester"
                variant="compact"
                isVerified={false}
                showLiveIndicator={true}
                showPrice={true}
              />
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm text-gray-900">Another Property</h4>
              <p className="text-xs text-gray-600">Clean, minimal overlay</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Minimal Overlay Demo */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Minimal Variant - Status Only</h2>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-20">
                <img
                  src={`https://images.unsplash.com/photo-${1555854877 + index}?auto=format&fit=crop&q=80&w=400`}
                  alt={`Property ${index}`}
                  className="w-full h-full object-cover"
                />
                <PropertyCardOverlay
                  propertyId={sampleProperties[0].id}
                  price={2500 + index * 200}
                  priceUnit="semester"
                  variant="minimal"
                  showLiveIndicator={false}
                  showPrice={false}
                />
              </div>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Ultra-minimal design with just availability status indicators
        </p>
      </div>

      {/* Features List */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overlay Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Real-Time Information</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Live bed availability status</li>
              <li>• Occupancy rate indicators</li>
              <li>• Urgency levels (filling up, full)</li>
              <li>• Real-time data updates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Visual Elements</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Verification badges</li>
              <li>• Popularity indicators</li>
              <li>• Price display with currency</li>
              <li>• Live status indicators</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Mobile Optimization</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Responsive design patterns</li>
              <li>• Touch-friendly interactions</li>
              <li>• Optimized for small screens</li>
              <li>• Performance optimized</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Accessibility</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• High contrast overlays</li>
              <li>• Readable text on images</li>
              <li>• Color-coded status system</li>
              <li>• Screen reader friendly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardOverlayDemo;
