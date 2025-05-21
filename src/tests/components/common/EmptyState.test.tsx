
import React from 'react';
import { render, screen, fireEvent, expect, vi } from '../../utils/test-utils';
import EmptyState from '@/components/common/EmptyState';
import { Search } from 'lucide-react';

describe('EmptyState', () => {
  const mockActionFn = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders with title and description', () => {
    render(
      <EmptyState 
        title="No results found" 
        description="Try adjusting your search criteria" 
      />
    );
    
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
  });
  
  it('renders with icon when provided', () => {
    render(
      <EmptyState 
        icon={<Search data-testid="search-icon" />}
        title="No results found" 
        description="Try adjusting your search criteria" 
      />
    );
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
  
  it('renders action button when actionLabel and onAction are provided', () => {
    render(
      <EmptyState 
        title="No results found" 
        description="Try adjusting your search criteria"
        actionLabel="Clear filters" 
        onAction={mockActionFn}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Clear filters' });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockActionFn).toHaveBeenCalledTimes(1);
  });
  
  it('does not render action button when actionLabel is missing', () => {
    render(
      <EmptyState 
        title="No results found" 
        description="Try adjusting your search criteria"
        onAction={mockActionFn}
      />
    );
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
