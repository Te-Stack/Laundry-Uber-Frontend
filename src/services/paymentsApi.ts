import { apiClient } from '@/lib/api/client';
import type {
  InitializePaymentPayload,
  InitializePaymentResponse,
  VerifyPaymentResponse,
  Payment,
} from '@/types/api';

export const paymentsApi = {
  /**
   * Initializes a Paystack payment for a laundry request.
   * @param payload - Payment initialization details
   * @returns Promise resolving to authorization URL and reference
   */
  async initialize(payload: InitializePaymentPayload) {
    return apiClient.post<InitializePaymentResponse>(
      '/payments/initialize',
      payload,
      {},
      'Failed to initialize payment.'
    );
  },

  /**
   * Verifies a payment using its reference.
   * @param reference - Paystack payment reference
   * @returns Promise resolving to payment verification result
   */
  async verify(reference: string) {
    return apiClient.get<VerifyPaymentResponse>(
      `/payments/verify/${reference}`,
      {},
      'Failed to verify payment.'
    );
  },

  /**
   * Retrieves the payment history for the current user.
   * @returns Promise resolving to array of payments
   */
  async getHistory() {
    return apiClient.get<Payment[]>(
      '/payments/history',
      {},
      'Failed to load payment history.'
    );
  },
};
