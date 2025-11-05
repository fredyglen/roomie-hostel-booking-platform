
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
    const fallbackSrc = '/placeholder.svg';
    render(
      <ImageWithFallback
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
        className="test-image"
        fallbackSrc={fallbackSrc}
      />
    );

    const image = screen.getByAltText('Test image') as HTMLImageElement;

    // Initially shows the provided src
    expect(image.src).toContain('invalid-image.jpg');

    // Simulate image load error
    fireEvent.error(image);

    // After error, should show fallback image
    expect(image.src).toContain('placeholder.svg');
  });

  it('renders image with correct attributes', () => {
    render(
      <ImageWithFallback
        src="https://example.com/image.jpg"
        alt="Test image"
        className="test-image"
        priority={true}
      />
    );

    const image = screen.getByAltText('Test image') as HTMLImageElement;

    // Check that image is rendered with correct attributes
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('test-image');
    expect(image).toHaveAttribute('loading', 'eager'); // priority=true sets eager loading
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
