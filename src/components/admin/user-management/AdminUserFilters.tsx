/**
 * Admin User Filters Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive filtering and search interface
 * for admin user management with real-time updates and validation
 * 
 * Technical Implementation: Uses controlled components with proper TypeScript
 * typing, debounced search, and responsive design following BE CONSCIOUS standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Crown, 
  School, 
  UserCheck, 
  UserX,
  SortAsc,
  SortDesc,
  RefreshCw
} from 'lucide-react';
import { AdminUserFilterValues, GHANA_UNIVERSITIES } from '@/schemas/admin-user-schemas';
import { cn } from '@/lib/utils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface AdminUserFiltersProps {
  readonly filters: AdminUserFilterValues;
  readonly onFilterChange: (filters: Partial<AdminUserFilterValues>) => void;
  readonly className?: string;
}

// ============================================================================
// ADMIN USER FILTERS COMPONENT
// ============================================================================

/**
 * Admin User Filters Component
 * Provides comprehensive filtering interface for admin user management
 */
const AdminUserFilters: React.FC<AdminUserFiltersProps> = ({
  filters,
  onFilterChange,
  className
}) => {
  // Local state for search input (debounced)
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isExpanded, setIsExpanded] = useState(false);

  // ============================================================================
  // DEBOUNCED SEARCH EFFECT
  // ============================================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search, onFilterChange]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onFilterChange({ search: '' });
  };

  const handleRoleChange = (value: string) => {
    onFilterChange({ role: value as AdminUserFilterValues['role'] });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value as AdminUserFilterValues['status'] });
  };

  const handleUniversityChange = (value: string) => {
    onFilterChange({ university: value as AdminUserFilterValues['university'] });
  };

  const handleSortChange = (sortBy: AdminUserFilterValues['sortBy']) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    onFilterChange({ sortBy, sortOrder: newSortOrder });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      search: '',
      role: 'all',
      status: 'all',
      university: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchBar = () => (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search by name or email..."
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchInput && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const renderQuickFilters = () => (
    <div className="flex items-center space-x-2">
      {/* Role Filter */}
      <Select value={filters.role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="supreme_admin">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span>Supreme Admin</span>
            </div>
          </SelectItem>
          <SelectItem value="campus_admin">
            <div className="flex items-center space-x-2">
              <School className="h-4 w-4 text-green-600" />
              <span>Campus Admin</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span>Active</span>
            </div>
          </SelectItem>
          <SelectItem value="inactive">
            <div className="flex items-center space-x-2">
              <UserX className="h-4 w-4 text-red-600" />
              <span>Inactive</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Expand/Collapse Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-1"
      >
        <Filter className="h-4 w-4" />
        <span>{isExpanded ? 'Less' : 'More'}</span>
      </Button>
    </div>
  );

  const renderExpandedFilters = () => {
    if (!isExpanded) return null;

    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* University Filter */}
            <div className="space-y-2">
              <Label>University</Label>
              <Select value={filters.university} onValueChange={handleUniversityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {Object.entries(GHANA_UNIVERSITIES).map(([code, university]) => (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center space-x-2">
                        <School className="h-4 w-4 text-blue-600" />
                        <span>{university.code} - {university.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <div className="flex space-x-2">
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => onFilterChange({ sortBy: value as AdminUserFilterValues['sortBy'] })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="last_sign_in">Last Sign In</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSortChange(filters.sortBy)}
                  className="px-3"
                >
                  {filters.sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Clear All Filters</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActiveFilters = () => {
    const activeFilters: Array<{ key: string; label: string; value: string }> = [];

    if (filters.search) {
      activeFilters.push({ key: 'search', label: 'Search', value: filters.search });
    }
    if (filters.role !== 'all') {
      const roleLabel = filters.role === 'supreme_admin' ? 'Supreme Admin' : 'Campus Admin';
      activeFilters.push({ key: 'role', label: 'Role', value: roleLabel });
    }
    if (filters.status !== 'all') {
      const statusLabel = filters.status === 'active' ? 'Active' : 'Inactive';
      activeFilters.push({ key: 'status', label: 'Status', value: statusLabel });
    }
    if (filters.university !== 'all') {
      const universityLabel = GHANA_UNIVERSITIES[filters.university as keyof typeof GHANA_UNIVERSITIES]?.code || filters.university;
      activeFilters.push({ key: 'university', label: 'University', value: universityLabel });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex items-center space-x-2 mt-3">
        <span className="text-sm text-gray-600">Active filters:</span>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="flex items-center space-x-1">
              <span>{filter.label}: {filter.value}</span>
              <button
                onClick={() => {
                  if (filter.key === 'search') handleClearSearch();
                  else if (filter.key === 'role') handleRoleChange('all');
                  else if (filter.key === 'status') handleStatusChange('all');
                  else if (filter.key === 'university') handleUniversityChange('all');
                }}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </Button>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between space-x-4">
        {renderSearchBar()}
        {renderQuickFilters()}
      </div>

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* Expanded Filters */}
      {renderExpandedFilters()}
    </div>
  );
};

export default AdminUserFilters;
