// Property Detail Modal Test
// Tests for mobile-first modal functionality

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyDetailModal from '../PropertyDetailModal';
import { Property } from '@/types/property';

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

const renderModal = (props = {}) => {
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
      <PropertyDetailModal {...defaultProps} />
    </BrowserRouter>
  );
};

describe('PropertyDetailModal', () => {
  test('renders modal when open', () => {
    renderModal();
    expect(screen.getByText('Test Hostel')).toBeInTheDocument();
    expect(screen.getByText('¢2,500')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('Test Hostel')).not.toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  test('calls onBookNow when book now button clicked', () => {
    const onBookNow = jest.fn();
    renderModal({ onBookNow });
    
    const bookButton = screen.getByText('Book Now');
    fireEvent.click(bookButton);
    
    expect(onBookNow).toHaveBeenCalled();
  });

  test('shows all three tabs', () => {
    renderModal();
    
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Amenities')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  test('switches between tabs', () => {
    renderModal();
    
    // Click amenities tab
    fireEvent.click(screen.getByText('Amenities'));
    expect(screen.getByText("What's included")).toBeInTheDocument();
    
    // Click location tab
    fireEvent.click(screen.getByText('Location'));
    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  test('displays property information correctly', () => {
    renderModal();
    
    expect(screen.getByText('Test Hostel')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('5 min walk')).toBeInTheDocument();
    expect(screen.getByText('A great test hostel for students.')).toBeInTheDocument();
  });

  test('shows amenities in amenities tab', () => {
    renderModal();
    
    // Switch to amenities tab
    fireEvent.click(screen.getByText('Amenities'));
    
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });
});
