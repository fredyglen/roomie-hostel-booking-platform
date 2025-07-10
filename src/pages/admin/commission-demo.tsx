/**
 * ✅ COMMISSION CONFIGURATION DEMO PAGE - "PHONE NUMBER DIAL" SIMPLICITY
 * 
 * BE CONSCIOUS Apple-Grade Demo showing real-time commission updates
 * across all portals simultaneously
 * 
 * Features:
 * - Live demonstration of "phone number dial" simplicity
 * - Real-time updates across Student/Owner/Admin/Paystack portals
 * - Instant synchronization validation
 * - Enterprise-level configuration management
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CommissionConfigManager } from '@/components/admin/CommissionConfigManager';
import { 
  StudentPortalCommissionExample,
  OwnerPortalCommissionExample,
  AdminPortalCommissionExample,
  PaystackIntegrationExample
} from '@/examples/portal-integration-examples';
import { Zap, Users, DollarSign, Settings, CreditCard, CheckCircle } from 'lucide-react';

const CommissionDemoPage: React.FC = () => {
  const [demoAmount, setDemoAmount] = useState<number>(1200); // Default booking amount
  const [ownerEarnings, setOwnerEarnings] = useState<number>(5000); // Default monthly earnings

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" />
          Commission Configuration Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience "phone number dial" simplicity for commission rate changes. 
          Watch as updates propagate instantly across all portals and Paystack integration.
        </p>
        <Badge className="bg-green-500 text-white px-4 py-2">
          ✅ BE CONSCIOUS Apple-Grade Standards
        </Badge>
      </div>

      {/* Demo Controls */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Demo Controls</CardTitle>
          <CardDescription>
            Adjust these values to see real-time calculations across all portals
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="demo-booking-amount">Student Booking Amount (GHS)</Label>
            <Input
              id="demo-booking-amount"
              type="number"
              value={demoAmount}
              onChange={(e) => setDemoAmount(Number(e.target.value))}
              min="100"
              max="10000"
              step="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-owner-earnings">Owner Monthly Earnings (GHS)</Label>
            <Input
              id="demo-owner-earnings"
              type="number"
              value={ownerEarnings}
              onChange={(e) => setOwnerEarnings(Number(e.target.value))}
              min="1000"
              max="50000"
              step="500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission Configuration Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            "Phone Number Dial" Commission Manager
          </CardTitle>
          <CardDescription>
            Change commission rates with enterprise simplicity. Watch the updates propagate instantly below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommissionConfigManager />
        </CardContent>
      </Card>

      <Separator />

      {/* Real-Time Portal Demonstrations */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Real-Time Portal Synchronization</h2>
          <p className="text-gray-600">
            All portals below update automatically when commission rates change above
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Portal */}
          <StudentPortalCommissionExample bookingAmount={demoAmount} />

          {/* Owner Portal */}
          <OwnerPortalCommissionExample monthlyEarnings={ownerEarnings} />

          {/* Admin Portal */}
          <AdminPortalCommissionExample />

          {/* Paystack Integration */}
          <PaystackIntegrationExample paymentAmount={demoAmount} />
        </div>
      </div>

      <Separator />

      {/* How It Works */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            How "Phone Number Dial" Simplicity Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-medium">Admin Changes Rate</h4>
              <p className="text-sm text-gray-600">
                Admin updates commission rate in the manager above
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-medium">Database Update</h4>
              <p className="text-sm text-gray-600">
                Configuration saved to database with audit trail
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-medium">Real-Time Sync</h4>
              <p className="text-sm text-gray-600">
                All portals receive instant updates via WebSocket
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-medium">Instant Reflection</h4>
              <p className="text-sm text-gray-600">
                Student, Owner, Admin, and Paystack update immediately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Technical Implementation - BE CONSCIOUS Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">✅ Implemented Features</h4>
              <ul className="space-y-1 text-sm">
                <li>• Centralized commission engine with real-time updates</li>
                <li>• "Phone number dial" simplicity for rate changes</li>
                <li>• Cross-portal synchronization system</li>
                <li>• Paystack integration with instant rate reflection</li>
                <li>• Enterprise-level audit trails and change logging</li>
                <li>• Database persistence with version control</li>
                <li>• Real-time WebSocket communication</li>
                <li>• Apple-Grade error handling and validation</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">🔧 Technical Stack</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Backend:</strong> Supabase with real-time subscriptions</li>
                <li>• <strong>Frontend:</strong> React with custom hooks</li>
                <li>• <strong>State Management:</strong> Real-time configuration engine</li>
                <li>• <strong>Database:</strong> PostgreSQL with RLS policies</li>
                <li>• <strong>Payment:</strong> Enhanced Paystack service</li>
                <li>• <strong>Validation:</strong> Branded types for compile-time safety</li>
                <li>• <strong>Logging:</strong> Comprehensive audit trails</li>
                <li>• <strong>Standards:</strong> BE CONSCIOUS Apple-Grade compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert className="border-blue-500 bg-blue-50">
        <Zap className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          <strong>Try it now:</strong> Change any commission rate in the manager above and watch 
          all four portal examples update instantly below. This demonstrates the "phone number dial" 
          simplicity where a single change propagates across the entire system in real-time.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CommissionDemoPage;
