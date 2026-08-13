import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import {
    Location01Icon,
    TimeQuarterIcon,
    Message01Icon,
    TickDouble02Icon,
    TruckDeliveryIcon,
    PackageIcon,
    RefreshIcon,
    CheckmarkCircle01Icon,
} from "hugeicons-react"
import { Navigation } from "@/components/Navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    useProviderRequests,
    usePendingRequests,
    useAcceptRequest,
    useUpdateRequestStatus,
} from "@/hooks/useRequests"
import { useProviderLocationSharing } from "@/hooks/useProviderLocationSharing"
import { getStatusColor } from "@/utils/statusColors"
import type { LaundryRequest, RequestStatus } from "@/types/api"

export function ProviderDashboard() {
    const { data: session } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("available")
    const [actionError, setActionError] = useState<string | null>(null)

    // React Queries for persistent data
    const {
        data: assignedResult,
        isLoading: assignedLoading,
        refetch: refetchAssigned,
    } = useProviderRequests()

    const {
        data: pendingResult,
        isLoading: pendingLoading,
        refetch: refetchPending,
    } = usePendingRequests()

    // Mutations
    const acceptMutation = useAcceptRequest()
    const updateStatusMutation = useUpdateRequestStatus()

    const myRequests: LaundryRequest[] = assignedResult?.data ?? []
    const availableRequests: LaundryRequest[] = pendingResult?.data ?? []

    useProviderLocationSharing(myRequests)

    const handleAcceptRequest = async (requestId: string) => {
        setActionError(null)
        try {
            const res = await acceptMutation.mutateAsync(requestId)
            if (res.error) {
                setActionError(res.error.message || "Failed to accept request.")
                return
            }
            setActiveTab("active")
        } catch (err: any) {
            setActionError(err?.message || "Failed to accept request.")
        }
    }

    const handleUpdateStatus = async (requestId: string, newStatus: RequestStatus) => {
        setActionError(null)
        try {
            const res = await updateStatusMutation.mutateAsync({ requestId, status: newStatus })
            if (res.error) {
                setActionError(res.error.message || `Failed to update status to ${newStatus}.`)
            }
        } catch (err: any) {
            setActionError(err?.message || `Failed to update status to ${newStatus}.`)
        }
    }

    const isMutating = acceptMutation.isPending || updateStatusMutation.isPending

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-12">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Provider Header Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-card p-6 rounded-2xl border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-foreground">
                            {session?.user?.name || "Provider"} Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage incoming customer requests, update fulfillment stages, and track laundry deliveries.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 px-3 py-1"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Accepting Orders
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                refetchAssigned()
                                refetchPending()
                            }}
                            className="text-xs"
                        >
                            <RefreshIcon className="w-3.5 h-3.5 mr-1" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {actionError && <ErrorBanner message={actionError} />}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="available" className="relative">
                            Available Requests
                            {availableRequests.length > 0 && (
                                <Badge className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.2">
                                    {availableRequests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="active" className="relative">
                            My Active Jobs
                            {myRequests.length > 0 && (
                                <Badge className="ml-2 bg-indigo-600 text-white text-xs px-1.5 py-0.2">
                                    {myRequests.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Available Pending Requests */}
                    <TabsContent value="available">
                        <div className="space-y-4">
                            {pendingLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <Card key={i} className="animate-pulse h-36 bg-gray-100 dark:bg-muted" />
                                    ))}
                                </div>
                            ) : availableRequests.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="text-center py-12">
                                        <TimeQuarterIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">No open requests right now</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            New customer requests within your service area will appear here automatically.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                availableRequests.map((request) => (
                                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-5 sm:p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-base">
                                                            Request #{request.id.slice(0, 8).toUpperCase()}
                                                        </h3>
                                                        <Badge className={getStatusColor(request.status)}>
                                                            {request.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Received {new Date(request.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-500">Order Payout</span>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        ₦{Number(request.totalAmount).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm bg-gray-50 dark:bg-muted/40 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Customer</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {request.customer?.fullName || (request.customer as any)?.name || "Customer"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Items</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {request.items && request.items.length > 0
                                                            ? request.items.map((i) => `${i.quantity}x ${i.type}`).join(", ")
                                                            : "Laundry items"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Pickup Location</p>
                                                    <p className="text-sm font-medium mt-0.5 flex items-center line-clamp-1">
                                                        <Location01Icon className="w-3.5 h-3.5 mr-1 text-gray-400 shrink-0" />
                                                        {request.pickupAddress}
                                                    </p>
                                                </div>
                                            </div>

                                            {request.notes && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-950/20 p-2 rounded border border-blue-100 dark:border-blue-900">
                                                    <strong>Instructions:</strong> {request.notes}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                                                {request.customer && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/messages/${request.customerId}`)}
                                                        className="text-xs h-8"
                                                    >
                                                        <Message01Icon className="w-3.5 h-3.5 mr-1" />
                                                        Message
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                    disabled={isMutating}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                                                >
                                                    <TickDouble02Icon className="w-3.5 h-3.5 mr-1" />
                                                    {acceptMutation.isPending ? "Accepting..." : "Accept Job"}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Tab 2: My Active & Assigned Jobs */}
                    <TabsContent value="active">
                        <div className="space-y-4">
                            {assignedLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <Card key={i} className="animate-pulse h-36 bg-gray-100 dark:bg-muted" />
                                    ))}
                                </div>
                            ) : myRequests.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="text-center py-12">
                                        <PackageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">No active jobs yet</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                                            Switch to the "Available Requests" tab to accept upcoming orders.
                                        </p>
                                        <Button size="sm" onClick={() => setActiveTab("available")}>
                                            View Available Requests
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                myRequests.map((request) => (
                                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-5 sm:p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-base">
                                                            Job #{request.id.slice(0, 8).toUpperCase()}
                                                        </h3>
                                                        <Badge className={getStatusColor(request.status)}>
                                                            {request.status.replace(/_/g, " ").toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Customer: {request.customer?.fullName || (request.customer as any)?.name || "Valued Customer"} • Phone: {request.customer?.phoneNumber || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-500">Earnings</span>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        ₦{Number(request.totalAmount).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-50 dark:bg-muted/40 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Items</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {request.items && request.items.length > 0
                                                            ? request.items.map((i) => `${i.quantity}x ${i.type}`).join(", ")
                                                            : "Laundry items"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase">Delivery Address</p>
                                                    <p className="text-sm font-medium mt-0.5 line-clamp-1">{request.deliveryAddress}</p>
                                                </div>
                                            </div>

                                            {/* Progress Status Advancer Bar */}
                                            <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                        Next Action:
                                                    </span>
                                                    {request.status === "accepted" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(request.id, "picked_up")}
                                                            disabled={isMutating}
                                                            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                                                        >
                                                            <TruckDeliveryIcon className="w-3.5 h-3.5 mr-1" />
                                                            Mark as Picked Up
                                                        </Button>
                                                    )}
                                                    {request.status === "picked_up" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(request.id, "washing")}
                                                            disabled={isMutating}
                                                            className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                        >
                                                            Mark as Washing
                                                        </Button>
                                                    )}
                                                    {request.status === "washing" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(request.id, "ready")}
                                                            disabled={isMutating}
                                                            className="text-xs h-8 bg-teal-600 hover:bg-teal-700 text-white"
                                                        >
                                                            Mark as Ready
                                                        </Button>
                                                    )}
                                                    {request.status === "ready" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(request.id, "out_for_delivery")}
                                                            disabled={isMutating}
                                                            className="text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
                                                        >
                                                            Out for Delivery
                                                        </Button>
                                                    )}
                                                    {request.status === "out_for_delivery" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(request.id, "delivered")}
                                                            disabled={isMutating}
                                                            className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        >
                                                            <CheckmarkCircle01Icon className="w-3.5 h-3.5 mr-1" />
                                                            Mark as Delivered
                                                        </Button>
                                                    )}
                                                    {request.status === "delivered" && (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                            ✓ Order Completed
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate(`/messages/${request.customerId}`)}
                                                    className="text-xs h-8 ml-auto"
                                                >
                                                    <Message01Icon className="w-3.5 h-3.5 mr-1" />
                                                    Message Customer
                                                </Button>
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
