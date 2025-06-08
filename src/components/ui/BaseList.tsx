import React from 'react';
import { cn } from '@/lib/utils';

interface BaseListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function BaseList<T>({ items, renderItem, className }: BaseListProps<T>) {
  return (
    <ul className={cn('divide-y divide-gray-200', className)}>
      {items.map((item, idx) => (
        <li key={idx} className="py-2">
          {renderItem(item, idx)}
        </li>
      ))}
    </ul>
  );
} 