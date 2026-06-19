import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useApp } from "@/contexts/AppContext"
import { CustomerDashboard } from "@/pages/CustomerDashboard"
import { ProviderDashboard } from "@/pages/ProviderDashboard"

// ============================================================================
// DashboardPage
// Reads the session user type and renders the appropriate dashboard.
// Redirects to "/" if there is no active session.
// ============================================================================

export function DashboardPage() {
    const { data: session } = useAuth()
    const { user } = useApp()

    if (!session) return <Navigate to="/" replace />

    // Use session user type if available, fall back to AppContext user
    const userType = (session.user as any)?.userType || user?.type
    return userType === "provider" ? <ProviderDashboard /> : <CustomerDashboard />
}
