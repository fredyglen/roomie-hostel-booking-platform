/**
 * Compound Dashboard Page
 * 
 * Comprehensive analytics dashboard for compound management.
 * Shows aggregated metrics, revenue charts, occupancy heatmap, property comparison.
 * 
 * Design: Professional data-focused UI with Recharts visualizations
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { CompoundAnalyticsService } from '@/services/compound-analytics.service';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  BuildingIcon,
  TrendingUpIcon,
  CalendarIcon,
  BedroomIcon,
  ArrowLeftIcon,
} from '@/components/ui/SolarIcons';
import { Plus as PlusIcon, Download as DownloadIcon, Edit as EditIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { logger } from '@/utils/enhanced-logger';

const CompoundDashboard: React.FC = () => {
  const { id: compoundId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch compound basic info
  const { data: compound, isLoading: compoundLoading } = useQuery({
    queryKey: ['compound', compoundId],
    queryFn: async () => {
      if (!compoundId) throw new Error('Compound ID required');

      const { data, error } = await supabase
        .from('compounds')
        .select('*')
        .eq('id', compoundId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!compoundId,
  });

  // Fetch compound metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['compound-metrics', compoundId],
    queryFn: async () => {
      if (!compoundId) throw new Error('Compound ID required');
      return await CompoundAnalyticsService.getCompoundMetrics(compoundId);
    },
    enabled: !!compoundId,
  });

  // Fetch compound properties
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['compound-properties', compoundId],
    queryFn: async () => {
      if (!compoundId) throw new Error('Compound ID required');
      return await CompoundAnalyticsService.getCompoundProperties(compoundId);
    },
    enabled: !!compoundId,
  });

  // Fetch revenue history
  const { data: revenueHistory, isLoading: revenueLoading } = useQuery({
    queryKey: ['compound-revenue-history', compoundId],
    queryFn: async () => {
      if (!compoundId) throw new Error('Compound ID required');
      return await CompoundAnalyticsService.getCompoundRevenueHistory(compoundId, 6);
    },
    enabled: !!compoundId,
  });

  // Fetch recent bookings
  const { data: recentBookings } = useQuery({
    queryKey: ['compound-recent-bookings', compoundId],
    queryFn: async () => {
      if (!compoundId) throw new Error('Compound ID required');

      // Get property IDs in compound
      const { data: compoundProperties } = await supabase
        .from('compound_properties')
        .select('property_id')
        .eq('compound_id', compoundId);

      if (!compoundProperties || compoundProperties.length === 0) return [];

      const propertyIds = compoundProperties.map(cp => cp.property_id);

      // Get recent bookings
      const { data, error } = await supabase
        .from('bookings_enhanced')
        .select(`
          id,
          booking_reference,
          property_id,
          student_id,
          total_amount,
          status,
          created_at,
          properties (
            title
          ),
          profiles:student_id (
            first_name,
            last_name
          )
        `)
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!compoundId,
  });

  const isLoading = compoundLoading || metricsLoading || propertiesLoading || revenueLoading;

  // Transform revenue history for Recharts
  const chartData = revenueHistory?.months.map((month, index) => {
    const dataPoint: any = { month: month.substring(5) }; // "01", "02", etc.

    revenueHistory.properties.forEach(property => {
      dataPoint[property.property_name] = property.data[index];
    });

    return dataPoint;
  }) || [];

  // Colors for chart (professional palette)
  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (isLoading) {
    return (
      <OwnerLayout pageTitle="Compound Dashboard">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </OwnerLayout>
    );
  }

  if (!compound || !metrics) {
    return (
      <OwnerLayout pageTitle="Compound Dashboard">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load compound data</p>
          </CardContent>
        </Card>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout pageTitle={compound.name}>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/owner/dashboard" className="hover:text-[#3B82F6]">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/owner/compounds" className="hover:text-[#3B82F6]">My Compounds</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{compound.name}</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Manrope']">
              {compound.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {compound.address}, {compound.city}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{metrics.total_properties} Properties</Badge>
              <Badge variant={metrics.average_occupancy >= 80 ? 'default' : 'secondary'}>
                {Math.round(metrics.average_occupancy)}% Occupied
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                GHS {metrics.total_revenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.total_bookings}
              </div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
                <BedroomIcon className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(metrics.average_occupancy)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.total_beds_occupied} / {metrics.total_beds} beds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Available Beds</CardTitle>
                <BuildingIcon className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.total_beds_available}
              </div>
              <p className="text-xs text-gray-500 mt-1">Ready to book</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-['Manrope']">
              Revenue Trends (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    tickLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `GHS ${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: any) => [`GHS ${value.toLocaleString()}`, '']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  {revenueHistory?.properties.map((property, index) => (
                    <Area
                      key={property.property_id}
                      type="monotone"
                      dataKey={property.property_name}
                      stackId="1"
                      stroke={chartColors[index % chartColors.length]}
                      fill={chartColors[index % chartColors.length]}
                      fillOpacity={0.6}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-['Manrope']">
              Property Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {properties && properties.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Property</TableHead>
                      <TableHead className="font-semibold">Block</TableHead>
                      <TableHead className="font-semibold text-right">Revenue (Month)</TableHead>
                      <TableHead className="font-semibold text-right">Occupancy</TableHead>
                      <TableHead className="font-semibold text-right">Bookings</TableHead>
                      <TableHead className="font-semibold text-right">Beds</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow
                        key={property.property_id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/owner/property/${property.property_id}/view`)}
                      >
                        <TableCell className="font-medium">{property.property_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{property.block_identifier}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          GHS {property.revenue_this_month.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              property.occupancy_rate >= 80
                                ? 'default'
                                : property.occupancy_rate >= 50
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {Math.round(property.occupancy_rate)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{property.total_bookings}</TableCell>
                        <TableCell className="text-right">
                          {property.beds_occupied} / {property.total_beds}
                        </TableCell>
                        <TableCell>
                          <Badge variant={property.is_available ? 'default' : 'secondary'}>
                            {property.is_available ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No properties in this compound yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold font-['Manrope']">
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {booking.profiles?.first_name} {booking.profiles?.last_name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {booking.properties?.title} • {booking.booking_reference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-gray-900">
                        GHS {booking.total_amount.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OwnerLayout>
  );
};

export default CompoundDashboard;

