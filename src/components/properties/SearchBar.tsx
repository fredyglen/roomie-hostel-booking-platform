
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
          placeholder="Search by property name, address or type"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={onToggleFilters}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Icon icon="solar:filter-linear" className="text-white" width={18} height={18} />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </div>
  );
};

export default SearchBar;
