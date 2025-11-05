import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock expensive/complex hooks and components BEFORE importing Explore
vi.mock('@/hooks/property/useDynamicProperties', () => ({
  useDynamicProperties: () => ({
    properties: [
      { id: '1', title: 'Accra A', city: 'Accra', state: 'Greater Accra', created_at: '2024-01-02' },
      { id: '2', title: 'Kumasi B', city: 'Kumasi', state: 'Ashanti', created_at: '2024-01-01' },
      { id: '3', title: 'Accra C', city: 'Accra', state: 'Greater Accra', created_at: '2024-01-03' },
    ],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    coords: { latitude: 5.65, longitude: -0.19 },
    permissionStatus: 'granted',
    error: null,
    isLoading: false,
    requestLocation: vi.fn(),
  }),
}));

// Stub components that require AuthProvider to avoid context errors
vi.mock('@/components/layout/Header', () => ({
  __esModule: true,
  default: () => <div />,
}));
vi.mock('@/components/navigation/StudentNavBar', () => ({
  __esModule: true,
  default: () => <div />,
}));

// Stub PremiumPropertyCard to avoid complex dependencies in tests
vi.mock('@/components/properties/PremiumPropertyCard', () => ({
  __esModule: true,
  default: (props: any) => <div>{props.title}</div>,
}));

import Explore from '@/pages/student/Explore';

describe('Explore page geolocation integration (Phase A)', () => {
  it('shows detected region and nearest properties section', async () => {
    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    // Location enabled indicator (Accra heuristic)
    expect(await screen.findByText(/Location enabled/i)).toBeInTheDocument();

    // Nearest to You section should render Accra properties (C newer than A)
    const titles = (await screen.findAllByText(/Accra [AC]/i)).map(el => el.textContent);
    expect(titles).toContain('Accra C');
    expect(titles).toContain('Accra A');
  });
});

