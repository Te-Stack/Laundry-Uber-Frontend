/**
 * Barrel re-export for the laundry API.
 *
 * The API has been split into focused service files:
 *   services/userApi.ts      - Profile, location, availability, schedule, nearby providers
 *   services/requestsApi.ts  - Laundry request lifecycle (customer + provider)
 *
 * All existing imports from '@/services/laundryApi' continue to work unchanged.
 * New code should import directly from the focused service file.
 */

export { userApi } from './userApi';
export { requestsApi } from './requestsApi';

// Compose a combined laundryApi object for backward compatibility
// with any code that does: laundryApi.createRequest(...) etc.
import { userApi } from './userApi';
import { requestsApi } from './requestsApi';

export const laundryApi = {
  ...userApi,
  ...requestsApi,
};
