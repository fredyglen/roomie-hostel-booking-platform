import { useCallback, useEffect, useRef, useState } from 'react';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unavailable';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export interface UseGeolocationReturn {
  coords: GeolocationCoords | null;
  permissionStatus: PermissionState;
  error: Error | null;
  isLoading: boolean;
  requestLocation: () => void;
}

/**
 * useGeolocation
 * Small, defensive hook for obtaining user's geolocation.
 * - 10s timeout
 * - Handles all browser error cases
 * - No watchers; single-shot request for UX predictability
 */
export function useGeolocation(): UseGeolocationReturn {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('prompt');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const didRequestRef = useRef(false);

  // Probe permissions API if available
  useEffect(() => {
    let cancelled = false;
    const permissions: any = (navigator as any).permissions;
    if (permissions && permissions.query) {
      permissions
        .query({ name: 'geolocation' as any })
        .then((status: { state: PermissionState }) => {
          if (!cancelled) {
            const mapped = (status?.state as PermissionState) || 'prompt';
            setPermissionStatus(mapped);
          }
        })
        .catch(() => {
          if (!cancelled) setPermissionStatus('prompt');
        });
    } else if (!('geolocation' in navigator)) {
      setPermissionStatus('unavailable');
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermissionStatus('unavailable');
      setError(new Error('Geolocation is not supported by this browser'));
      return;
    }

    // Avoid duplicate parallel requests
    if (didRequestRef.current) return;
    didRequestRef.current = true;

    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError(new Error('Location request timed out'));
      setPermissionStatus((prev) => (prev === 'prompt' ? 'prompt' : prev));
      didRequestRef.current = false;
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setPermissionStatus('granted');
        setIsLoading(false);
        didRequestRef.current = false;
      },
      (err: GeolocationPositionError) => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        didRequestRef.current = false;
        // Map error codes
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          setError(new Error('Permission denied'));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setPermissionStatus((prev) => (prev === 'prompt' ? 'prompt' : prev));
          setError(new Error('Position unavailable'));
        } else if (err.code === err.TIMEOUT) {
          setError(new Error('Location request timed out'));
        } else {
          setError(new Error(err.message || 'Failed to get location'));
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Auto-request location silently when permission is already granted
  // This keeps UI minimal and avoids extra taps for users who have granted access
  useEffect(() => {
    if (permissionStatus === 'granted' && !coords && !didRequestRef.current) {
      requestLocation();
    }
  }, [permissionStatus, coords, requestLocation]);

  return { coords, permissionStatus, error, isLoading, requestLocation };
}

