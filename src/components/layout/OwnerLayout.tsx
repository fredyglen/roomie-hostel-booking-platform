import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardIcon,
  BuildingIcon,
  CalendarIcon,
  UserCircleIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
  ArrowLeftIcon,
  TrendingUpIcon
} from '@/components/ui/SolarIcons';
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
  // Reveal sidebar on hover when collapsed
  const [isHoveringSidebar, setIsHoveringSidebar] = React.useState(false);
  const computedSidebarOpen = isSidebarOpen || isHoveringSidebar;

  const navigationItems = [
    { title: 'Dashboard', path: '/owner/dashboard', icon: <DashboardIcon /> },
    { title: 'Analytics', path: '/owner/analytics', icon: <TrendingUpIcon /> },
    { title: 'Properties', path: '/owner/properties', icon: <BuildingIcon /> },
    { title: 'Compounds', path: '/owner/compounds', icon: <BuildingIcon /> }, // Using BuildingIcon for compounds
    { title: 'Bookings', path: '/owner/bookings', icon: <CalendarIcon /> },
    { title: 'Profile', path: '/owner/profile', icon: <UserCircleIcon /> },
    { title: 'Settings', path: '/owner/settings', icon: <SettingsIcon /> },
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
      {/* Sidebar for desktop - 2024 Responsive Standards */}
      <div
        onMouseEnter={() => setIsHoveringSidebar(true)}
        onMouseLeave={() => setIsHoveringSidebar(false)}
        className={`bg-white shadow-md z-20 fixed inset-y-0 left-0 transform ${computedSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${computedSidebarOpen ? 'w-60' : 'w-0 lg:w-16'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-2 lg:p-3 flex items-center ${!computedSidebarOpen && 'justify-center'}`}>
            {computedSidebarOpen ? (
              <div className="flex items-center">
                <Logo variant="default" />
                <span className="ml-2 text-lg lg:text-xl font-bold text-[#7E69AB]">Owner</span>
              </div>
            ) : (
              <Logo variant="default" withText={false} />
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="ml-auto lg:block hidden p-1 hover:bg-gray-100 rounded-md transition-colors"
              title={computedSidebarOpen ? 'Collapse' : 'Expand'}
            >
              {computedSidebarOpen ? (
                // ««« icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                // »»» icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="py-2 lg:py-3 flex-1 overflow-y-auto">
            <nav className="px-1 lg:px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-2 lg:px-3 py-2 text-sm rounded-md transition-colors
                    ${isActiveLink(item.path)
                      ? 'bg-[#9b87f5] text-white'
                      : 'text-gray-600 hover:bg-[#9b87f5]/10'
                    }
                    ${!computedSidebarOpen ? 'justify-center' : ''}
                  `}
                  title={!computedSidebarOpen ? item.title : undefined}
                >
                  <span className={`${computedSidebarOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                  {computedSidebarOpen && <span className="text-sm">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-2 lg:p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-2 lg:px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-[#9b87f5]/10 transition-colors ${!computedSidebarOpen ? 'justify-center' : ''}`}
              title={!computedSidebarOpen ? 'Logout' : undefined}
            >
              <span className={`${computedSidebarOpen ? 'mr-3' : ''}`}><LogoutIcon /></span>
              {computedSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button - 2024 Standards */}
      <div className="lg:hidden fixed top-0 left-0 z-30 m-2 lg:m-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-white shadow-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <CloseIcon />
          ) : (
            <MenuIcon />
          )}
        </button>
      </div>

      {/* Mobile menu - 2024 Standards */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <Logo variant="default" />
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-base rounded-lg transition-colors
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
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-base text-gray-600 rounded-lg hover:bg-[#9b87f5]/10 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content - 2024 Responsive Standards */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-3 sm:px-4 lg:px-4 py-2 lg:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 lg:space-x-3">
                {shouldShowBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center space-x-1 text-sm"
                  >
                    <ArrowLeftIcon />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                )}
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{pageTitle}</h1>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="relative">
                  <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:text-gray-600 transition-colors">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>

                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] hover:bg-gray-100 p-1 transition-colors">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-[#9b87f5] text-white flex items-center justify-center">
                    <UserCircleIcon />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
