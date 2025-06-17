/**
 * Testing utilities for ROOMi platform
 * Provides common test helpers, mocks, and setup functions
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'student' as const,
  phone: '+233123456789',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockProperty = {
  id: 'test-property-id',
  title: 'Test Property',
  description: 'A beautiful test property for students',
  address: '123 Test Street, Accra',
  city: 'Accra',
  region: 'Greater Accra',
  country: 'Ghana',
  propertyType: 'apartment' as const,
  bedrooms: 2,
  bathrooms: 1,
  maxOccupants: 4,
  pricePerMonth: 1500,
  currency: 'GHS',
  distanceToCampus: 2.5,
  nearestUniversity: 'University of Ghana',
  amenities: ['wifi', 'parking', 'security'],
  images: ['https://example.com/image1.jpg'],
  isActive: true,
  ownerId: 'test-owner-id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockBooking = {
  id: 'test-booking-id',
  propertyId: mockProperty.id,
  userId: mockUser.id,
  checkInDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  checkOutDate: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
  guestCount: 2,
  totalAmount: 1500,
  status: 'confirmed' as const,
  emergencyContact: {
    name: 'Emergency Contact',
    phone: '+233987654321',
    relationship: 'Parent',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock implementations
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  signIn: vi.fn().mockResolvedValue({ user: mockUser }),
  signUp: vi.fn().mockResolvedValue({ user: mockUser }),
  signOut: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn().mockResolvedValue({ user: mockUser }),
  resetPassword: vi.fn().mockResolvedValue(undefined),
};

export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockProperty, error: null }),
    then: vi.fn().mockResolvedValue({ data: [mockProperty], error: null }),
  })),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
    })),
  },
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialEntries = ['/'], queryClient, ...renderOptions } = options;

  // Create a new QueryClient for each test to avoid state leakage
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: testQueryClient,
  };
}

// Common test helpers
export const testHelpers = {
  // Wait for loading to complete
  waitForLoadingToFinish: async () => {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  },

  // Wait for error to appear
  waitForError: async (errorText?: string) => {
    await waitFor(() => {
      if (errorText) {
        expect(screen.getByText(new RegExp(errorText, 'i'))).toBeInTheDocument();
      } else {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      }
    });
  },

  // Fill form fields
  fillForm: async (user: ReturnType<typeof userEvent.setup>, fields: Record<string, string>) => {
    for (const [fieldName, value] of Object.entries(fields)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
      await user.clear(field);
      await user.type(field, value);
    }
  },

  // Submit form
  submitForm: async (user: ReturnType<typeof userEvent.setup>, buttonText = 'submit') => {
    const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
    await user.click(submitButton);
  },

  // Mock API responses
  mockApiSuccess: (data: any) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });
  },

  mockApiError: (error: string, status = 400) => {
    return Promise.reject({
      ok: false,
      status,
      json: () => Promise.resolve({ error }),
    });
  },

  // Mock file upload
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    return new File(['test content'], name, { type, lastModified: Date.now() });
  },

  // Mock geolocation
  mockGeolocation: (coords = { latitude: 5.6037, longitude: -0.1870 }) => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) => {
        success({
          coords: {
            ...coords,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      }),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    };

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });

    return mockGeolocation;
  },

  // Mock intersection observer
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });

    Object.defineProperty(window, 'IntersectionObserver', {
      value: mockIntersectionObserver,
      writable: true,
    });

    return mockIntersectionObserver;
  },

  // Mock local storage
  mockLocalStorage: () => {
    const store: Record<string, string> = {};

    const mockLocalStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    return mockLocalStorage;
  },

  // Mock session storage
  mockSessionStorage: () => {
    const store: Record<string, string> = {};

    const mockSessionStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });

    return mockSessionStorage;
  },
};

// Custom matchers
export const customMatchers = {
  toBeInTheDocument: (received: any) => {
    const pass = received !== null && document.body.contains(received);
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
};

// Test data factories
export const factories = {
  user: (overrides = {}) => ({ ...mockUser, ...overrides }),
  property: (overrides = {}) => ({ ...mockProperty, ...overrides }),
  booking: (overrides = {}) => ({ ...mockBooking, ...overrides }),
  
  // Generate multiple items
  users: (count = 3, overrides = {}) => 
    Array.from({ length: count }, (_, i) => 
      factories.user({ id: `user-${i}`, email: `user${i}@example.com`, ...overrides })
    ),
    
  properties: (count = 3, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      factories.property({ id: `property-${i}`, title: `Property ${i}`, ...overrides })
    ),
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { userEvent };

// Default export
export default renderWithProviders;
