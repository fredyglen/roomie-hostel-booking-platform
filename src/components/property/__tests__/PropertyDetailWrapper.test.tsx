// Property Detail Wrapper Test
// Tests responsive behavior between mobile modal and desktop bento-box

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyDetailWrapper from '../PropertyDetailWrapper';
import { Property } from '@/types/property';

// Mock the device detection hook
jest.mock('@/hooks/useDeviceDetection', () => ({
  useDeviceDetection: jest.fn()
}));

import { useDeviceDetection } from '@/hooks/useDeviceDetection';

// Mock property data
const mockProperty: Property = {
  id: 1,
  title: 'Test Hostel',
  rent: 2500,
  location: 'Test Location',
  bedrooms: 2,
  bathrooms: 1,
  maxOccupants: 4,
  images: ['/test-image.jpg'],
  amenities: ['WiFi', 'Parking', 'Security'],
  propertyType: 'Hostel',
  genderRestriction: 'Mixed',
  isAvailable: true,
  distanceToCampus: '5 min walk',
  description: 'A great test hostel for students.'
};

const renderWrapper = (props = {}) => {
  const defaultProps = {
    property: mockProperty,
    isOpen: true,
    onClose: jest.fn(),
    onBookNow: jest.fn(),
    onViewStory: jest.fn(),
    ...props
  };

  return render(
    <BrowserRouter>
      <PropertyDetailWrapper {...defaultProps} />
    </BrowserRouter>
  );
};

describe('PropertyDetailWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders mobile modal on mobile device', () => {
    // Mock mobile device
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenWidth: 375,
      screenHeight: 667
    });

    renderWrapper();
    
    // Should show mobile modal (look for drag handle which is mobile-specific)
    expect(document.querySelector('.w-12.h-1\\.5.bg-gray-300.rounded-full')).toBeInTheDocument();
  });

  test('renders desktop layout on desktop device', () => {
    // Mock desktop device
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenWidth: 1440,
      screenHeight: 900
    });

    renderWrapper();
    
    // Should show desktop layout (look for bento grid which is desktop-specific)
    expect(document.querySelector('.grid.grid-cols-4.grid-rows-4')).toBeInTheDocument();
  });

  test('renders mobile modal on tablet device', () => {
    // Mock tablet device
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      screenWidth: 768,
      screenHeight: 1024
    });

    renderWrapper();
    
    // Should show mobile modal for tablets
    expect(document.querySelector('.w-12.h-1\\.5.bg-gray-300.rounded-full')).toBeInTheDocument();
  });

  test('switches layout based on screen size', () => {
    // Start with mobile
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      screenWidth: 375,
      screenHeight: 667
    });

    const { rerender } = renderWrapper();
    
    // Should show mobile modal
    expect(document.querySelector('.w-12.h-1\\.5.bg-gray-300.rounded-full')).toBeInTheDocument();

    // Switch to desktop
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenWidth: 1440,
      screenHeight: 900
    });

    rerender(
      <BrowserRouter>
        <PropertyDetailWrapper
          property={mockProperty}
          isOpen={true}
          onClose={jest.fn()}
          onBookNow={jest.fn()}
          onViewStory={jest.fn()}
        />
      </BrowserRouter>
    );
    
    // Should now show desktop layout
    expect(document.querySelector('.grid.grid-cols-4.grid-rows-4')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    (useDeviceDetection as jest.Mock).mockReturnValue({
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenWidth: 1440,
      screenHeight: 900
    });

    renderWrapper({ isOpen: false });
    
    // Should not render anything when closed
    expect(screen.queryByText('Test Hostel')).not.toBeInTheDocument();
  });
});
