import React from 'react';

// Solar Icons for amenities and features
export const WifiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20L8.5 16.5C9.58 15.42 11.17 14.75 12.5 14.75C13.83 14.75 15.42 15.42 16.5 16.5L12 20Z" fill={color}/>
    <path d="M6.5 14.5C8.5 12.5 11.5 11.5 12.5 11.5C13.5 11.5 16.5 12.5 18.5 14.5L16.5 16.5C15.42 15.42 13.83 14.75 12.5 14.75C11.17 14.75 9.58 15.42 8.5 16.5L6.5 14.5Z" fill={color}/>
    <path d="M4.5 12.5C7.5 9.5 10.5 8.5 12.5 8.5C14.5 8.5 17.5 9.5 20.5 12.5L18.5 14.5C16.5 12.5 13.5 11.5 12.5 11.5C11.5 11.5 8.5 12.5 6.5 14.5L4.5 12.5Z" fill={color}/>
  </svg>
);

export const AirConditionIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.59 6L5.18 4.59C3.8 5.97 3 7.84 3 10H5C5 8.5 5.59 7.09 6.59 6Z" fill={color}/>
    <path d="M19 10C19 7.84 18.2 5.97 16.82 4.59L15.41 6C16.41 7.09 17 8.5 17 10H19Z" fill={color}/>
    <path d="M16.82 19.41C18.2 18.03 19 16.16 19 14H17C17 15.5 16.41 16.91 15.41 18L16.82 19.41Z" fill={color}/>
    <path d="M6.59 18L5.18 19.41C3.8 18.03 3 16.16 3 14H5C5 15.5 5.59 16.91 6.59 18Z" fill={color}/>
    <circle cx="12" cy="12" r="3" fill={color}/>
  </svg>
);

export const LaundryIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2.01L6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V4C20 2.89 19.11 2.01 18 2.01ZM18 20H6V16H18V20ZM18 14H6V4H18V14Z" fill={color}/>
    <circle cx="8" cy="6" r="1" fill="#ffffff"/>
    <circle cx="11" cy="6" r="1" fill="#ffffff"/>
    <circle cx="12" cy="10" r="3" stroke="#ffffff" strokeWidth="1" fill="none"/>
  </svg>
);

export const StudyAreaIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill={color}/>
    <path d="M5 13.18V17.18C5 17.97 5.53 18.65 6.26 18.91L12 21L17.74 18.91C18.47 18.65 19 17.97 19 17.18V13.18L12 17L5 13.18Z" fill={color}/>
  </svg>
);

export const BedroomIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14ZM12.6 6.76C13.52 6.76 14.15 7.39 14.15 8.31V9.44C14.15 10.36 13.52 10.99 12.6 10.99H11.4C10.48 10.99 9.85 10.36 9.85 9.44V8.31C9.85 7.39 10.48 6.76 11.4 6.76H12.6Z" fill={color}/>
    <path d="M20 10V8C20 6.9 19.1 6 18 6H6C4.9 6 4 6.9 4 8V10C2.9 10 2 10.9 2 12V17H4V19H6V17H18V19H20V17H22V12C22 10.9 21.1 10 20 10Z" fill={color}/>
  </svg>
);

export const LocationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill={color}/>
  </svg>
);

export const FilterIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.25 5.61C6.27 8.2 10 13 10 13V19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V13S17.73 8.2 19.75 5.61C20.25 4.95 19.78 4 18.95 4H5.04C4.21 4 3.74 4.95 4.25 5.61Z" fill={color}/>
  </svg>
);

export const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#666' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z" fill={color}/>
  </svg>
);

