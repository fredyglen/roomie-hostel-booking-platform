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
