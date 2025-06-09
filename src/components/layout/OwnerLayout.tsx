import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Calendar,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from "lucide-react";
import Logo from '../common/Logo';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { navigateBack } from '@/utils/navigation';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface OwnerLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ 
  children, 
  pageTitle, 
  showBackButton = false,
  backUrl
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navigationItems = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Properties', path: '/owner/properties', icon: <Building className="w-5 h-5" /> },
    { title: 'Bookings', path: '/owner/bookings', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Profile', path: '/owner/profile', icon: <UserCircle className="w-5 h-5" /> },
    { title: 'Settings', path: '/owner/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: unknown) {
      ErrorHandler.handle(error, 'OwnerLayout sign out error');
    }
  };

  const handleBack = () => {
    // Safely access location.state.from with type guards
    if (typeof location.state === 'object' && location.state !== null && 'from' in location.state && typeof location.state.from === 'string') {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  // Auto-detect if we should show back button
  const shouldShowBackButton = showBackButton || 
    location.pathname.includes('/new') || 
    location.pathname.includes('/edit') ||
    location.pathname.includes('/property/');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className={`bg-white shadow-md z-20 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'}`}>
        <div className="flex flex-col h-full">
          <div className={`p-4 flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center">
                <Logo variant="default" />
                <span className="ml-2 text-xl font-bold text-[#7E69AB]">Owner</span>
              </div>
            ) : (
              <Logo variant="default" withText={false} />
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="ml-auto md:block hidden"
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="py-4 flex-1 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-md transition-colors
                    ${isActiveLink(item.path) 
                      ? 'bg-[#9b87f5] text-white' 
                      : 'text-gray-600 hover:bg-[#9b87f5]/10'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-600 rounded-md hover:bg-[#9b87f5]/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-30 m-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center h-10 w-10 rounded-md bg-white shadow-md text-gray-600"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Logo variant="default" />
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-sm rounded-md
                      ${isActiveLink(item.path) 
                        ? 'bg-[#9b87f5] text-white' 
                        : 'text-gray-600 hover:bg-[#9b87f5]/10'
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-600 rounded-md hover:bg-[#9b87f5]/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {shouldShowBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center space-x-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                )}
                <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>

                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5]">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[#9b87f5] text-white flex items-center justify-center">
                    <UserCircle className="h-6 w-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
