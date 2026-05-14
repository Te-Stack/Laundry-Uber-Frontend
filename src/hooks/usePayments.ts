import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/services/paymentsApi';
import { queryKeys } from '@/lib/queryKeys';
import type { InitializePaymentPayload } from '@/types/api';

/**
 * Mutation hook to initialize a Paystack payment.
 * On success, redirects the user to the Paystack authorization URL.
 */
export function useInitializePayment() {
  return useMutation({
    mutationFn: (payload: InitializePaymentPayload) => paymentsApi.initialize(payload),
    onSuccess: (result) => {
      const url = result.data?.data?.authorizationUrl;
      if (url) {
        window.location.href = url;
      }
    },
  });
}

/**
 * Query hook to verify a payment by reference.
 * Only runs when a reference string is provided.
 * @param reference - Paystack payment reference from callback URL
 */
export function useVerifyPayment(reference: string | null) {
  return useQuery({
    queryKey: queryKeys.payments.detail(reference ?? ''),
    queryFn: () => paymentsApi.verify(reference!),
    enabled: !!reference,
    retry: 2,
  });
}

/**
 * Query hook to fetch the current user's payment history.
 */
export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.payments.list(),
    queryFn: () => paymentsApi.getHistory(),
  });
}
