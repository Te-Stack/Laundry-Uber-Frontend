import { useGeolocation } from '@/hooks/useGeolocation';
import { useUpdateLocation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

/**
 * Shows current geolocation coordinates and allows updating them on the server.
 */
export function LocationUpdater() {
  const { coords, error, isLoading } = useGeolocation();
  const { mutate: updateLocation, isPending, isSuccess } = useUpdateLocation();

  const handleUpdate = () => {
    if (!coords) return;
    updateLocation({ latitude: coords.latitude, longitude: coords.longitude });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium">Current Location</span>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400 dark:text-gray-500">Getting your location...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {coords && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-muted rounded-md px-3 py-2">
          <p>Latitude: {coords.latitude.toFixed(6)}</p>
          <p>Longitude: {coords.longitude.toFixed(6)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Accuracy: ±{Math.round(coords.accuracy)}m</p>
        </div>
      )}

      {isSuccess && (
        <p className="text-sm text-green-600">Location updated successfully!</p>
      )}

      <Button
        size="sm"
        onClick={handleUpdate}
        disabled={!coords || isPending}
        variant="outline"
      >
        {isPending ? 'Updating...' : 'Update Location'}
      </Button>
    </div>
  );
}
