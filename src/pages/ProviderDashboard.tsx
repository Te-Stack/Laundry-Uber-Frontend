import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import { MapPin, Clock, MessageCircle, CheckCircle, Truck, Package } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useApp } from "@/contexts/AppContext"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { laundryApi } from "@/services/laundryApi"
import type { LaundryRequest } from "@/types/app"

// ============================================================================
// ProviderDashboard
// Shows available pending requests and the provider's active jobs.
// ============================================================================

export function ProviderDashboard() {
    const { user, requests, setRequests } = useApp()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("available")
    const { isLoading, error, run, clearError } = useAsyncAction()

    const availableRequests = requests.filter((req) => req.status === "pending")
    const myRequests = requests.filter((req) => req.providerId === user?.id)

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const result = await run(() => laundryApi.acceptRequest(requestId))
            if (result) {
                setRequests(
                    requests.map((req) =>
                        req.id === requestId
                            ? { ...req, status: result.status as LaundryRequest["status"], providerId: result.providerId || undefined, updatedAt: new Date(result.updatedAt) }
                            : req
                    )
                )
            }
        } catch {
            return
        }
    }

    const handleUpdateStatus = async (requestId: string, newStatus: LaundryRequest["status"]) => {
        try {
            const result = await run(() => laundryApi.updateRequestStatus(requestId, newStatus))
            if (result) {
                setRequests(
                    requests.map((req) =>
                        req.id === requestId
                            ? { ...req, status: result.status as LaundryRequest["status"], updatedAt: new Date(result.updatedAt) }
                            : req
                    )
                )
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            <header className="bg-white dark:bg-card shadow-sm border-b dark:border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">Provider Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Online
                            </Badge>
                            <Avatar><AvatarFallback>{user?.name.charAt(0)}</AvatarFallback></Avatar>
                            <span className="text-sm font-medium">{user?.name}</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && <div className="mb-6"><ErrorBanner message={error} /></div>}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="available">Available Requests ({availableRequests.length})</TabsTrigger>
                        <TabsTrigger value="active">My Active Jobs ({myRequests.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="available">
                        <div className="space-y-4">
                            {availableRequests.length === 0 ? (
                                <Card><CardContent className="text-center py-8"><Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No available requests at the moment.</p></CardContent></Card>
                            ) : (
                                availableRequests.map((request) => (
                                    <Card key={request.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Created {request.createdAt.toLocaleDateString()}</p>
                                                </div>
                                                <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer:</p><p className="text-sm">{request.customer.name}</p></div>
                                                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                                                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price:</p><p className="text-sm font-semibold text-green-600 dark:text-green-400">₦{request.estimatedPrice}</p></div>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pickup Address:</p>
                                                <p className="text-sm flex items-center"><MapPin className="w-4 h-4 mr-1" />{request.pickupAddress}</p>
                                            </div>
                                            {request.specialInstructions && (
                                                <div className="mb-4"><p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Instructions:</p><p className="text-sm bg-gray-50 dark:bg-muted p-2 rounded">{request.specialInstructions}</p></div>
                                            )}
                                            <div className="flex space-x-2">
                                                <Button onClick={() => { clearError(); void handleAcceptRequest(request.id) }} disabled={isLoading}>
                                                    <CheckCircle className="w-4 h-4 mr-2" />{isLoading ? "Working..." : "Accept Request"}
                                                </Button>
                                                <Button variant="outline" onClick={() => navigate(`/messages/${request.customerId}`)}>
                                                    <MessageCircle className="w-4 h-4 mr-2" />Message Customer
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="active">
                        <div className="space-y-4">
                            {myRequests.length === 0 ? (
                                <Card><CardContent className="text-center py-8"><Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No active jobs. Accept some requests to get started!</p></CardContent></Card>
                            ) : (
                                myRequests.map((request) => (
                                    <Card key={request.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer: {request.customer.name}</p>
                                                </div>
                                                <Badge className={getStatusColor(request.status)}>{request.status.replace("_", " ").toUpperCase()}</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                                                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price:</p><p className="text-sm font-semibold text-green-600 dark:text-green-400">₦{request.estimatedPrice}</p></div>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Status:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {request.status === "accepted" && (
                                                        <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "picked_up") }} disabled={isLoading}>
                                                            <Truck className="w-4 h-4 mr-1" />Mark as Picked Up
                                                        </Button>
                                                    )}
                                                    {request.status === "picked_up" && (
                                                        <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "washing") }} disabled={isLoading}>Mark as Washing</Button>
                                                    )}
                                                    {request.status === "washing" && (
                                                        <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "ready") }} disabled={isLoading}>Mark as Ready</Button>
                                                    )}
                                                    {request.status === "ready" && (
                                                        <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "out_for_delivery") }} disabled={isLoading}>Out for Delivery</Button>
                                                    )}
                                                    {request.status === "out_for_delivery" && (
                                                        <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "delivered") }} disabled={isLoading}>Mark as Delivered</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
