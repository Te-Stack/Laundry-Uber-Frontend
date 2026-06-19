import { apiClient } from '@/lib/api/client';
import type {
  User,
  UpdateProfilePayload,
  UpdateLocationPayload,
  NearbyProvider,
  ProviderSchedule,
  ProviderScheduleResponse,
} from '@/types/api';

// ============================================================================
// User / Profile API
// Handles profile updates, location, availability, schedules, and nearby providers.
// ============================================================================

export const userApi = {
  /**
   * Updates the current user's profile information.
   * @param payload - Profile fields to update (fullName, phoneNumber)
   * @returns Promise resolving to success message and updated user data
   */
  async updateProfile(payload: UpdateProfilePayload) {
    return apiClient.patch<{ message: string; user: User }>(
      '/users/profile',
      payload,
      {},
      'Failed to update profile.'
    );
  },

  /**
   * Updates the current user's location.
   * @param payload - Location coordinates (latitude, longitude)
   * @returns Promise resolving to success message
   */
  async updateLocation(payload: UpdateLocationPayload) {
    return apiClient.patch<{ message: string }>(
      '/users/location',
      payload,
      {},
      'Failed to update location.'
    );
  },

  /**
   * Toggles the provider's online/offline availability.
   * @param isOnline - Whether the provider is online
   * @returns Promise resolving to updated availability status
   */
  async toggleAvailability(isOnline: boolean) {
    return apiClient.patch<{ message: string; isOnline: boolean }>(
      '/users/availability',
      { isOnline },
      {},
      'Failed to update availability.'
    );
  },

  /**
   * Sets the provider's weekly schedule.
   * @param schedule - Weekly schedule object
   * @returns Promise resolving to updated schedule
   */
  async setSchedule(schedule: ProviderSchedule) {
    return apiClient.post<{ message: string; schedule: ProviderSchedule }>(
      '/users/schedule',
      { schedule },
      {},
      'Failed to update schedule.'
    );
  },

  /**
   * Retrieves a provider's schedule.
   * @param providerId - Provider's user ID
   * @returns Promise resolving to provider schedule and online status
   */
  async getProviderSchedule(providerId: string) {
    return apiClient.get<ProviderScheduleResponse>(
      `/users/provider/${providerId}/schedule`,
      {},
      'Failed to load provider schedule.'
    );
  },

  /**
   * Retrieves a provider's full profile.
   * @param providerId - Provider's user ID
   * @returns Promise resolving to provider profile
   */
  async getProviderProfile(providerId: string) {
    return apiClient.get<User>(
      `/users/provider/${providerId}`,
      {},
      'Failed to load provider profile.'
    );
  },

  /**
   * Retrieves nearby laundry service providers.
   * @param latitude - User's current latitude
   * @param longitude - User's current longitude
   * @param radius - Optional search radius in kilometers (default: 5)
   * @returns Promise resolving to array of nearby providers
   */
  async getNearbyProviders(latitude: number, longitude: number, radius?: number) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ...(radius && { radius: radius.toString() }),
    });

    return apiClient.get<NearbyProvider[]>(
      `/users/nearby-providers?${params}`,
      {},
      'Failed to load nearby providers.'
    );
  },
};
