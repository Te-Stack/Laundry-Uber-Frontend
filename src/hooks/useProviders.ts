import { useQuery } from '@tanstack/react-query';
import { laundryApi } from '@/services/laundryApi';
import { queryKeys } from '@/lib/queryKeys';

interface NearbyProvidersParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

/**
 * Query hook to fetch nearby providers based on coordinates.
 * Only enabled when coordinates are available.
 * @param params - Latitude, longitude, and optional radius
 */
export function useNearbyProviders(params: NearbyProvidersParams | null) {
  return useQuery({
    queryKey: queryKeys.providers.nearby(
      params ?? { latitude: 0, longitude: 0 }
    ),
    queryFn: () =>
      laundryApi.getNearbyProviders(params!.latitude, params!.longitude, params!.radius),
    enabled: !!params,
  });
}

/**
 * Query hook to fetch a provider's full profile.
 * @param providerId - The provider's user ID
 */
export function useProviderProfile(providerId: string | null) {
  return useQuery({
    queryKey: queryKeys.providers.detail(providerId ?? ''),
    queryFn: () => laundryApi.getProviderProfile(providerId!),
    enabled: !!providerId,
  });
}

/**
 * Query hook to fetch a provider's schedule.
 * @param providerId - The provider's user ID
 */
export function useProviderSchedule(providerId: string | null) {
  return useQuery({
    queryKey: queryKeys.providers.schedule(providerId ?? ''),
    queryFn: () => laundryApi.getProviderSchedule(providerId!),
    enabled: !!providerId,
  });
}
