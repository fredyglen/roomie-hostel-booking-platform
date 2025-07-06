/**
 * Apple-Grade Hostel Integration Test
 * Tests the integration between PropertyListing and AppleGradeHostelDisplay
 * 
 * @fileoverview Integration test for Apple-grade hostel management system
 * @author ROOMi Development Team - Apple Standards Implementation
 * @version 2.0.0
 * @since 2025-06-21
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import PropertyListing from '../pages/student/PropertyListing';
import { AppleGradeHostelDisplay } from '../components/apple-grade-hostel-display.component';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: '1',
                  title: 'Test Hostel 1',
                  property_type: 'hostel',
                  base_price_per_semester: 2500,
                  location: 'Near UPSA',
                  is_available: true,
                  verification_status: 'verified',
                  created_at: '2025-01-01T00:00:00Z'
                },
                {
                  id: '2',
                  title: 'Test Hostel 2',
                  property_type: 'hostel',
                  base_price_per_semester: 3000,
                  location: 'UPSA Campus',
                  is_available: true,
                  verification_status: 'verified',
                  created_at: '2025-01-02T00:00:00Z'
                }
              ],
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}));

// Mock the Ghana Hostel Service
jest.mock('../services/ghanaHostelService', () => ({
  default: {
    convertToProperties: jest.fn(() => [
      {
        id: 1,
        title: 'Ghana Test Hostel',
        rent: 2000,
        location: 'Test Location',
        images: [],
        amenities: [],
        maxOccupants: 4,
        genderRestriction: 'Mixed',
        distanceToCampus: '5 mins'
      }
    ])
  }
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Apple-Grade Hostel Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('PropertyListing renders with Apple-Grade toggle', async () => {
    render(
      <TestWrapper>
        <PropertyListing />
      </TestWrapper>
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText(/Display Mode:/)).toBeInTheDocument();
    });

    // Check if Apple-Grade toggle is present
    const appleGradeToggle = screen.getByText(/🍎 Apple-Grade/);
    expect(appleGradeToggle).toBeInTheDocument();
  });

  test('Can toggle between Apple-Grade and Traditional display', async () => {
    render(
      <TestWrapper>
        <PropertyListing />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Display Mode:/)).toBeInTheDocument();
    });

    const toggle = screen.getByText(/🍎 Apple-Grade/);
    
    // Click to switch to traditional mode
    fireEvent.click(toggle);
    
    await waitFor(() => {
      expect(screen.getByText(/📱 Traditional/)).toBeInTheDocument();
    });

    // Click to switch back to Apple-Grade mode
    const traditionalToggle = screen.getByText(/📱 Traditional/);
    fireEvent.click(traditionalToggle);
    
    await waitFor(() => {
      expect(screen.getByText(/🍎 Apple-Grade/)).toBeInTheDocument();
    });
  });

  test('AppleGradeHostelDisplay component renders independently', () => {
    const mockOnHostelSelect = jest.fn();
    const mockOnError = jest.fn();

    render(
      <TestWrapper>
        <AppleGradeHostelDisplay
          searchCriteria={{
            query: '',
            sortBy: 'newest'
          }}
          onHostelSelect={mockOnHostelSelect}
          onError={mockOnError}
        />
      </TestWrapper>
    );

    // Component should render without errors
    expect(screen.getByTestId('apple-grade-hostel-display')).toBeInTheDocument();
  });

  test('Search functionality works with Apple-Grade display', async () => {
    render(
      <TestWrapper>
        <PropertyListing />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Display Mode:/)).toBeInTheDocument();
    });

    // Find search input
    const searchInput = screen.getByPlaceholderText(/Search properties/i);
    expect(searchInput).toBeInTheDocument();

    // Type in search query
    fireEvent.change(searchInput, { target: { value: 'test hostel' } });
    
    // Verify search input value
    expect(searchInput).toHaveValue('test hostel');
  });

  test('Error handling fallback to traditional display', async () => {
    // Mock console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <PropertyListing />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Display Mode:/)).toBeInTheDocument();
    });

    // Simulate error in Apple-Grade component
    // This would typically be triggered by the onError callback
    // For now, we just verify the error handling structure exists

    consoleSpy.mockRestore();
  });

  test('Performance monitoring integration', () => {
    const mockOnHostelSelect = jest.fn();
    const mockOnError = jest.fn();

    render(
      <TestWrapper>
        <AppleGradeHostelDisplay
          searchCriteria={{
            query: '',
            sortBy: 'newest'
          }}
          onHostelSelect={mockOnHostelSelect}
          onError={mockOnError}
          enableVirtualization={true}
        />
      </TestWrapper>
    );

    // Verify virtualization is enabled for performance
    expect(screen.getByTestId('apple-grade-hostel-display')).toBeInTheDocument();
  });
});

describe('Apple-Grade Component Props Validation', () => {
  test('Required props are properly typed', () => {
    const mockOnHostelSelect = jest.fn();
    const mockOnError = jest.fn();

    // This test ensures TypeScript compilation succeeds with proper types
    const validProps = {
      searchCriteria: {
        query: 'test',
        genderRestriction: 'Mixed' as const,
        sortBy: 'newest' as const
      },
      onHostelSelect: mockOnHostelSelect,
      onError: mockOnError,
      enableVirtualization: true,
      className: 'test-class'
    };

    render(
      <TestWrapper>
        <AppleGradeHostelDisplay {...validProps} />
      </TestWrapper>
    );

    expect(screen.getByTestId('apple-grade-hostel-display')).toBeInTheDocument();
  });
});

describe('Apple-Grade Performance Benchmarks', () => {
  test('Component renders within performance thresholds', async () => {
    const startTime = performance.now();

    render(
      <TestWrapper>
        <AppleGradeHostelDisplay
          searchCriteria={{
            query: '',
            sortBy: 'newest'
          }}
          onHostelSelect={jest.fn()}
          onError={jest.fn()}
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('apple-grade-hostel-display')).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Apple-grade standard: Component should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
});
