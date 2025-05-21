
import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNavigate, mockUseNavigate } from '../utils/test-mocks';
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUseNavigate,
    useParams: () => ({ id: '1' }), // Mock the id param to be '1'
  };
});

// Mock toast function
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  }
}));

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    localStorageMock.getItem.mockReturnValue(null); // Default to empty form data
  });

  it('should render the booking steps container', () => {
    render(<BookingStepsContainer />);
    
    // Verify that the booking steps container is rendered
    expect(screen.getByText(/Book Cozy Studio Apartment/i)).toBeInTheDocument();
    expect(screen.getByText(/Room Type/i)).toBeInTheDocument(); // First step should be visible
  });

  it('should navigate through booking steps when "Next" button is clicked', async () => {
    render(<BookingStepsContainer />);
    
    // Select a room type (Step 1)
    const roomTypeRadio = screen.getByText(/1 in a room/i);
    fireEvent.click(roomTypeRadio);
    
    // Click the "Next" button
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Verify that we moved to the next step (Duration)
    await waitFor(() => {
      expect(screen.getByText(/Select Duration and Date/i)).toBeInTheDocument();
    });
    
    // Fill duration fields (Step 2)
    const durationInput = screen.getByLabelText(/Duration/i);
    fireEvent.change(durationInput, { target: { value: '1' } });
    
    const checkInDate = screen.getByLabelText(/Check-in Date/i);
    fireEvent.change(checkInDate, { target: { value: '2023-09-01' } });
    
    // Click Next again
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    
    // Verify that we moved to Personal Information (Step 3)
    await waitFor(() => {
      expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
    });
  });

  it('should go back to previous step when Back button is clicked', async () => {
    render(<BookingStepsContainer />);
    
    // Select a room type and proceed to step 2
    const roomTypeRadio = screen.getByText(/1 in a room/i);
    fireEvent.click(roomTypeRadio);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    
    // Verify that we're on step 2
    await waitFor(() => {
      expect(screen.getByText(/Select Duration and Date/i)).toBeInTheDocument();
    });
    
    // Click Back button
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    // Verify that we're back to step 1
    await waitFor(() => {
      expect(screen.getByText(/Choose Room Type/i)).toBeInTheDocument();
    });
  });
});
