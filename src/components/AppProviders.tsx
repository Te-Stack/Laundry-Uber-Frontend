import { ThemeProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"

// ============================================================================
// AppProviders
// Wraps the application with all global context providers in the correct order.
// Add new providers here rather than in App.tsx to keep the root file clean.
// ============================================================================

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    )
}
