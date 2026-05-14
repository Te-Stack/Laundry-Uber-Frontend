import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { servicesApi, type ServiceFilters } from '@/services/servicesApi';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateServicePayload, UpdateServicePayload } from '@/types/api';

/**
 * Query hook to fetch all services with optional filters.
 * @param filters - Optional category and provider filters
 */
export function useServices(filters?: ServiceFilters) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => servicesApi.getAll(filters),
  });
}

/**
 * Query hook to fetch the current provider's services.
 */
export function useMyServices() {
  return useQuery({
    queryKey: queryKeys.services.myServices(),
    queryFn: () => servicesApi.getMyServices(),
  });
}

/**
 * Mutation hook to create a new service.
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => servicesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

/**
 * Mutation hook to update an existing service.
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicePayload }) =>
      servicesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

/**
 * Mutation hook to delete a service.
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
