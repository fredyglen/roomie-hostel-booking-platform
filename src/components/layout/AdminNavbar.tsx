
/**
 * Enhanced Admin Navbar with Role-Based Access Control
 * Apple-Grade implementation following BE CONSCIOUS standards
 *
 * Business Purpose: Provides navigation for admin portal with role-based menu items,
 * Supreme and Campus admin differentiation, and Ghana-specific admin features
 *
 * Technical Implementation: Integrates with AdminAuthContext for secure authentication,
 * permission-based navigation, and comprehensive session management
 *
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/common/Logo';
import {
  UserCircleIcon as User,
  SettingsIcon as Settings,
  DashboardIcon as LayoutDashboard,
  LogoutIcon as LogOut,
  UsersIcon as Users,
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  ShieldOutlineIcon as Shield,
  GlobeIcon as Globe,
  SchoolIcon as School,
  DollarIcon as DollarSign,
  FileCheckIcon as FileCheck,
  CrownIcon as Crown
} from '@/components/ui/SolarIcons';
import {
  AdminRoleType,
  createAdminPermission,
  createCampusJurisdiction,
  createCountryJurisdiction
} from '@/types/auth';

import { ADMIN_PERMISSIONS } from '@/services/auth/permissionService';

/**
 * Enhanced Admin Navbar Component
 * Provides role-based navigation with Supreme and Campus admin differentiation
 */
const AdminNavbar: React.FC = () => {
  const {
    adminUser,
    adminSession,
    signOutAdmin,
    hasPermission,
    hasJurisdiction,
    getAdminRole,
    validateAccess,
    isAuthenticated,
    getSessionTimeRemaining
  } = useAdminAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get user initials for avatar
   */
  const getInitials = (): string => {
    if (adminUser?.firstName && adminUser?.lastName) {
      return `${adminUser.firstName[0]}${adminUser.lastName[0]}`.toUpperCase();
    }
    return adminUser?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  /**
   * Handle admin sign out with enhanced security
   */
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOutAdmin();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigation even if sign out fails
      navigate('/login');
    }
  };

  /**
   * Check if current path is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Get admin role display information
   */
  const getAdminRoleInfo = (): { label: string; color: string; icon: React.ReactNode } => {
    const role = getAdminRole();

    switch (role) {
      case 'supreme_admin':
        return {
          label: 'Supreme Admin',
          color: 'bg-purple-100 text-purple-800',
          icon: <Crown size={12} />
        };
      case 'campus_admin':
        return {
          label: 'Campus Admin',
          color: 'bg-blue-100 text-blue-800',
          icon: <School size={12} />
        };
      default:
        return {
          label: 'Admin',
          color: 'bg-gray-100 text-gray-800',
          icon: <Shield size={12} />
        };
    }
  };

  /**
   * Get session status for display
   */
  const getSessionStatus = (): { timeRemaining: string; isExpiringSoon: boolean } => {
    const remaining = getSessionTimeRemaining();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
      timeRemaining: `${hours}h ${minutes}m`,
      isExpiringSoon: remaining < 30 * 60 * 1000 // Less than 30 minutes
    };
  };

  const roleInfo = getAdminRoleInfo();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard">
              <Logo />
            </Link>
            {/* Role Badge */}
            <div className="ml-4 hidden md:block">
              <Badge variant="secondary" className={`${roleInfo.color} flex items-center gap-1`}>
                {roleInfo.icon}
                {roleInfo.label}
              </Badge>
            </div>

            {/* Navigation Menu with Role-Based Access */}
            <nav className="hidden md:ml-6 md:flex space-x-6">
              {/* Dashboard - Available to all admins */}
              <Link
                to="/admin/dashboard"
                className={`${isActive('/admin/dashboard') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
              >
                <span className="mr-1"><LayoutDashboard size={16} /></span>
                Dashboard
              </Link>

              {/* Users Management - Role-based access */}
              {(hasPermission(createAdminPermission('users.manage')) ||
                hasPermission(createAdminPermission('campus.read'))) && (
                <Link
                  to="/admin/users"
                  className={`${isActive('/admin/users') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
                >
                  <span className="mr-1"><Users size={16} /></span>
                  Users
                </Link>
              )}

              {/* Properties Management - Available to all admins */}
              <Link
                to="/admin/properties"
                className={`${isActive('/admin/properties') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
              >
                <span className="mr-1"><Building size={16} /></span>
                Properties
              </Link>

              {/* Bookings Management - Available to all admins */}
              <Link
                to="/admin/bookings"
                className={`${isActive('/admin/bookings') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
              >
                <span className="mr-1"><Calendar size={16} /></span>
                Bookings
              </Link>

              {/* Verification - Available to all admins */}
              <Link
                to="/admin/verification"
                className={`${isActive('/admin/verification') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
              >
                <span className="mr-1"><FileCheck size={16} /></span>
                Verification
              </Link>

              {/* Global Management - Supreme Admin only */}
              {getAdminRole() === 'supreme_admin' && (
                <Link
                  to="/admin/global"
                  className={`${isActive('/admin/global') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
                >
                  <span className="mr-1"><Globe size={16} /></span>
                  Global
                </Link>
              )}

              {/* Financial Management - Role-based access */}
              {(getAdminRole() === 'supreme_admin' || getAdminRole() === 'campus_admin' || hasPermission(ADMIN_PERMISSIONS.FINANCE.VIEW_REVENUE)) && (
                <Link
                  to="/admin/finance"
                  className={`${isActive('/admin/finance') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center transition-colors`}
                >
                  <span className="mr-1"><DollarSign size={16} /></span>
                  Finance
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center">
            {/* Admin Badge */}
            <div className="mr-4 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              ADMIN
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={adminUser?.avatarUrl} alt={`${adminUser?.firstName} ${adminUser?.lastName}`} />
                    <AvatarFallback className="bg-[#9b87f5]">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{adminUser?.firstName} {adminUser?.lastName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {adminUser?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`${roleInfo.color} text-xs`}>
                        {roleInfo.icon}
                        {roleInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <span className="mr-2"><Settings size={16} /></span>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <span className="mr-2"><LogOut size={16} /></span>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
