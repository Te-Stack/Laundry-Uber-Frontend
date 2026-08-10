import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft01Icon } from "hugeicons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { signIn, signUp } from "@/lib/auth-client"
import { LandingPage } from "@/pages/LandingPage"

// ============================================================================
// AuthForm
// Handles both sign-in and sign-up for a given user type.
// ============================================================================

interface AuthFormProps {
    userType: "customer" | "provider"
    onLogin: () => void
    onBack: () => void
}

function AuthForm({ userType, onLogin, onBack }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ fullName: "", email: "", phoneNumber: "", password: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearError = () => setError(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const result = await signIn.email({
                    email: formData.email,
                    password: formData.password,
                })
                if (result.error) {
                    setError(result.error.message || "Login failed. Please check your credentials.")
                    return
                }
            } else {
                const result = await signUp.email(
                    {
                        email: formData.email,
                        password: formData.password,
                        name: formData.fullName,
                    },
                    {
                        body: {
                            phoneNumber: formData.phoneNumber,
                            userType: userType,
                        },
                    }
                )
                if (result.error) {
                    setError(result.error.message || "Registration failed. Please try again.")
                    return
                }
            }
            // If we got here without error, auth succeeded — session cookie is set.
            // The useSession() hook in AuthProvider will automatically update.
            onLogin()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            type="button"
                            onClick={onBack}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft01Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <CardTitle className="flex-1">{isLogin ? "Sign In" : "Sign Up"} as {userType === "customer" ? "Customer" : "Provider"}</CardTitle>
                    </div>
                    <CardDescription>{isLogin ? "Welcome back!" : "Create your account to get started"}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <ErrorBanner message={error} />}
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" value={formData.fullName} onChange={(e) => { clearError(); setFormData({ ...formData, fullName: e.target.value }) }} placeholder="Enter your full name" required={!isLogin} />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={(e) => { clearError(); setFormData({ ...formData, email: e.target.value }) }} placeholder="Enter your email" required />
                        </div>
                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => { clearError(); setFormData({ ...formData, phoneNumber: e.target.value }) }} placeholder="Enter your phone number" required={!isLogin} />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={formData.password} onChange={(e) => { clearError(); setFormData({ ...formData, password: e.target.value }) }} placeholder="Enter your password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => { clearError(); setIsLogin(!isLogin) }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ============================================================================
// AuthGate
// Shown at "/" when the user is not authenticated. Renders LandingPage first,
// then AuthForm once a user type is selected.
// ============================================================================

export function AuthGate() {
    const [selectedUserType, setSelectedUserType] = useState<"customer" | "provider" | null>(null)
    const navigate = useNavigate()

    const handleLogin = () => {
        // Session cookie is set — navigate to dashboard.
        // The AuthProvider + useSession will automatically detect the session.
        navigate("/dashboard", { replace: true })
    }

    if (!selectedUserType) {
        return <LandingPage onUserTypeSelect={setSelectedUserType} />
    }

    return <AuthForm userType={selectedUserType} onLogin={handleLogin} onBack={() => setSelectedUserType(null)} />
}
