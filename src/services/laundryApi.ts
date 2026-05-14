import { apiClient } from '@/lib/api/client';
import { authManager } from '@/lib/api/auth';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  LaundryRequest,
  CreateRequestPayload,
  UpdateProfilePayload,
  UpdateLocationPayload,
  NearbyProvider,
} from '@/types/api';

export const laundryApi = {
  // ============================================================================
  // Authentication
  // ============================================================================

  /**
   * Registers a new user account.
   * @param payload - Registration details including email, password, fullName, phoneNumber, and userType
   * @returns Promise resolving to AuthResponse with user data and JWT token
   */
  async register(payload: RegisterRequest) {
    const result = await apiClient.post<AuthResponse>(
      '/auth/register',
      payload,
      {},
      'Registration failed. Please try again.'
    );

    // Store token if registration successful
    if (result.data?.token) {
      authManager.setToken(result.data.token);
    }

    return result;
  },

  /**
   * Logs in an existing user.
   * @param payload - Login credentials (email and password)
   * @returns Promise resolving to AuthResponse with user data and JWT token
   */
  async login(payload: LoginRequest) {
    const result = await apiClient.post<AuthResponse>(
      '/auth/login',
      payload,
      {},
      'Login failed. Please check your credentials.'
    );

    // Store token if login successful
    if (result.data?.token) {
      authManager.setToken(result.data.token);
    }

    return result;
  },

  /**
   * Retrieves the current authenticated user's profile.
   * @returns Promise resolving to User data
   */
  async getCurrentUser() {
    return apiClient.get<User>('/auth/me', {}, 'Failed to load user profile.');
  },

  // ============================================================================
  // User Profile
  // ============================================================================

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
  async setSchedule(schedule: import('@/types/api').ProviderSchedule) {
    return apiClient.post<{ message: string; schedule: import('@/types/api').ProviderSchedule }>(
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
    return apiClient.get<import('@/types/api').ProviderScheduleResponse>(
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
    return apiClient.get<import('@/types/api').User>(
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

  // ============================================================================
  // Laundry Requests - Customer
  // ============================================================================

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

  // ============================================================================
  // Laundry Requests - Provider
  // ============================================================================

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
