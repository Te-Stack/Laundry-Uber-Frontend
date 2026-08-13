import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '@/services/requestsApi';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateRequestPayload } from '@/types/api';

/**
 * Query hook to fetch the current customer's requests.
 */
export function useCustomerRequests() {
  return useQuery({
    queryKey: queryKeys.requests.customer(),
    queryFn: () => requestsApi.getCustomerRequests(),
  });
}

/**
 * Query hook to fetch the current provider's assigned requests.
 */
export function useProviderRequests() {
  return useQuery({
    queryKey: queryKeys.requests.provider(),
    queryFn: () => requestsApi.getProviderRequests(),
  });
}

/**
 * Query hook to fetch all available pending requests for providers.
 */
export function usePendingRequests() {
  return useQuery({
    queryKey: queryKeys.requests.pending(),
    queryFn: () => requestsApi.getPendingRequests(),
  });
}

/**
 * Mutation hook to create a new laundry request.
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => requestsApi.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

/**
 * Mutation hook for providers to accept a pending request.
 */
export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsApi.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

/**
 * Mutation hook for providers to decline a pending request.
 */
export function useDeclineRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => requestsApi.declineRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

/**
 * Mutation hook to update the status of a request.
 */
export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: string }) =>
      requestsApi.updateRequestStatus(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}

/**
 * Mutation hook for customers to rate a completed request.
 */
export function useRateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, rating, review }: { requestId: string; rating: number; review?: string }) =>
      requestsApi.rateRequest(requestId, rating, review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    },
  });
}
