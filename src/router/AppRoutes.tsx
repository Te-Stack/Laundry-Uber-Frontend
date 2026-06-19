import { Routes, Route, Navigate } from "react-router-dom"
import { SocketProvider } from "@/contexts/SocketContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// Pages
import { AuthGate } from "@/pages/AuthPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { PaymentCallback } from "@/pages/PaymentCallback"
import { PaymentHistory } from "@/pages/PaymentHistory"
import { Messages } from "@/pages/Messages"
import { Notifications } from "@/pages/Notifications"
import { Services } from "@/pages/Services"
import { MyServices } from "@/pages/MyServices"
import { Schedule } from "@/pages/Schedule"
import { MapPage } from "@/pages/MapPage"
import { ProviderProfilePage } from "@/pages/ProviderProfilePage"
import { Profile } from "@/pages/Profile"

interface AppRoutesProps {
    isAuthenticated: boolean
}

// ============================================================================
// AppRoutes
// Declares all application routes.
//
// SocketProvider is lifted to wrap the entire protected zone once — previously
// each route mounted its own SocketProvider, causing a new socket connection
// on every navigation. Now a single persistent connection is shared across
// all protected pages.
// ============================================================================

export function AppRoutes({ isAuthenticated }: AppRoutesProps) {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthGate />}
            />

            {/* Payment callback - accessible without full nav, no socket needed */}
            <Route path="/payment/callback" element={<PaymentCallback />} />

            {/* Protected routes — wrapped in a single SocketProvider so the
                WebSocket connection persists across page navigations */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Routes>
                                <Route path="/dashboard"         element={<DashboardPage />} />
                                <Route path="/services"          element={<Services />} />
                                <Route path="/my-services"       element={<MyServices />} />
                                <Route path="/schedule"          element={<Schedule />} />
                                <Route path="/map"               element={<MapPage />} />
                                <Route path="/messages"          element={<Messages />} />
                                <Route path="/messages/:userId"  element={<Messages />} />
                                <Route path="/notifications"     element={<Notifications />} />
                                <Route path="/payments"          element={<PaymentHistory />} />
                                <Route path="/profile"           element={<Profile />} />
                                <Route path="/providers/:providerId" element={<ProviderProfilePage />} />
                            </Routes>
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
