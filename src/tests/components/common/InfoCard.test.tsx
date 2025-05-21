
import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { describe, it, expect } from 'vitest';
import InfoCard from '@/components/common/InfoCard';
import { Home } from 'lucide-react';

describe('InfoCard', () => {
  it('renders with title and content', () => {
    render(
      <InfoCard 
        title="Test Card Title"
      >
        <p>Test card content</p>
      </InfoCard>
    );
    
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test card content')).toBeInTheDocument();
  });
  
  it('renders with description when provided', () => {
    render(
      <InfoCard 
        title="Test Card Title"
        description="Test card description"
      >
        <p>Test card content</p>
      </InfoCard>
    );
    
    expect(screen.getByText('Test card description')).toBeInTheDocument();
  });
  
  it('renders with icon when provided', () => {
    render(
      <InfoCard 
        title="Test Card Title"
        icon={<Home data-testid="home-icon" />}
      >
        <p>Test card content</p>
      </InfoCard>
    );
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });
  
  it('renders with footer when provided', () => {
    render(
      <InfoCard 
        title="Test Card Title"
        footer={<button>Test Footer Button</button>}
      >
        <p>Test card content</p>
      </InfoCard>
    );
    
    expect(screen.getByRole('button', { name: 'Test Footer Button' })).toBeInTheDocument();
  });
});
