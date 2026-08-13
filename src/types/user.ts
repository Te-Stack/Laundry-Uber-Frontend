// ============================================================================
// Authentication Types
// ============================================================================

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  userType: 'customer' | 'provider';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userType: 'customer' | 'provider';
  isOnline: boolean;
  latitude?: number;
  longitude?: number;
  rating: number;
  totalRatings: number;
  schedule?: ProviderSchedule;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phoneNumber?: string;
}

export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}

export interface NearbyProvider {
  id: string;
  fullName: string;
  rating: number;
  totalRatings: number;
  isOnline: boolean;
  distance: number;
  latitude?: number;
  longitude?: number;
}

export interface ProviderSchedule {
  monday?: DaySchedule | null;
  tuesday?: DaySchedule | null;
  wednesday?: DaySchedule | null;
  thursday?: DaySchedule | null;
  friday?: DaySchedule | null;
  saturday?: DaySchedule | null;
  sunday?: DaySchedule | null;
}

export interface DaySchedule {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface UpdateAvailabilityPayload {
  isOnline: boolean;
}

export interface UpdateSchedulePayload {
  schedule: ProviderSchedule;
}

export interface ProviderScheduleResponse {
  isOnline: boolean;
  schedule: ProviderSchedule;
}