export const StarIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({ size = 14, color = '#FFD700', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={filled ? 'none' : color} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

export const HeartIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({ size = 20, color = '#0f68fd', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61C20.3 4.07 19.66 3.64 18.96 3.34C18.26 3.04 17.51 2.88 16.75 2.88C16 2.88 15.25 3.04 14.55 3.34C13.85 3.64 13.21 4.07 12.67 4.61L12 5.28L11.33 4.61C10.24 3.52 8.75 2.88 7.25 2.88C5.75 2.88 4.26 3.52 3.17 4.61C2.08 5.7 1.44 7.19 1.44 8.69C1.44 10.19 2.08 11.68 3.17 12.77L12 21.6L20.83 12.77C21.92 11.68 22.56 10.19 22.56 8.69C22.56 7.19 21.92 5.7 20.84 4.61Z"/>
  </svg>
);

export const SecurityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11S10 10.1 10 9S10.9 7 12 7ZM12 17C10.33 17 8.94 16.16 8.24 14.9C8.26 13.58 11 12.9 12 12.9S15.74 13.58 15.76 14.9C15.06 16.16 13.67 17 12 17Z" fill={color}/>
  </svg>
);

export const KitchenIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#0f68fd' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2.01L6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V4C20 2.89 19.11 2.01 18 2.01ZM8 4H9V10H8V4ZM11 4H12V10H11V4ZM18 20H6V12H18V20Z" fill={color}/>
  </svg>
);


// Admin/Owner Navigation Icons (Outline style)
export const DashboardIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

export const TrendingUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17L9 11L13 15L21 7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 11V7H17" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BuildingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="18" rx="1.5"/>
    <rect x="13" y="7" width="8" height="14" rx="1.5"/>
    <path d="M6 7H8M6 11H8M6 15H8" strokeLinecap="round"/>
  </svg>
);

export const CalendarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="2"/>
    <path d="M8 2V6M16 2V6M3 10H21" strokeLinecap="round"/>
  </svg>
);

export const UserCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3"/>
    <path d="M4 20C4 16.6863 7.13401 14 12 14C16.866 14 20 16.6863 20 20" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

export const SettingsIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15A1.65 1.65 0 0 0 20 13.6L22 12L20 10.4A1.65 1.65 0 0 0 19.4 9L19 7L17 6.6A1.65 1.65 0 0 0 15.6 6L14 4L12 6L10.4 6A1.65 1.65 0 0 0 9 6.6L7 7L6.6 9A1.65 1.65 0 0 0 6 10.4L4 12L6 13.6A1.65 1.65 0 0 0 6.6 15L7 17L9 17.4A1.65 1.65 0 0 0 10.4 18L12 20L14 18L15.6 18A1.65 1.65 0 0 0 17 17.4L19 17L19.4 15Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LogoutIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 17L21 12L16 7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19H7C5.89543 19 5 18.1046 5 17V7C5 5.89543 5.89543 5 7 5H12"/>
  </svg>
);

export const MenuIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21M3 12H21M3 18H21" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round"/>
  </svg>
);

export const ArrowLeftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6L9 12L15 18" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UsersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3"/>
    <path d="M2 20C2 16.6863 5.13401 14 9 14C12.866 14 16 16.6863 16 20"/>
    <circle cx="17" cy="9" r="2"/>
    <path d="M21.5 20C21.5 17.7909 19.7091 16 17.5 16"/>
  </svg>
);

export const GlobeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9"/>
    <path d="M3 12H21M12 3C14.7614 6.5 14.7614 17.5 12 21C9.23858 17.5 9.23858 6.5 12 3Z"/>
  </svg>
);

export const DollarIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V22M17 7C17 5.34315 15.2091 4 13 4H10C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10H14C15.6569 10 17 11.3431 17 13C17 14.6569 15.6569 16 14 16H7" strokeLinecap="round"/>
  </svg>
);

export const FileCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"/>
    <path d="M9 13L11 15L15 11" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShieldOutlineIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z"/>
  </svg>
);

export const CrownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7L7 12L12 6L17 12L21 7V18H3V7Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SchoolIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#7E69AB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L2 8L12 13L22 8L12 3Z"/>
    <path d="M6 10V16C6 17.6569 8.68629 19 12 19C15.3137 19 18 17.6569 18 16V10"/>
  </svg>
);
