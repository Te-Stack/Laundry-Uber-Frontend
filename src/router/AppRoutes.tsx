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
// Declares all application routes. Protected routes are wrapped in
// ProtectedRoute and SocketProvider for real-time features.
// ============================================================================

export function AppRoutes({ isAuthenticated }: AppRoutesProps) {
    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthGate />}
            />

            {/* Payment callback - accessible without full nav */}
            <Route path="/payment/callback" element={<PaymentCallback />} />

            {/* Protected routes - wrapped in SocketProvider for real-time features */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <DashboardPage />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/services"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Services />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-services"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <MyServices />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/schedule"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Schedule />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/map"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <MapPage />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Messages />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages/:userId"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Messages />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Notifications />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <PaymentHistory />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <Profile />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/providers/:providerId"
                element={
                    <ProtectedRoute>
                        <SocketProvider>
                            <ProviderProfilePage />
                        </SocketProvider>
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
