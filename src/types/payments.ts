import type { LaundryRequest } from './requests';

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
