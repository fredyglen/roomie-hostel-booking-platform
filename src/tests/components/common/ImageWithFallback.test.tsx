
import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ImageWithFallback from '@/components/common/ImageWithFallback';

describe('ImageWithFallback', () => {
  it('renders with the primary image source', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/image.jpg"
        alt="Test image"
        className="test-image"
      />
    );
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });
  
  it('renders fallback when primary image fails to load', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        className="test-image"
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Check that fallback content is displayed
    const fallbackContent = screen.getByText('Image not available');
    expect(fallbackContent).toBeInTheDocument();
  });
  
  it('shows loading state initially', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/image.jpg"
        alt="Test image"
        className="test-image"
      />
    );
    
    // Check for loading state (image should be hidden initially)
    const image = screen.getByAltText('Test image');
    expect(image).toHaveStyle({ display: 'none' });
  });

  it('calls onError callback when image fails to load', () => {
    const onErrorMock = vi.fn();
    
    render(
      <ImageWithFallback 
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        onError={onErrorMock}
        className="test-image"
      />
    );
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
});
