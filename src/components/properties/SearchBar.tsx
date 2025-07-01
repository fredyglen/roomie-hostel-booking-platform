
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onToggleFilters, showFilters }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-grow relative">
        <Icon icon="solar:search-linear" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
        <Input
          type="text"
          placeholder="Search properties, locations..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-12"
        />
        <button
          onClick={onToggleFilters}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors"
          title={showFilters ? 'Hide Filters' : 'Show Filters'}
        >
          <Icon
            icon="solar:filter-linear"
            className={`${showFilters ? 'text-primary' : 'text-gray-400'} hover:text-primary`}
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
