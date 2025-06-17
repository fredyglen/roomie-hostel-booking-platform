/**
 * Property Visibility Monitor
 * Admin tool to ensure all properties are visible to students
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/enhanced-logger';
import { CheckCircle, AlertTriangle, RefreshCw, Eye, Database } from 'lucide-react';

interface PropertyVisibilityStatus {
  id: string;
  title: string;
  owner_id: string;
  is_available: boolean;
  verification_status: string;
  created_at: string;
  visibleToStudents: boolean;
  issues: string[];
}

export const PropertyVisibilityMonitor: React.FC = () => {
  const [properties, setProperties] = useState<PropertyVisibilityStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    visible: 0,
    hidden: 0,
    issues: 0
  });

  const checkPropertyVisibility = async (): Promise<void> => {
    setIsLoading(true);
    try {
      logger.info('Checking property visibility status');

      // Get all properties from database
      const { data: dbProperties, error } = await supabase
        .from('properties')
        .select('id, title, owner_id, is_available, verification_status, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch properties for visibility check', error);
        return;
      }

      // Check each property's visibility to students
      const visibilityChecks = await Promise.all(
        (dbProperties || []).map(async (property) => {
          const issues: string[] = [];
          let visibleToStudents = true;

          // Check if property meets student visibility criteria
          if (!property.is_available) {
            issues.push('Property marked as unavailable');
            visibleToStudents = false;
          }

          if (property.verification_status === 'rejected') {
            issues.push('Property verification rejected');
            visibleToStudents = false;
          }

          // Check if property appears in student queries
          try {
            const { data: studentQuery, error: studentError } = await supabase
              .from('properties')
              .select('id')
              .eq('id', property.id)
              .eq('is_available', true)
              .single();

            if (studentError || !studentQuery) {
              issues.push('Property not found in student queries');
              visibleToStudents = false;
            }
          } catch (err) {
            issues.push('Query check failed');
            visibleToStudents = false;
          }

          return {
            ...property,
            visibleToStudents,
            issues
          } as PropertyVisibilityStatus;
        })
      );

      setProperties(visibilityChecks);

      // Calculate stats
      const newStats = {
        total: visibilityChecks.length,
        visible: visibilityChecks.filter(p => p.visibleToStudents).length,
        hidden: visibilityChecks.filter(p => !p.visibleToStudents).length,
        issues: visibilityChecks.filter(p => p.issues.length > 0).length
      };
      setStats(newStats);

      logger.info('Property visibility check completed', newStats);

    } catch (error) {
      logger.error('Property visibility check failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fixPropertyVisibility = async (propertyId: string): Promise<void> => {
    try {
      logger.info('Attempting to fix property visibility', { propertyId });

      // Basic fix: ensure property is available and pending verification
      const { error } = await supabase
        .from('properties')
        .update({
          is_available: true,
          verification_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) {
        logger.error('Failed to fix property visibility', error);
        return;
      }

      logger.info('Property visibility fixed', { propertyId });
      
      // Refresh the check
      await checkPropertyVisibility();

    } catch (error) {
      logger.error('Property visibility fix failed', error);
    }
  };

  useEffect(() => {
    checkPropertyVisibility();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Property Visibility Monitor
          </CardTitle>
          <Button 
            onClick={checkPropertyVisibility}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Check
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Properties</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.visible}</div>
            <div className="text-sm text-green-600">Visible to Students</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.hidden}</div>
            <div className="text-sm text-red-600">Hidden from Students</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.issues}</div>
            <div className="text-sm text-yellow-600">With Issues</div>
          </div>
        </div>

        {/* Property List */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Property Status Details</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Checking property visibility...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No properties found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {properties.map((property) => (
                <div 
                  key={property.id}
                  className={`p-3 border rounded-lg ${
                    property.visibleToStudents 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {property.visibleToStudents ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">{property.title}</span>
                        <Badge 
                          variant={property.visibleToStudents ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {property.visibleToStudents ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Status: {property.verification_status} | Available: {property.is_available ? 'Yes' : 'No'}</div>
                        <div>Created: {new Date(property.created_at).toLocaleDateString()}</div>
                        
                        {property.issues.length > 0 && (
                          <div className="text-red-600">
                            Issues: {property.issues.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!property.visibleToStudents && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fixPropertyVisibility(property.id)}
                        className="ml-2"
                      >
                        Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Visibility Check Summary:</strong> This tool verifies that properties created by owners 
          are properly visible to students. Properties must be available and not rejected to appear in student searches.
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyVisibilityMonitor;
