import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TShirtIcon, DropletIcon } from "hugeicons-react"

// ============================================================================
// LandingPage
// Shown when the user is not authenticated. Lets them choose their role
// (customer or provider) before proceeding to the auth form.
// ============================================================================

interface LandingPageProps {
    onUserTypeSelect: (type: "customer" | "provider") => void
}

export function LandingPage({ onUserTypeSelect }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">LaundryBer</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Connect with local laundry services or offer your laundry expertise
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onUserTypeSelect("customer")}>
                        <CardHeader>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TShirtIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>I Need Laundry Service</CardTitle>
                            <CardDescription>Get your laundry done by trusted local providers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <li>• Quick pickup and delivery</li>
                                <li>• Professional cleaning</li>
                                <li>• Affordable pricing</li>
                                <li>• Real-time tracking</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onUserTypeSelect("provider")}>
                        <CardHeader>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DropletIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle>I Provide Laundry Service</CardTitle>
                            <CardDescription>Earn money by helping others with their laundry</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <li>• Flexible schedule</li>
                                <li>• Set your own rates</li>
                                <li>• Build your reputation</li>
                                <li>• Local customers</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
