import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { Shirt, MessageCircle, Star } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useApp } from "@/contexts/AppContext"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { laundryApi } from "@/services/laundryApi"
import type { LaundryRequest } from "@/types/app"

// ============================================================================
// CustomerDashboard
// Displays the customer's laundry requests and a form to create new ones.
// ============================================================================

export function CustomerDashboard() {
    const { user, requests, setRequests } = useApp()
    const navigate = useNavigate()
    const [showRequestForm, setShowRequestForm] = useState(false)
    const [requestForm, setRequestForm] = useState({
        items: "",
        specialInstructions: "",
        pickupAddress: user?.location.address || "",
        deliveryAddress: user?.location.address || "",
    })
    const { isLoading, error, run, clearError } = useAsyncAction()

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const itemsArray = requestForm.items
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => ({ type: item, quantity: 1, price: 500 }))
            const totalAmount = itemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
            const result = await run(() =>
                laundryApi.createRequest({
                    pickupAddress: requestForm.pickupAddress,
                    deliveryAddress: requestForm.deliveryAddress,
                    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    items: itemsArray,
                    totalAmount,
                    notes: requestForm.specialInstructions,
                })
            )
            if (result) {
                const apiRequest = result
                setRequests([
                    ...requests,
                    {
                        id: apiRequest.id,
                        customerId: apiRequest.customerId,
                        providerId: apiRequest.providerId || undefined,
                        status: apiRequest.status as LaundryRequest["status"],
                        items: apiRequest.items.map((item) => item.type),
                        specialInstructions: apiRequest.notes || "",
                        pickupAddress: apiRequest.pickupAddress,
                        deliveryAddress: apiRequest.deliveryAddress,
                        estimatedPrice: apiRequest.totalAmount,
                        createdAt: new Date(apiRequest.createdAt),
                        updatedAt: new Date(apiRequest.updatedAt),
                        customer: user!,
                        provider: apiRequest.provider
                            ? {
                                  id: apiRequest.provider.id,
                                  name: apiRequest.provider.fullName,
                                  email: apiRequest.provider.email,
                                  phone: apiRequest.provider.phoneNumber,
                                  type: apiRequest.provider.userType,
                                  location: { lat: 0, lng: 0, address: "" },
                                  rating: apiRequest.provider.rating,
                                  isOnline: apiRequest.provider.isOnline,
                              }
                            : undefined,
                    },
                ])
                setShowRequestForm(false)
                setRequestForm({
                    items: "",
                    specialInstructions: "",
                    pickupAddress: user?.location.address || "",
                    deliveryAddress: user?.location.address || "",
                })
            }
        } catch {
            return
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending:          "bg-yellow-100 text-yellow-800",
            accepted:         "bg-blue-100 text-blue-800",
            declined:         "bg-red-100 text-red-800",
            picked_up:        "bg-purple-100 text-purple-800",
            washing:          "bg-indigo-100 text-indigo-800",
            ready:            "bg-green-100 text-green-800",
            out_for_delivery: "bg-orange-100 text-orange-800",
            delivered:        "bg-gray-100 text-gray-800",
        }
        return colors[status] || "bg-gray-100 text-gray-800"
    }

    const userRequests = requests.filter((req) => req.customerId === user?.id)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            <header className="bg-white dark:bg-card shadow-sm border-b dark:border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Customer Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <Avatar><AvatarFallback>{user?.name.charAt(0)}</AvatarFallback></Avatar>
                            <span className="text-sm font-medium">{user?.name}</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Button onClick={() => setShowRequestForm(true)} className="mb-4">
                        <Shirt className="w-4 h-4 mr-2" />Request Laundry Service
                    </Button>
                    {showRequestForm && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>New Laundry Request</CardTitle>
                                <CardDescription>Fill out the details for your laundry service</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateRequest} className="space-y-4">
                                    {error && <ErrorBanner message={error} />}
                                    <div className="space-y-2">
                                        <Label htmlFor="items">Items (comma separated)</Label>
                                        <Input id="items" value={requestForm.items} onChange={(e) => { clearError(); setRequestForm({ ...requestForm, items: e.target.value }) }} placeholder="e.g., shirts, pants, bedsheets" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="instructions">Special Instructions</Label>
                                        <Textarea id="instructions" value={requestForm.specialInstructions} onChange={(e) => { clearError(); setRequestForm({ ...requestForm, specialInstructions: e.target.value }) }} placeholder="Any special care instructions..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pickup">Pickup Address</Label>
                                            <Input id="pickup" value={requestForm.pickupAddress} onChange={(e) => { clearError(); setRequestForm({ ...requestForm, pickupAddress: e.target.value }) }} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="delivery">Delivery Address</Label>
                                            <Input id="delivery" value={requestForm.deliveryAddress} onChange={(e) => { clearError(); setRequestForm({ ...requestForm, deliveryAddress: e.target.value }) }} required />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Request"}</Button>
                                        <Button type="button" variant="outline" onClick={() => { clearError(); setShowRequestForm(false) }}>Cancel</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Your Requests</h2>
                    {userRequests.length === 0 ? (
                        <Card><CardContent className="text-center py-8"><Shirt className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No laundry requests yet. Create your first request!</p></CardContent></Card>
                    ) : (
                        <div className="grid gap-4">
                            {userRequests.map((request) => (
                                <Card key={request.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Created {request.createdAt.toLocaleDateString()}</p>
                                            </div>
                                            <Badge className={getStatusColor(request.status)}>{request.status.replace("_", " ").toUpperCase()}</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                                            <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Price:</p><p className="text-sm">₦{request.estimatedPrice}</p></div>
                                        </div>
                                        {request.provider && (
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-muted rounded-lg">
                                                <Avatar><AvatarFallback>{request.provider.name.charAt(0)}</AvatarFallback></Avatar>
                                                <div>
                                                    <p className="font-medium">{request.provider.name}</p>
                                                    <div className="flex items-center space-x-2"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm">{request.provider.rating}</span></div>
                                                </div>
                                                <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate(`/messages/${request.provider!.id}`)}>
                                                    <MessageCircle className="w-4 h-4 mr-1" />Message
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
