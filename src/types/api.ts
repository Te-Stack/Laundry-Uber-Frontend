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
  token: string;
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

// ============================================================================
// Request Options
// ============================================================================

export interface RequestOptions {
  errorMessage?: string;
  signal?: AbortSignal;
}

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
  deliveryAddress: string;
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
  deliveryAddress: string;
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

// ============================================================================
// Error Types
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  code?: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string;
  requestId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  reference: string;
  paystackReference: string | null;
  channel: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  request?: LaundryRequest;
}

export interface InitializePaymentPayload {
  requestId: string;
  amount: number;
  email: string;
  callbackUrl: string;
}

export interface InitializePaymentResponse {
  status: string;
  data: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  status: string;
  data: {
    paymentStatus: string;
    reference: string;
    amount: number;
    channel: string;
    paidAt: string;
  };
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface SendMessagePayload {
  receiverId: string;
  content: string;
  requestId?: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 'order' | 'payment' | 'message' | 'promo' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCount {
  count: number;
}

// ============================================================================
// Service Types
// ============================================================================

export type ServiceCategory = 'washing' | 'dry_cleaning' | 'ironing' | 'folding' | 'special';
export type ServiceUnit = 'per_piece' | 'per_kg' | 'per_load';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  unit: ServiceUnit;
  estimatedDuration: number;
  category: ServiceCategory;
  isActive: boolean;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
  provider?: User;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  basePrice: number;
  unit: ServiceUnit;
  estimatedDuration?: number;
  category: ServiceCategory;
}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {
  isActive?: boolean;
}

// ============================================================================
// Availability / Schedule Types
// ============================================================================

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

// ============================================================================
// Socket.IO Event Types
// ============================================================================

export interface SocketRequestAcceptedPayload {
  request: LaundryRequest;
}

export interface SocketRequestStatusUpdatePayload {
  request: LaundryRequest;
}

export interface SocketNewMessagePayload {
  message: Message;
}

export interface SocketNewNotificationPayload {
  notification: Notification;
}

export interface SocketProviderLocationPayload {
  providerId: string;
  latitude: number;
  longitude: number;
}
