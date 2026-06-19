import { apiClient } from '@/lib/api/client';
import type {
  LaundryRequest,
  CreateRequestPayload,
} from '@/types/api';

// ============================================================================
// Laundry Requests API
// Handles creating, fetching, and updating laundry service requests for
// both customers and providers.
// ============================================================================

export const requestsApi = {
  // --------------------------------------------------------------------------
  // Customer
  // --------------------------------------------------------------------------

  /**
   * Creates a new laundry service request.
   * @param payload - Request details including addresses, items, and amount
   * @returns Promise resolving to created LaundryRequest
   */
  async createRequest(payload: CreateRequestPayload) {
    return apiClient.post<LaundryRequest>(
      '/requests',
      payload,
      {},
      'Failed to create laundry request.'
    );
  },

  /**
   * Retrieves all laundry requests for the current customer.
   * @returns Promise resolving to array of customer's requests
   */
  async getCustomerRequests() {
    return apiClient.get<LaundryRequest[]>(
      '/requests/customer',
      {},
      'Failed to load your requests.'
    );
  },

  /**
   * Submits a rating and review for a completed request.
   * @param requestId - ID of the request to rate
   * @param rating - Rating value (1-5)
   * @param review - Optional review text
   * @returns Promise resolving to updated LaundryRequest
   */
  async rateRequest(requestId: string, rating: number, review?: string) {
    return apiClient.patch<LaundryRequest>(
      `/requests/${requestId}/rate`,
      { rating, review },
      {},
      'Failed to submit rating.'
    );
  },

  // --------------------------------------------------------------------------
  // Provider
  // --------------------------------------------------------------------------

  /**
   * Retrieves all laundry requests assigned to the current provider.
   * @returns Promise resolving to array of provider's requests
   */
  async getProviderRequests() {
    return apiClient.get<LaundryRequest[]>(
      '/requests/provider',
      {},
      'Failed to load requests.'
    );
  },

  /**
   * Retrieves all pending laundry requests available for providers to accept.
   * @returns Promise resolving to array of pending requests
   */
  async getPendingRequests() {
    return apiClient.get<LaundryRequest[]>(
      '/requests/pending',
      {},
      'Failed to load pending requests.'
    );
  },

  /**
   * Accepts a pending laundry request.
   * @param requestId - ID of the request to accept
   * @returns Promise resolving to updated LaundryRequest
   */
  async acceptRequest(requestId: string) {
    return apiClient.patch<LaundryRequest>(
      `/requests/${requestId}/accept`,
      {},
      {},
      'Failed to accept request.'
    );
  },

  /**
   * Declines a pending laundry request.
   * @param requestId - ID of the request to decline
   * @returns Promise resolving to updated LaundryRequest
   */
  async declineRequest(requestId: string) {
    return apiClient.patch<LaundryRequest>(
      `/requests/${requestId}/decline`,
      {},
      {},
      'Failed to decline request.'
    );
  },

  /**
   * Updates the status of a laundry request.
   * @param requestId - ID of the request to update
   * @param status - New status value
   * @returns Promise resolving to updated LaundryRequest
   */
  async updateRequestStatus(requestId: string, status: string) {
    return apiClient.patch<LaundryRequest>(
      `/requests/${requestId}/status`,
      { status },
      {},
      'Failed to update request status.'
    );
  },
};
