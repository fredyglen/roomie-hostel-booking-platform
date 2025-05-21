
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
        data-testid="test-image"
      />
    );
    
    const image = screen.getByTestId('test-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });
  
  it('renders with fallback image when primary image fails to load', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        fallbackSrc="https://example.com/fallback.jpg"
        fallbackAlt="Fallback image"
        data-testid="test-image"
      />
    );
    
    const image = screen.getByTestId('test-image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Check that fallback image is used
    expect(image).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    expect(image).toHaveAttribute('alt', 'Fallback image');
  });
  
  it('uses default fallback image when fallbackSrc is not provided', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        data-testid="test-image"
      />
    );
    
    const image = screen.getByTestId('test-image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Check that default fallback image is used
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/800x450?text=No+Image+Available');
    expect(image).toHaveAttribute('alt', 'Image not available');
  });
});
