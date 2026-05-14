import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { laundryApi } from '@/services/laundryApi';
import { queryKeys } from '@/lib/queryKeys';
import type { ProviderSchedule } from '@/types/api';

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

/**
 * Mutation hook to toggle the current provider's online/offline status.
 */
export function useToggleAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isOnline: boolean) => laundryApi.toggleAvailability(isOnline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

/**
 * Mutation hook to set the current provider's weekly schedule.
 */
export function useSetSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: ProviderSchedule) => laundryApi.setSchedule(schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.providers.all });
    },
  });
}
