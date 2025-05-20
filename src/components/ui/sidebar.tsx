
import React from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  const isMobile = useMobile();
  
  return (
    <div 
      className={cn(
        "h-screen border-r py-4 px-2 shadow-sm",
        isMobile ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Sidebar;
