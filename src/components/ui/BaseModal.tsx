import React from 'react';
import { cn } from '@/lib/utils';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/40', className)}>
      <div className="bg-white rounded-lg shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        {children}
      </div>
    </div>
  );
}; 