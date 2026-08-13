import type { User } from './user';

// ============================================================================
// Laundry Request Types
// ============================================================================

export interface LaundryRequest {
  id: string;
  customerId: string;
  providerId: string | null;
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  pickupAddress: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  deliveryAddress: string;
  deliveryLatitude: number | null;
  deliveryLongitude: number | null;
  pickupTime: string; // ISO 8601 date string
  items: RequestItem[];
  totalAmount: number;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  provider?: User;
}

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'picked_up'
  | 'washing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface RequestItem {
  type: string;
  quantity: number;
  price: number;
}

export interface CreateRequestPayload {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  pickupTime: string; // ISO 8601 date string
  items: RequestItem[];
  totalAmount: number;
  notes?: string;
}

export interface UpdateRequestStatusPayload {
  status: RequestStatus;
}

export interface RateRequestPayload {
  rating: number;
  review?: string;
}
