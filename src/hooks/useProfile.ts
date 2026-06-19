import { useMutation, useQueryClient } from '@tanstack/react-query';
import { laundryApi } from '@/services/laundryApi';
import { useAuth } from '@/contexts/AuthContext';
import { queryKeys } from '@/lib/queryKeys';
import type { UpdateProfilePayload, UpdateLocationPayload, User } from '@/types/api';

/**
 * Hook that returns the current authenticated user's profile from the Better Auth session.
 * Replaces the old useCurrentUser() which called /auth/me.
 * Returns data in the same shape so consumers don't need to change.
 */
export function useCurrentUser() {
  const { data: session, isPending, error } = useAuth();

  // Map session user to the shape that consumers expect: { data: { data: User } }
  const userData: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.name,
    phoneNumber: (session.user as any).phoneNumber || '',
    userType: ((session.user as any).userType || 'customer') as 'customer' | 'provider',
    isOnline: (session.user as any).isOnline ?? false,
    latitude: (session.user as any).latitude,
    longitude: (session.user as any).longitude,
    rating: (session.user as any).rating ?? 0,
    totalRatings: (session.user as any).totalRatings ?? 0,
    schedule: (session.user as any).schedule,
    createdAt: session.user.createdAt?.toString() || '',
    updatedAt: session.user.updatedAt?.toString() || '',
  } : null;

  return {
    data: userData ? { data: userData, error: null, meta: {} } : null,
    isLoading: isPending,
    error,
  };
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
