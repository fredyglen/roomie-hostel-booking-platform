import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNavigate, mockUseNavigate } from '../utils/test-mocks';

// Mock react-router-dom hooks BEFORE any imports that use it
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUseNavigate,
    useParams: () => ({ id: '1' }), // Mock the id param to be '1'
  };
});

// Mock Supabase client to return a predictable property
vi.mock('@/integrations/supabase/client', () => {
  const property = {
    id: '1',
    title: 'Cozy Studio Apartment',
    description: 'Nice',
    address: '123 Main St',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 1500,
    bedrooms: 1,
    bathrooms: 1,
    images: ['/img.jpg'],
    amenities: ['WiFi'],
    is_available: true,
  };
  return {
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: property, error: null }),
          }),
        }),
      }),
      channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    },
  };
});

// Mock Auth context used by booking hook to avoid requiring AuthProvider
vi.mock('@/context/EnhancedAuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user',
      email: 'test@example.com',
      user_metadata: { first_name: 'Test', last_name: 'User', phone: '+233200000000' }
    }
  })
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';

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

  it('should render the booking steps container', async () => {
    render(<BookingStepsContainer />);

    // Wait for first step to render by checking a unique field label
    const firstNameInput = await screen.findByLabelText(/First Name/i);
    expect(firstNameInput).toBeInTheDocument();
  });

  it('should navigate to dates after completing student info', async () => {
    render(<BookingStepsContainer />);

    // Wait for first step to render
    await screen.findByLabelText(/First Name/i);

    // Fill Step 1: Your Information
    fireEvent.change(screen.getAllByLabelText(/First Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByLabelText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getAllByLabelText(/Email Address/i)[0], { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/^\+233 XX XXX XXXX$/)[0], { target: { value: '+233 20 000 0000' } });
    fireEvent.change(screen.getAllByLabelText(/Full Name/i)[0], { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getAllByPlaceholderText(/^e\.g\. \+233 XX XXX XXXX$/)[0], { target: { value: '+233 24 000 0000' } });

    // Select Relationship via shadcn Select
    const relationshipTrigger = screen.getAllByRole('combobox')[0];
    fireEvent.click(relationshipTrigger);
    fireEvent.click(screen.getByText('Parent'));

    // Click Next
    const nextButton = screen.getAllByRole('button', { name: /Next/i })[0];
    fireEvent.click(nextButton);

    // Verify that we moved to the next step (Dates)
    await waitFor(() => {
      expect(screen.getAllByText(/Booking Duration/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/How long are you staying\?/i).length).toBeGreaterThan(0);
    });
  });

  it('should go back to student info when Previous is clicked on dates', async () => {
    render(<BookingStepsContainer />);

    // Wait for first step to render
    await screen.findByLabelText(/First Name/i);

    // Fill Step 1 quickly (scope to first occurrence due to mobile+desktop duplication)
    fireEvent.change(screen.getAllByLabelText(/First Name/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getAllByLabelText(/Last Name/i)[0], { target: { value: 'Doe' } });
    fireEvent.change(screen.getAllByLabelText(/Email Address/i)[0], { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/^\+233 XX XXX XXXX$/)[0], { target: { value: '+233 20 000 0000' } });
    fireEvent.change(screen.getAllByLabelText(/Full Name/i)[0], { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getAllByPlaceholderText(/^e\.g\. \+233 XX XXX XXXX$/)[0], { target: { value: '+233 24 000 0000' } });
    const relationshipTrigger2 = screen.getAllByRole('combobox')[0];
    fireEvent.click(relationshipTrigger2);
    fireEvent.click(screen.getByText('Parent'));

    // Next to dates
    fireEvent.click(screen.getAllByRole('button', { name: /Next/i })[0]);

    // Confirm on dates step
    await waitFor(() => {
      expect(screen.getAllByText(/Booking Duration/i).length).toBeGreaterThan(0);
    });

    // Click Previous to go back
    fireEvent.click(screen.getAllByRole('button', { name: /Previous/i })[0]);

    // Verify we're back to step 1
    await screen.findAllByLabelText(/First Name/i);
    expect(screen.getAllByLabelText(/First Name/i)[0]).toBeInTheDocument();
  });
});
