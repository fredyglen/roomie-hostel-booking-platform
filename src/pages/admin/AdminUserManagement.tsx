/**
 * Admin User Management Page
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive admin user management interface
 * for Supreme Admins to create, edit, and manage admin accounts with role-based
 * access control and jurisdiction assignment for Ghana universities
 * 
 * Technical Implementation: Integrates with AdminUserService for database
 * operations, implements real-time updates, and maintains comprehensive
 * audit trails following BE CONSCIOUS standards
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { usePermissions, useUserManagementPermissions } from '@/hooks/usePermissions';
import AdminLayout from '@/components/layout/AdminLayout';
import PermissionGuard, { SupremeAdminOnly, FeatureGuard } from '@/components/auth/PermissionGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  School,
  Crown,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { createAdminPermission } from '@/types/auth';
import { ADMIN_PERMISSIONS } from '@/services/auth/permissionService';
import { adminUserService, AdminUserProfile } from '@/services/admin/adminUserService';
import { AdminUserFilterValues } from '@/schemas/admin-user-schemas';
import CreateAdminUserForm from '@/components/admin/user-management/CreateAdminUserForm';
import EditAdminUserForm from '@/components/admin/user-management/EditAdminUserForm';
import AdminUserTable from '@/components/admin/user-management/AdminUserTable';
import AdminUserFilters from '@/components/admin/user-management/AdminUserFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { toast } from '@/components/ui/use-toast';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// ADMIN USER MANAGEMENT COMPONENT
// ============================================================================

/**
 * Admin User Management Page Component
 * Provides comprehensive admin user management interface
 */
const AdminUserManagement: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const { hasPermission, isSupremeAdmin } = usePermissions();
  const { canCreateUsers, canUpdateUsers, canDeleteUsers, canManageAdmins } = useUserManagementPermissions();
  const queryClient = useQueryClient();
  
  // Component state
  const [filters, setFilters] = useState<AdminUserFilterValues>({
    search: '',
    role: 'all',
    status: 'all',
    university: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!canManageAdmins) {
    return (
      <AdminLayout
        pageTitle="Admin User Management"
        requiredPermission={ADMIN_PERMISSIONS.USERS.MANAGE_ADMINS}
        showRoleInfo
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to manage admin users. Contact your system administrator.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const {
    data: adminUsersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminUserService.getAdminUsers(filters),
    staleTime: 30000, // 30 seconds
    retry: 2
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const createUserMutation = useMutation({
    mutationFn: adminUserService.createAdminUser.bind(adminUserService),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Admin User Created",
          description: `Successfully created admin user: ${result.data.email}`,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        setShowCreateDialog(false);
        
        logger.info('Admin user created via UI', {
          createdUserId: result.data.id,
          createdBy: adminUser?.id
        });
      } else {
        toast({
          title: "Creation Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      logger.error('Admin user creation failed', { error });
      toast({
        title: "Creation Failed",
        description: "An unexpected error occurred while creating the admin user.",
        variant: "destructive",
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: adminUserService.updateAdminUser.bind(adminUserService),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Admin User Updated",
          description: `Successfully updated admin user: ${result.data.email}`,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        setShowEditDialog(false);
        setSelectedUser(null);
      } else {
        toast({
          title: "Update Failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    }
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleCreateUser = (userData: any) => {
    if (!adminUser) return;
    
    createUserMutation.mutate({
      userData,
      createdBy: adminUser.id
    });
  };

  const handleEditUser = (user: AdminUserProfile) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleUpdateUser = (userData: any) => {
    if (!adminUser || !selectedUser) return;
    
    updateUserMutation.mutate({
      userId: selectedUser.id,
      userData,
      updatedBy: adminUser.id
    });
  };

  const handleFilterChange = (newFilters: Partial<AdminUserFilterValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin User Management</h1>
          <p className="text-gray-600">Manage admin accounts and permissions</p>
        </div>
      </div>
      
      <SupremeAdminOnly>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Create a new admin user with appropriate role and jurisdiction assignments.
              </DialogDescription>
            </DialogHeader>
            <CreateAdminUserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateDialog(false)}
              isSubmitting={createUserMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </SupremeAdminOnly>
    </div>
  );

  const renderStats = () => {
    if (!adminUsersData?.success) return null;
    
    const { users } = adminUsersData.data;
    const supremeAdmins = users.filter(u => u.role === 'supreme_admin').length;
    const campusAdmins = users.filter(u => u.role === 'campus_admin').length;
    const activeUsers = users.filter(u => u.isActive).length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Supreme Admins</p>
                <p className="text-2xl font-bold">{supremeAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <School className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Campus Admins</p>
                <p className="text-2xl font-bold">{campusAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <AdminLayout 
      pageTitle="Admin User Management" 
      requiredPermission={createAdminPermission('users.manage')}
      showRoleInfo
    >
      {renderHeader()}
      {renderStats()}
      
      {/* Filters */}
      <AdminUserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />
      
      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading admin users..." />
      ) : error ? (
        <ErrorDisplay 
          error={error} 
          onRetry={refetch}
          title="Failed to load admin users"
        />
      ) : adminUsersData?.success ? (
        <AdminUserTable
          users={adminUsersData.data.users}
          totalCount={adminUsersData.data.totalCount}
          currentPage={filters.page}
          pageSize={filters.limit}
          onPageChange={handlePageChange}
          onEditUser={canUpdateUsers ? handleEditUser : undefined}
          onDeleteUser={canDeleteUsers ? undefined : undefined} // TODO: Implement delete
        />
      ) : (
        <ErrorDisplay 
          error={adminUsersData?.error || { message: 'Unknown error' }}
          onRetry={refetch}
          title="Failed to load admin users"
        />
      )}
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update admin user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditAdminUserForm
              user={selectedUser}
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedUser(null);
              }}
              isSubmitting={updateUserMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUserManagement;
