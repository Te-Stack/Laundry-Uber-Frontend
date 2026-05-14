import { useEffect, useState } from 'react';

interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationState {
  coords: GeolocationCoords | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook that requests browser geolocation permission and returns current coordinates.
 * Uses useEffect as a side effect (not data fetching).
 * @returns { coords, error, isLoading }
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ coords: null, error: 'Geolocation is not supported by your browser.', isLoading: false });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        error: null,
        isLoading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      setState({ coords: null, error: err.message, isLoading: false });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  }, []);

  return state;
}
