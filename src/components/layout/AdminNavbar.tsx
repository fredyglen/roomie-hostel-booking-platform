
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/common/Logo';
import { 
  User, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Users, 
  Building, 
  Calendar,
  Shield
} from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'AD';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard">
              <Logo />
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link 
                to="/admin/dashboard" 
                className={`${isActive('/admin/dashboard') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center`}
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className={`${isActive('/admin/users') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center`}
              >
                <Users className="h-4 w-4 mr-1" />
                Users
              </Link>
              <Link 
                to="/admin/properties" 
                className={`${isActive('/admin/properties') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center`}
              >
                <Building className="h-4 w-4 mr-1" />
                Properties
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`${isActive('/admin/bookings') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Bookings
              </Link>
              <Link 
                to="/admin/verification" 
                className={`${isActive('/admin/verification') ? 'text-[#9b87f5]' : 'text-gray-500'} hover:text-[#9b87f5] text-sm font-medium flex items-center`}
              >
                <Shield className="h-4 w-4 mr-1" />
                Verification
              </Link>
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
                    <AvatarImage src={user?.avatarUrl} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-[#9b87f5]">{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
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
