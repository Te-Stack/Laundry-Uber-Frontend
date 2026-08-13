import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface SelectedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

interface SearchResult extends SelectedLocation {
  id: string;
}

interface AddressLocationPickerProps {
  label: string;
  initialLocation?: SelectedLocation;
  onChange: (location: SelectedLocation) => void;
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, Math.max(map.getZoom(), 15));
  }, [map, position]);

  return null;
}

function PinController({ onPositionChange }: { onPositionChange: (position: [number, number]) => void }) {
  useMapEvents({ click: (event) => onPositionChange([event.latlng.lat, event.latlng.lng]) });
  return null;
}

export function AddressLocationPicker({ label, initialLocation, onChange }: AddressLocationPickerProps) {
  const [query, setQuery] = useState(initialLocation?.address ?? '');
  const [location, setLocation] = useState<SelectedLocation | null>(initialLocation ?? null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fallback: [number, number] = [6.6005, 3.3505];
  const position: [number, number] = location ? [location.latitude, location.longitude] : fallback;

  useEffect(() => {
    if (!location && initialLocation) {
      setLocation(initialLocation);
      setQuery(initialLocation.address);
    }
  }, [initialLocation, location]);

  const setSelectedLocation = (nextLocation: SelectedLocation) => {
    setLocation(nextLocation);
    setQuery(nextLocation.address);
    setResults([]);
    setError(null);
    onChange(nextLocation);
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18`
      );
      if (!response.ok) throw new Error('Reverse geocoding failed');
      const result = await response.json();
      setSelectedLocation({
        latitude,
        longitude,
        address: result.display_name ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });
    } catch {
      setSelectedLocation({ latitude, longitude, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` });
    }
  };

  const search = async () => {
    if (query.trim().length < 3) {
      setError('Enter at least three characters to search.');
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Address search failed');
      const data = await response.json();
      setResults(data.map((result: { place_id: number; display_name: string; lat: string; lon: string }) => ({
        id: String(result.place_id),
        address: result.display_name,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
      })));
    } catch {
      setError('Address search is unavailable. Place the pin on the map instead.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border bg-gray-50 p-3 dark:bg-muted/30">
      <p className="text-sm font-semibold">{label}</p>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void search();
            }
          }}
          placeholder="Search an address or landmark"
        />
        <Button type="button" variant="outline" onClick={() => void search()} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {results.length > 0 && (
        <div className="max-h-36 overflow-y-auto rounded-md border bg-white dark:bg-card">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              className="block w-full border-b px-3 py-2 text-left text-xs last:border-0 hover:bg-blue-50 dark:hover:bg-muted"
              onClick={() => setSelectedLocation(result)}
            >
              {result.address}
            </button>
          ))}
        </div>
      )}
      <div className="h-56 overflow-hidden rounded-md border">
        <MapContainer center={position} zoom={15} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap position={position} />
          <PinController onPositionChange={([latitude, longitude]) => void reverseGeocode(latitude, longitude)} />
          {location && (
            <Marker
              position={position}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const marker = event.target as L.Marker;
                  const nextPosition = marker.getLatLng();
                  void reverseGeocode(nextPosition.lat, nextPosition.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground">
        {location ? `Pinned: ${location.address}` : 'Search, click the map, or drag the pin to set this location.'}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
