import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useGeolocation } from '@/hooks/useGeolocation';

function mockGeolocationSuccess(coords = { latitude: 5.6, longitude: -0.19 }) {
  const mock = {
    getCurrentPosition: vi.fn((success) => {
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
  Object.defineProperty(global.navigator, 'geolocation', { value: mock, writable: true, configurable: true });
  return mock;
}

function GeolocationProbe() {
  const { coords, permissionStatus, error, isLoading, requestLocation } = useGeolocation();
  return (
    <div>
      <div>status:{permissionStatus}</div>
      <div>loading:{String(isLoading)}</div>
      <div>lat:{coords?.latitude ?? ''}</div>
      <div>err:{error?.message ?? ''}</div>
      <button onClick={requestLocation}>req</button>
    </div>
  );
}

describe('useGeolocation', () => {
  it('sets coords and granted on success', async () => {
    // Mock permissions
    (navigator as any).permissions = { query: vi.fn().mockResolvedValue({ state: 'granted' }) };
    // Mock geolocation
    mockGeolocationSuccess({ latitude: 5.6, longitude: -0.19 });

    render(<GeolocationProbe />);

    fireEvent.click(screen.getByText('req'));

    await waitFor(() => {
      expect(screen.getByText(/status:granted/)).toBeInTheDocument();
      expect(screen.getByText(/lat:5.6/)).toBeInTheDocument();
    });
  });

  it('handles permission denied error', async () => {
    (navigator as any).permissions = { query: vi.fn().mockResolvedValue({ state: 'prompt' }) };
    const mock = {
      getCurrentPosition: vi.fn((_s: any, e: any) => {
        e({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: 'denied' });
      })
    };
    Object.defineProperty(global.navigator, 'geolocation', { value: mock, writable: true, configurable: true });

    render(<GeolocationProbe />);

    fireEvent.click(screen.getByText('req'));

    await waitFor(() => {
      expect(screen.getByText(/status:denied/)).toBeInTheDocument();
      expect(screen.getByText(/err:Permission denied/)).toBeInTheDocument();
    });
  });

  it('handles unavailable geolocation', async () => {
    (navigator as any).permissions = undefined;
    // Remove geolocation property entirely so `'geolocation' in navigator` returns false
    Object.defineProperty(global.navigator, 'geolocation', { value: undefined, configurable: true });
    // @ts-expect-error - deleting to simulate browsers without geolocation
    delete (navigator as any).geolocation;

    render(<GeolocationProbe />);

    fireEvent.click(screen.getByText('req'));

    await waitFor(() => {
      expect(screen.getByText(/status:unavailable/)).toBeInTheDocument();
      expect(screen.getByText(/err:Geolocation is not supported/)).toBeInTheDocument();
    });
  });
});

