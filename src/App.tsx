import { useAuth } from "@/contexts/AuthContext"
import { AppContext, useAppContextState } from "@/contexts/AppContext"
import { AppProviders } from "@/components/AppProviders"
import { AppRoutes } from "@/router/AppRoutes"
import type { UserType } from "@/types/app"

// ============================================================================
// AppInner
// Reads the auth session, builds the legacy AppContext value from it, and
// renders the route tree. Sits inside AppProviders (ThemeProvider + AuthProvider).
// ============================================================================

function AppInner() {
    const { data: session, isPending } = useAuth()

    // Derive user from session for legacy AppContext
    const sessionUser: UserType | null = session?.user
        ? {
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              phone: (session.user as any).phoneNumber || "",
              type: (session.user as any).userType || "customer",
              location: {
                  lat: (session.user as any).latitude || 0,
                  lng: (session.user as any).longitude || 0,
                  address: "",
              },
              rating: (session.user as any).rating,
              isOnline: (session.user as any).isOnline,
          }
        : null

    const contextState = useAppContextState()

    // Sync session user into AppContext whenever session changes
    const effectiveUser = sessionUser || contextState.user

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
                <div className="text-gray-400 dark:text-gray-500 animate-pulse text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <AppContext.Provider value={{ ...contextState, user: effectiveUser }}>
            <AppRoutes isAuthenticated={!!session} />
        </AppContext.Provider>
    )
}

// ============================================================================
// App — root composition
// ============================================================================

export default function App() {
    return (
        <AppProviders>
            <AppInner />
        </AppProviders>
    )
}
