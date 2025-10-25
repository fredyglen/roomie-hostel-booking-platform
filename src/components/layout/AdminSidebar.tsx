import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  DashboardIcon as LayoutDashboard,
  UsersIcon as Users,
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  DollarIcon as DollarSign,
  FileCheckIcon as FileCheck,
  StarIcon as Star,
  TrendingUpIcon as Activity,
  SettingsIcon as Settings,
  ShieldOutlineIcon as Shield,
  GlobeIcon as Globe,
  LogoutIcon as LogOut
} from '@/components/ui/SolarIcons';

interface NavItem {
  label: string;
  to?: string;
  icon: React.ReactNode;
  requireSupreme?: boolean;
  disabled?: boolean;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getAdminRole, signOutAdmin } = useAdminAuth();
  const isSupreme = getAdminRole() === 'supreme_admin';

  const isActive = (path?: string) => !!path && location.pathname === path;

  const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={20} color="#E5E7EB"/> },
    { label: 'Users', to: '/admin/users', icon: <Users size={20} color="#E5E7EB"/> },
    { label: 'Properties', to: '/admin/properties', icon: <Building size={20} color="#E5E7EB"/> },
    { label: 'Bookings', to: '/admin/bookings', icon: <Calendar size={20} color="#E5E7EB"/> },
    { label: 'Financials', to: '/admin/finance', icon: <DollarSign size={20} color="#E5E7EB"/> },
    { label: 'Verification', to: '/admin/verification', icon: <FileCheck size={20} color="#E5E7EB"/> },
    // Optional/placeholder items (kept disabled to avoid broken routes)
    { label: 'Reviews', icon: <Star size={20} color="#9CA3AF"/>, disabled: true },
    { label: 'Analytics', icon: <Activity size={20} color="#9CA3AF"/>, disabled: true },
    { label: 'Global', to: '/admin/global', icon: <Globe size={20} color="#E5E7EB"/>, requireSupreme: true },
    { label: 'Settings', to: '/admin/settings', icon: <Settings size={20} color="#E5E7EB"/> },
    { label: 'Security', icon: <Shield size={20} color="#9CA3AF"/>, disabled: true },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col bg-[#0B1220] text-gray-200 border-r border-[#101826] sticky top-0">
      <div className="h-14 flex items-center px-4 border-b border-[#101826] font-semibold tracking-wide">
        ROOMi Admin
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.filter(i => !i.requireSupreme || isSupreme).map((item) => (
            <li key={item.label}>
              {item.disabled ? (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm opacity-50 cursor-not-allowed select-none">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.to!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isActive(item.to)
                      ? 'bg-[#111827] text-white'
                      : 'text-gray-300 hover:bg-[#0F172A] hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-2 py-3 border-t border-[#101826]">
        <button
          onClick={async () => { await signOutAdmin(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-300 hover:bg-[#0F172A] hover:text-white transition-colors duration-150"
        >
          <LogOut size={20} color="#E5E7EB"/>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

