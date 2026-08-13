import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { useSocket } from '@/contexts/SocketContext';
import { MapView, type MapMarker } from './MapView';
import type { SocketProviderLocationPayload } from '@/types/api';

interface ProviderTrackerProps {
  requestId: string;
  destination: [number, number];
  destinationLabel?: string;
}

/**
 * Real-time provider location tracker on a map.
 * Listens for providerLocationUpdate socket events and updates the marker.
 */
export function ProviderTracker({ requestId, destination, destinationLabel = 'Destination' }: ProviderTrackerProps) {
  const { socket, joinRoom, leaveRoom } = useSocket();
  const [providerPosition, setProviderPosition] = useState<[number, number] | null>(null);

  // Side effect: join room and listen for location updates
  useEffect(() => {
    if (!socket) return;

    joinRoom(requestId);

    const handleLocationUpdate = (data: SocketProviderLocationPayload) => {
      setProviderPosition([data.latitude, data.longitude]);
    };

    socket.on('providerLocationUpdate', handleLocationUpdate);

    return () => {
      leaveRoom(requestId);
      socket.off('providerLocationUpdate', handleLocationUpdate);
    };
  }, [socket, requestId, joinRoom, leaveRoom]);

  const center = providerPosition ?? destination;

  const markers: MapMarker[] = [
    { id: 'destination', position: destination, label: destinationLabel },
    ...(providerPosition
      ? [{ id: 'provider', position: providerPosition, label: 'Provider location' }]
      : []),
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${providerPosition ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}
        />
        <span className="text-sm text-gray-600">
          {providerPosition ? 'Tracking provider in real-time' : 'Waiting for provider location...'}
        </span>
      </div>

      <div className="h-72 rounded-lg overflow-hidden border">
        <MapView center={center} zoom={14} markers={markers}>
          {providerPosition && (
            <Polyline
              positions={[providerPosition, destination]}
              pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '8 4' }}
            />
          )}
        </MapView>
      </div>
    </div>
  );
}
