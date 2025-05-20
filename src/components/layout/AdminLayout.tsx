
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Building, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react";
import Logo from '../common/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigationItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { title: 'Properties', path: '/admin/properties', icon: <Building className="w-5 h-5" /> },
    { title: 'Bookings', path: '/admin/bookings', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className={`bg-white shadow-md z-20 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'}`}>
        <div className="flex flex-col h-full">
          <div className={`p-4 flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center">
                <Logo variant="default" />
                <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
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
                      ? 'bg-roomi-blue bg-opacity-10 text-roomi-blue' 
                      : 'text-gray-600 hover:bg-gray-100'
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
            <Link
              to="/logout"
              className="flex items-center px-4 py-3 text-sm text-gray-600 rounded-md hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {isSidebarOpen && <span>Logout</span>}
            </Link>
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
            <div className="p-4 border-b flex items-center">
              <Logo variant="default" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
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
                        ? 'bg-roomi-blue bg-opacity-10 text-roomi-blue' 
                        : 'text-gray-600 hover:bg-gray-100'
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
              <Link
                to="/logout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-600 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                  </button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>

                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-roomi-blue">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-roomi-blue text-white flex items-center justify-center">
                    <span className="font-medium">A</span>
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

export default AdminLayout;
