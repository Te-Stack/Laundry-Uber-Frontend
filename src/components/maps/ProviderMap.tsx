import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyProviders } from '@/hooks/useProviders';
import { MapView, type MapMarker } from './MapView';
import { useNavigate } from 'react-router-dom';

/**
 * Map showing nearby laundry providers with a radius slider.
 * Uses browser geolocation and React Query for provider data.
 */
export function ProviderMap() {
  const [radius, setRadius] = useState(5);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { coords, error: geoError, isLoading: geoLoading } = useGeolocation();
  const { data: providersResult, isLoading: providersLoading } = useNearbyProviders(
    coords ? { latitude: coords.latitude, longitude: coords.longitude, radius } : null
  );

  const providers = providersResult?.data ?? [];

  if (geoLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        Getting your location...
      </div>
    );
  }

  if (geoError || !coords) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        {geoError ?? 'Unable to get location. Please enable location access.'}
      </div>
    );
  }

  const center: [number, number] = [coords.latitude, coords.longitude];

  const markers: MapMarker[] = [
    { id: 'me', position: center, label: 'Your location' },
    ...providers.map((p) => ({
      id: p.id,
      position: center, // Providers don't expose exact coords in NearbyProvider type
      label: `${p.fullName} — ⭐ ${p.rating.toFixed(1)} (${p.distance.toFixed(1)}km)`,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Radius slider */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Radius: {radius}km
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="flex-1"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 h-80 rounded-lg overflow-hidden border">
          <MapView center={center} zoom={13} markers={markers} />
        </div>

        {/* Provider list */}
        <div className="space-y-2 overflow-y-auto max-h-80">
          {providersLoading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">Loading providers...</p>
          ) : providers.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              No providers found within {radius}km.
            </p>
          ) : (
            providers.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProviderId(p.id);
                  navigate(`/providers/${p.id}`);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-muted ${
                  selectedProviderId === p.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{p.fullName}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${p.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">⭐ {p.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{p.distance.toFixed(1)}km away</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
