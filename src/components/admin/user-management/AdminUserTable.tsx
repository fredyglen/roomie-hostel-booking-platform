/**
 * Admin User Table Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Displays admin users in a comprehensive table format
 * with sorting, pagination, and action capabilities for the ROOMi platform
 * admin portal
 * 
 * Technical Implementation: Uses shadcn/ui table components with proper
 * TypeScript typing, responsive design, and accessibility features
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Crown, 
  School, 
  MapPin,
  Calendar,
  Mail,
  Phone,
  UserCheck,
  UserX
} from 'lucide-react';
import { AdminUserProfile } from '@/services/admin/adminUserService';
import { getUniversityDisplayName } from '@/schemas/admin-user-schemas';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface AdminUserTableProps {
  readonly users: readonly AdminUserProfile[];
  readonly totalCount: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
  readonly onEditUser?: (user: AdminUserProfile) => void;
  readonly onDeleteUser?: (user: AdminUserProfile) => void;
}

// ============================================================================
// ADMIN USER TABLE COMPONENT
// ============================================================================

/**
 * Admin User Table Component
 * Displays admin users with comprehensive information and actions
 */
const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onEditUser,
  onDeleteUser
}) => {

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderUserAvatar = (user: AdminUserProfile) => (
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
      <AvatarFallback className="bg-purple-100 text-purple-600">
        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );

  const renderUserInfo = (user: AdminUserProfile) => (
    <div className="flex items-center space-x-3">
      {renderUserAvatar(user)}
      <div>
        <div className="font-medium text-gray-900">
          {user.firstName} {user.lastName}
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Mail className="h-3 w-3" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Phone className="h-3 w-3" />
            <span>{user.phone}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderRoleBadge = (role: string) => {
    if (role === 'supreme_admin') {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="h-3 w-3 mr-1" />
          Supreme Admin
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <School className="h-3 w-3 mr-1" />
        Campus Admin
      </Badge>
    );
  };

  const renderJurisdictions = (user: AdminUserProfile) => {
    if (user.role === 'supreme_admin') {
      return (
        <Badge variant="outline" className="text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          Global Access
        </Badge>
      );
    }

    const campusJurisdictions = user.jurisdictions.filter(j => j.type === 'campus');
    
    if (campusJurisdictions.length === 0) {
      return (
        <Badge variant="outline" className="text-xs text-gray-500">
          No assignments
        </Badge>
      );
    }

    if (campusJurisdictions.length === 1) {
      const jurisdiction = campusJurisdictions[0];
      const universityCode = jurisdiction.metadata?.university_code || jurisdiction.code;
      
      return (
        <Badge variant="outline" className="text-xs">
          <School className="h-3 w-3 mr-1" />
          {universityCode}
        </Badge>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {campusJurisdictions.slice(0, 2).map((jurisdiction) => {
          const universityCode = jurisdiction.metadata?.university_code || jurisdiction.code;
          return (
            <Badge key={jurisdiction.id} variant="outline" className="text-xs">
              <School className="h-3 w-3 mr-1" />
              {universityCode}
            </Badge>
          );
        })}
        {campusJurisdictions.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{campusJurisdictions.length - 2} more
          </Badge>
        )}
      </div>
    );
  };

  const renderStatusBadge = (user: AdminUserProfile) => {
    if (user.isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <UserCheck className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <UserX className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const renderCreatedDate = (date: Date) => (
    <div className="text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <Calendar className="h-3 w-3" />
        <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
      </div>
      <div className="text-xs text-gray-500">
        {date.toLocaleDateString()}
      </div>
    </div>
  );

  const renderActions = (user: AdminUserProfile) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onEditUser && (
          <DropdownMenuItem onClick={() => onEditUser(user)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
        )}
        {onDeleteUser && (
          <DropdownMenuItem 
            onClick={() => onDeleteUser(user)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-700">
          Showing {startItem} to {endItem} of {totalCount} admin users
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <UserX className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No admin users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No admin users match your current filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{renderUserInfo(user)}</TableCell>
                <TableCell>{renderRoleBadge(user.role)}</TableCell>
                <TableCell>{renderJurisdictions(user)}</TableCell>
                <TableCell>{renderStatusBadge(user)}</TableCell>
                <TableCell>{renderCreatedDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {(onEditUser || onDeleteUser) && renderActions(user)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {renderPagination()}
      </CardContent>
    </Card>
  );
};

export default AdminUserTable;
