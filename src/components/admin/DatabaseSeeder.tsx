/**
 * Database Seeder Component
 * Quick tool to seed Ghana hostels for testing
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { seedGhanaHostels, clearProperties, checkSeedingStatus } from '@/utils/seed-ghana-hostels';
import { ensureDemoAdminExists } from '@/utils/admin-setup';
import { logger } from '@/utils/enhanced-logger';

export const DatabaseSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isFixingAdmin, setIsFixingAdmin] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [propertyCount, setPropertyCount] = useState<number>(0);

  const handleSeed = async () => {
    setIsSeeding(true);
    setStatus('Seeding Ghana hostels...');
    
    try {
      const result = await seedGhanaHostels();
      setStatus(`✅ Successfully seeded ${result.count} Ghana hostels!`);
      await checkStatus();
    } catch (error) {
      setStatus(`❌ Failed to seed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Seeding failed', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    setStatus('Clearing all properties...');
    
    try {
      await clearProperties();
      setStatus('✅ Successfully cleared all properties!');
      setPropertyCount(0);
    } catch (error) {
      setStatus(`❌ Failed to clear: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Clearing failed', error);
    } finally {
      setIsClearing(false);
    }
  };

  const checkStatus = async () => {
    setIsChecking(true);

    try {
      const result = await checkSeedingStatus();
      setPropertyCount(result.count);
      setStatus(`📊 Database contains ${result.count} properties`);
    } catch (error) {
      setStatus(`❌ Failed to check status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Status check failed', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFixAdmin = async () => {
    setIsFixingAdmin(true);
    setStatus('Fixing admin access...');

    try {
      const result = await ensureDemoAdminExists();
      if (result.success) {
        setStatus(`✅ ${result.message} - Admin: admin@roomi.com / password123`);
      } else {
        setStatus(`❌ Admin fix failed: ${result.message}`);
      }
    } catch (error) {
      setStatus(`❌ Failed to fix admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
      logger.error('Admin fix failed', error);
    } finally {
      setIsFixingAdmin(false);
    }
  };

  React.useEffect(() => {
    checkStatus();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Tools</CardTitle>
        <p className="text-sm text-gray-600">
          Database seeding and admin access management
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Current Properties: {propertyCount}
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={handleSeed}
            disabled={isSeeding || isClearing}
            className="w-full"
            variant="default"
          >
            {isSeeding ? 'Seeding...' : 'Seed Ghana Hostels'}
          </Button>

          <Button 
            onClick={handleClear}
            disabled={isSeeding || isClearing}
            className="w-full"
            variant="destructive"
          >
            {isClearing ? 'Clearing...' : 'Clear All Properties'}
          </Button>

          <Button
            onClick={checkStatus}
            disabled={isChecking}
            className="w-full"
            variant="outline"
          >
            {isChecking ? 'Checking...' : 'Check Status'}
          </Button>

          <Button
            onClick={handleFixAdmin}
            disabled={isFixingAdmin}
            className="w-full"
            variant="secondary"
          >
            {isFixingAdmin ? 'Fixing Admin...' : 'Fix Admin Access'}
          </Button>
        </div>

        {status && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSeeder;
