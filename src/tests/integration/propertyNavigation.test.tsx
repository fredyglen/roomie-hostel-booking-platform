import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockProperties, mockNavigate, mockUseNavigate } from '../utils/test-mocks';

// Mock the react-router-dom's useNavigate hook BEFORE any imports that use it
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUseNavigate,
  };
});

import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import PropertyListContainer from '@/components/properties/PropertyListContainer';

describe('Property Navigation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate to property details when a property card is clicked', async () => {
    render(<PropertyListContainer properties={mockProperties} />);

    // Find the first property card
    const propertyCard = screen.getByText(mockProperties[0].title);
    expect(propertyCard).toBeInTheDocument();

    // Click the card (title) to view details
    fireEvent.click(propertyCard);

    // Verify navigation occurred with correct path
    expect(mockNavigate).toHaveBeenCalledWith(`/student/property/${mockProperties[0].id}`, expect.any(Object));
  });

  it('should navigate to property story when view story is clicked', async () => {
    render(<PropertyListContainer properties={mockProperties} />);

    // Find and click the "View story" icon button
    const viewStoryButton = screen.getAllByLabelText(/View story/i)[0];
    fireEvent.click(viewStoryButton);

    // Verify navigation occurred with correct path
    expect(mockNavigate).toHaveBeenCalledWith(`/student/property/${mockProperties[0].id}/story`, expect.any(Object));
  });

  it('should filter properties based on search input', async () => {
    render(<PropertyListContainer properties={mockProperties} />);
    
    // Find the search input
    const searchInput = screen.getByPlaceholderText(/Search/i);
    
    // Type in the search input to filter properties
    fireEvent.change(searchInput, { target: { value: 'Homestel' } });
    
    // Verify that only the homestel property is displayed
    expect(screen.getByText(mockProperties[1].title)).toBeInTheDocument();
    expect(screen.queryByText(mockProperties[0].title)).not.toBeInTheDocument();
  });
});
