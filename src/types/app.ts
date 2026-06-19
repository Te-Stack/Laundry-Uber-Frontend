import type { LaundryRequest as ApiLaundryRequest } from "@/types/api"

// ============================================================================
// Local App Types
// These types are used by the legacy CustomerDashboard and ProviderDashboard.
// They are intentionally separate from the API types in types/api.ts because
// the dashboards maintain a local denormalized shape that includes nested
// user objects for display purposes.
// ============================================================================

export interface UserType {
    id: string
    name: string
    email: string
    phone: string
    type: "customer" | "provider"
    location: { lat: number; lng: number; address: string }
    rating?: number
    isOnline?: boolean
}

export interface LaundryRequest {
    id: string
    customerId: string
    providerId?: string
    status: ApiLaundryRequest["status"]
    items: string[]
    specialInstructions: string
    pickupAddress: string
    deliveryAddress: string
    estimatedPrice: number
    createdAt: Date
    updatedAt: Date
    customer: UserType
    provider?: UserType
}

export interface Message {
    id: string
    requestId: string
    senderId: string
    content: string
    timestamp: Date
}
