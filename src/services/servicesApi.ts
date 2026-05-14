import { apiClient } from '@/lib/api/client';
import type { Service, CreateServicePayload, UpdateServicePayload } from '@/types/api';

export interface ServiceFilters {
  category?: string;
  providerId?: string;
}

export const servicesApi = {
  /**
   * Retrieves all services, optionally filtered.
   * @param filters - Optional category and provider filters
   * @returns Promise resolving to array of services
   */
  async getAll(filters?: ServiceFilters) {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.providerId) params.set('providerId', filters.providerId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Service[]>(
      `/services${query}`,
      {},
      'Failed to load services.'
    );
  },

  /**
   * Retrieves a single service by ID.
   * @param id - Service ID
   * @returns Promise resolving to service details
   */
  async getById(id: string) {
    return apiClient.get<Service>(
      `/services/${id}`,
      {},
      'Failed to load service.'
    );
  },

  /**
   * Retrieves services belonging to the current provider.
   * @returns Promise resolving to array of provider's services
   */
  async getMyServices() {
    return apiClient.get<Service[]>(
      '/services/provider/my-services',
      {},
      'Failed to load your services.'
    );
  },

  /**
   * Creates a new service (provider only).
   * @param payload - Service creation details
   * @returns Promise resolving to created service
   */
  async create(payload: CreateServicePayload) {
    return apiClient.post<Service>(
      '/services',
      payload,
      {},
      'Failed to create service.'
    );
  },

  /**
   * Updates an existing service (provider only).
   * @param id - Service ID
   * @param payload - Fields to update
   * @returns Promise resolving to updated service
   */
  async update(id: string, payload: UpdateServicePayload) {
    return apiClient.patch<Service>(
      `/services/${id}`,
      payload,
      {},
      'Failed to update service.'
    );
  },

  /**
   * Deletes a service (provider only).
   * @param id - Service ID
   * @returns Promise resolving to success message
   */
  async remove(id: string) {
    return apiClient.delete<{ message: string }>(
      `/services/${id}`,
      {},
      'Failed to delete service.'
    );
  },
};
