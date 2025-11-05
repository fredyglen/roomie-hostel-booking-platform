/**
 * Compounds List Page
 * 
 * Professional compound management interface for property owners/agents.
 * Displays grid of compound cards with key metrics and search/filter functionality.
 * 
 * Design: Clean Material Design 3, data-focused, responsive mobile-first
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import { CompoundAnalyticsService, CompoundMetrics } from '@/services/compound-analytics.service';
import OwnerLayout from '@/components/layout/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BuildingIcon, PlusIcon, SearchIcon, TrendingUpIcon, UsersIcon, BedroomIcon } from '@/components/ui/SolarIcons';
import { logger } from '@/utils/enhanced-logger';

interface Compound {
  id: string;
  name: string;
  address: string;
  city: string;
  total_properties: number;
  total_rooms: number;
  total_beds: number;
  occupancy_rate: number;
  created_at: string;
}

const CompoundsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOccupancy, setFilterOccupancy] = useState<string>('all');

  // Fetch compounds for current owner
  const { data: compounds, isLoading, error, refetch } = useQuery({
    queryKey: ['owner-compounds', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      logger.info('Fetching compounds for owner', { ownerId: user.id });

      const { data, error } = await supabase
        .from('compounds')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('Compounds fetched', { count: data?.length || 0 });
      return data as Compound[];
    },
    enabled: !!user?.id,
  });

  // Fetch metrics for each compound
  const { data: compoundMetrics } = useQuery({
    queryKey: ['compound-metrics', compounds?.map(c => c.id)],
    queryFn: async () => {
      if (!compounds || compounds.length === 0) return {};

      const metricsPromises = compounds.map(async (compound) => {
        const metrics = await CompoundAnalyticsService.getCompoundMetrics(compound.id);
        return { [compound.id]: metrics };
      });

      const metricsArray = await Promise.all(metricsPromises);
      return Object.assign({}, ...metricsArray) as Record<string, CompoundMetrics | null>;
    },
    enabled: !!compounds && compounds.length > 0,
  });

  // Filter compounds
  const filteredCompounds = compounds?.filter(compound => {
    const matchesSearch = compound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         compound.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterOccupancy === 'all') return true;
    if (filterOccupancy === 'high') return compound.occupancy_rate >= 80;
    if (filterOccupancy === 'low') return compound.occupancy_rate < 50;

    return true;
  }) || [];

  const handleCreateCompound = () => {
    navigate('/owner/compounds/new');
  };

  const handleViewCompound = (compoundId: string) => {
    navigate(`/owner/compounds/${compoundId}`);
  };

  return (
    <OwnerLayout pageTitle="My Compounds">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Lexend, sans-serif' }}>
              My Compounds
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your multi-property compounds
            </p>
          </div>
          <Button
            onClick={handleCreateCompound}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Compound
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search compounds by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterOccupancy} onValueChange={setFilterOccupancy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by occupancy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Compounds</SelectItem>
              <SelectItem value="high">High Occupancy (&gt;80%)</SelectItem>
              <SelectItem value="low">Low Occupancy (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 font-medium">Failed to load compounds</p>
                <p className="text-sm text-red-500 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCompounds.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No compounds yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {searchQuery || filterOccupancy !== 'all'
                    ? 'No compounds match your search criteria'
                    : 'Get started by creating your first compound'}
                </p>
                {!searchQuery && filterOccupancy === 'all' && (
                  <Button onClick={handleCreateCompound} className="mt-6 bg-[#3B82F6] hover:bg-[#2563EB]">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Your First Compound
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compounds Grid */}
        {!isLoading && !error && filteredCompounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompounds.map((compound) => {
              const metrics = compoundMetrics?.[compound.id];

              return (
                <Card
                  key={compound.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewCompound(compound.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Lexend, sans-serif' }}>
                          {compound.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {compound.city}
                        </p>
                      </div>
                      <Badge
                        variant={compound.occupancy_rate >= 80 ? 'default' : compound.occupancy_rate >= 50 ? 'secondary' : 'outline'}
                        className="ml-2"
                      >
                        {Math.round(compound.occupancy_rate)}% Full
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Properties Count */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <BuildingIcon className="h-4 w-4 mr-2" />
                          <span>Properties</span>
                        </div>
                        <span className="font-medium text-gray-900">{compound.total_properties}</span>
                      </div>

                      {/* Total Beds */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <BedroomIcon className="h-4 w-4 mr-2" />
                          <span>Total Beds</span>
                        </div>
                        <span className="font-medium text-gray-900">{compound.total_beds || 0}</span>
                      </div>

                      {/* Revenue (if metrics loaded) */}
                      {metrics && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <TrendingUpIcon className="h-4 w-4 mr-2" />
                            <span>Revenue (This Month)</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            GHS {metrics.total_revenue.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* View Button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCompound(compound.id);
                        }}
                      >
                        View Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default CompoundsList;

