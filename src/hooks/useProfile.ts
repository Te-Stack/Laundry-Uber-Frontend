import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { laundryApi } from '@/services/laundryApi';
import { queryKeys } from '@/lib/queryKeys';
import type { UpdateProfilePayload, UpdateLocationPayload } from '@/types/api';

/**
 * Query hook to fetch the current authenticated user's profile.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => laundryApi.getCurrentUser(),
  });
}

/**
 * Mutation hook to update the current user's profile.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => laundryApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

/**
 * Mutation hook to update the current user's location.
 */
export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLocationPayload) => laundryApi.updateLocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}
