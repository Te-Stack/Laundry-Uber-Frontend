import { useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';

interface ActiveTrackingRequest {
  id: string;
  status: string;
}

const TRACKING_STATUSES = new Set(['accepted', 'picked_up', 'out_for_delivery']);
const MIN_UPDATE_INTERVAL_MS = 10_000;
const MIN_MOVEMENT_METERS = 25;

function distanceInMeters(
  first: GeolocationCoordinates,
  second: GeolocationCoordinates
) {
  const earthRadius = 6_371_000;
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos((first.latitude * Math.PI) / 180) *
      Math.cos((second.latitude * Math.PI) / 180) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useProviderLocationSharing(requests: ActiveTrackingRequest[]) {
  const { socket } = useSocket();
  const lastPositionRef = useRef<GeolocationCoordinates | null>(null);
  const lastSentAtRef = useRef(0);
  const activeRequestIds = requests
    .filter((request) => TRACKING_STATUSES.has(request.status))
    .map((request) => request.id)
    .join(',');

  useEffect(() => {
    if (!socket || !activeRequestIds || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        const previousPosition = lastPositionRef.current;
        const isFirstLocation = previousPosition === null;
        const movedEnough = previousPosition
          ? distanceInMeters(previousPosition, position.coords) >= MIN_MOVEMENT_METERS
          : false;

        if (!isFirstLocation && !movedEnough && now - lastSentAtRef.current < MIN_UPDATE_INTERVAL_MS) {
          return;
        }

        lastPositionRef.current = position.coords;
        lastSentAtRef.current = now;

        for (const requestId of activeRequestIds.split(',')) {
          socket.emit('provider:location', {
            requestId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        }
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, activeRequestIds]);
}
