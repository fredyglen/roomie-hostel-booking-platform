import React from 'react';

interface DevBypassIndicatorProps {
  className?: string;
}

export const DevBypassIndicator: React.FC<DevBypassIndicatorProps> = ({ className = '' }) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Check if bypass is active
  const bypassUser = window.__DEV_BYPASS_USER__;
  
  if (!bypassUser) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-1 text-xs font-medium ${className}`}
      style={{
        background: 'linear-gradient(90deg, #dc2626, #ef4444)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      🚨 DEV BYPASS ACTIVE: {bypassUser.email} ({bypassUser.role})
      <button
        onClick={() => {
          delete (window as any).__DEV_BYPASS_USER__;
          window.location.reload();
        }}
        className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
      >
        Clear
      </button>
    </div>
  );
};

export default DevBypassIndicator;
