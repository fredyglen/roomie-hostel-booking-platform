
import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { describe, it, expect } from 'vitest';
import LoadingIndicator from '@/components/common/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders loading indicator with default size', () => {
    render(<LoadingIndicator data-testid="loader" />);
    
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });
  
  it('renders loading indicator with specified size', () => {
    render(<LoadingIndicator size="lg" data-testid="loader" />);
    
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });
  
  it('renders loading indicator with message when provided', () => {
    render(
      <LoadingIndicator 
        message="Loading content..."
        data-testid="loader"
      />
    );
    
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });
});
