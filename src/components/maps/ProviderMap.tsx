import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location01Icon, StarIcon, Store01Icon, Search01Icon } from 'hugeicons-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyProviders } from '@/hooks/useProviders';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateLocation } from '@/hooks/useProfile';
import { MapView, type MapMarker } from './MapView';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DEFAULT_LAT = 6.6005;
const DEFAULT_LNG = 3.3505;

const POPULAR_CITIES = [
  { name: 'Sapele, Delta', lat: 5.8941, lng: 5.6767 },
  { name: 'Ikeja, Lagos', lat: 6.6005, lng: 3.3505 },
  { name: 'Victoria Island, Lagos', lat: 6.4281, lng: 3.4219 },
  { name: 'Warri, Delta', lat: 5.5442, lng: 5.7603 },
  { name: 'Benin City, Edo', lat: 6.3350, lng: 5.6037 },
  { name: 'Abuja (FCT)', lat: 9.0765, lng: 7.3986 },
];

/**
 * Map showing nearby laundry providers with radius slider, interactive pins,
 * and live address/city search with preset city chips (including Sapele, Delta).
 */
export function ProviderMap() {
  const [radius, setRadius] = useState(25);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number; label: string } | null>(null);

  const navigate = useNavigate();
  const { data: session } = useAuth();
  const { mutate: saveLocation, isPending: isSaving, isSuccess: isSaved } = useUpdateLocation();

  const user = session?.user;
  const userLat = (user as any)?.latitude || DEFAULT_LAT;
  const userLng = (user as any)?.longitude || DEFAULT_LNG;

  const { coords } = useGeolocation();

  // Active coordinates priority: Custom searched coords > GPS coords > User profile coords > Default
  const activeLat = customCoords?.lat ?? (coords?.latitude ?? userLat);
  const activeLng = customCoords?.lng ?? (coords?.longitude ?? userLng);
  const locationLabel = customCoords?.label ?? (coords ? 'Live Browser Location' : 'Ikeja, Lagos');

  const { data: providersResult, isLoading: providersLoading } = useNearbyProviders({
    latitude: activeLat,
    longitude: activeLng,
    radius,
  });

  const providers = providersResult?.data ?? [];
  const center: [number, number] = [activeLat, activeLng];

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim() + ', Nigeria'
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const item = data[0];
        const newLat = parseFloat(item.lat);
        const newLng = parseFloat(item.lon);
        setCustomCoords({
          lat: newLat,
          lng: newLng,
          label: item.display_name.split(',').slice(0, 2).join(','),
        });
        setSearchQuery('');
      } else {
        setSearchError('Location not found. Try searching a major city or street name.');
      }
    } catch {
      setSearchError('Could not reach search service. Please try selecting a city below.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
    setCustomCoords({
      lat: city.lat,
      lng: city.lng,
      label: city.name,
    });
  };

  const handleSaveDefaultLocation = () => {
    saveLocation({ latitude: activeLat, longitude: activeLng });
  };

  const markers: MapMarker[] = [
    { id: 'me', position: center, label: `📍 Your Location (${locationLabel})` },
    ...providers.flatMap((p) => {
      if (p.latitude == null || p.longitude == null) return [];
      const pName = p.fullName || (p as any).name || 'Provider';
      const pRating = p.rating != null ? Number(p.rating).toFixed(1) : '5.0';
      const pDist = p.distance != null ? Number(p.distance).toFixed(1) : '0.5';
      return {
        id: p.id,
        position: [p.latitude, p.longitude] as [number, number],
        label: `🧺 ${pName} — ⭐ ${pRating} (${pDist}km)`,
      };
    }),
  ];

  return (
    <div className="space-y-6">
      {/* Search & Location Bar */}
      <div className="bg-white dark:bg-card p-4 rounded-xl border shadow-sm space-y-3">
        <form onSubmit={handleSearchLocation} className="flex gap-2">
          <div className="relative flex-1">
            <Search01Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search any town, city or address (e.g. Sapele, Warri, Ikeja, Lekki)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-muted dark:border-border"
            />
          </div>
          <Button type="submit" size="sm" disabled={isSearching} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {searchError && <p className="text-xs text-red-500">{searchError}</p>}

        {/* Quick city presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-500 font-medium mr-1">Quick Select:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleSelectCity(city)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                customCoords?.lat === city.lat && customCoords?.lng === city.lng
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300 border-gray-200 dark:border-border'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls & Active Location status bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="radius-slider" className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Search Radius: <span className="text-blue-600 dark:text-blue-400">{radius} km</span>
          </label>
          <input
            id="radius-slider"
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full sm:w-48 accent-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200">
            <Location01Icon className="w-3.5 h-3.5 mr-1" />
            {locationLabel}
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveDefaultLocation}
            disabled={isSaving}
            className="text-xs h-7 px-2"
          >
            {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Set as My Default'}
          </Button>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {providers.length} cleaner{providers.length === 1 ? '' : 's'} found
          </span>
        </div>
      </div>

      {/* Main Map + Sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map view */}
        <div className="lg:col-span-2 h-[450px] lg:h-[550px] rounded-2xl overflow-hidden border shadow-sm">
          <MapView center={center} zoom={12} markers={markers} />
        </div>

        {/* Nearby provider cards sidebar */}
        <div className="space-y-3 overflow-y-auto max-h-[550px] pr-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1">
            Available Cleaners ({providers.length})
          </h2>

          {providersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-28 bg-gray-100 dark:bg-muted" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <Store01Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No providers found within {radius}km of {locationLabel}.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try expanding the search radius slider above or switching locations.
                </p>
              </CardContent>
            </Card>
          ) : (
            providers.map((p) => {
              const pName = p.fullName || (p as any).name || 'Provider';
              const pRating = p.rating != null ? Number(p.rating).toFixed(1) : '5.0';
              const pDist = p.distance != null ? Number(p.distance).toFixed(1) : '0.5';
              const isSelected = selectedProviderId === p.id;

              return (
                <Card
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-border'
                  }`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-foreground">
                          {pName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-xs font-semibold text-amber-500">
                            <StarIcon className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            {pRating}
                          </div>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {pDist} km away
                          </span>
                        </div>
                      </div>
                      <span
                        title={p.isOnline ? 'Online' : 'Offline'}
                        className={`h-2.5 w-2.5 rounded-full ring-4 ${
                          p.isOnline
                            ? 'bg-green-500 ring-green-100 dark:ring-green-950'
                            : 'bg-gray-300 ring-gray-100 dark:ring-gray-800'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/messages/${p.id}`);
                        }}
                        className="text-xs h-7 px-2.5 flex-1"
                      >
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/providers/${p.id}`);
                        }}
                        className="text-xs h-7 px-2.5 flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
