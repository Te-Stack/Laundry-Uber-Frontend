import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ErrorBanner } from "@/components/ui/ErrorBanner"
import {
    TShirtIcon,
    Message01Icon,
    StarIcon,
    Location01Icon,
    Navigation01Icon,
    Store01Icon,
    ArrowRight01Icon,
    SparklesIcon,
    RefreshIcon,
    CheckmarkCircle01Icon,
} from "hugeicons-react"
import { Navigation } from "@/components/Navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useCustomerRequests, useCreateRequest, useRateRequest } from "@/hooks/useRequests"
import { useNearbyProviders } from "@/hooks/useProviders"
import { useGeolocation } from "@/hooks/useGeolocation"
import { ProviderTracker } from "@/components/maps/ProviderTracker"
import { AddressLocationPicker, type SelectedLocation } from "@/components/maps/AddressLocationPicker"
import { getStatusColor } from "@/utils/statusColors"
import type { LaundryRequest } from "@/types/api"

// Default reference coordinates: Ikeja, Lagos
const DEFAULT_LAT = 6.6005
const DEFAULT_LNG = 3.3505

export function CustomerDashboard() {
    const { data: session } = useAuth()
    const navigate = useNavigate()

    const user = session?.user
    const userLat = (user as any)?.latitude || DEFAULT_LAT
    const userLng = (user as any)?.longitude || DEFAULT_LNG

    // Geolocation with fallback to profile coordinates
    const { coords } = useGeolocation()
    const searchLat = coords?.latitude || userLat
    const searchLng = coords?.longitude || userLng

    // Queries
    const { data: requestsResult, isLoading: requestsLoading, refetch: refetchRequests } = useCustomerRequests()
    const { data: providersResult, isLoading: providersLoading } = useNearbyProviders({
        latitude: searchLat,
        longitude: searchLng,
        radius: 15,
    })

    // Mutations
    const createRequestMutation = useCreateRequest()
    const rateRequestMutation = useRateRequest()

    // Form state
    const [showRequestForm, setShowRequestForm] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<{ id: string; name: string } | null>(null)
    const [requestForm, setRequestForm] = useState({
        items: "",
        specialInstructions: "",
        pickupAddress: "12 Allen Avenue, Ikeja, Lagos",
        deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
    })
    const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(null)
    const [deliveryLocation, setDeliveryLocation] = useState<SelectedLocation | null>(null)
    const [formError, setFormError] = useState<string | null>(null)

    // Rating modal state
    const [ratingModal, setRatingModal] = useState<{ requestId: string; rating: number; review: string } | null>(null)

    const requests: LaundryRequest[] = requestsResult?.data ?? []
    const nearbyProviders = providersResult?.data ?? []

    useEffect(() => {
        if (!coords) return

        const currentLocation = {
            address: "Current device location",
            latitude: coords.latitude,
            longitude: coords.longitude,
        }
        setPickupLocation((location) => location ?? currentLocation)
        setDeliveryLocation((location) => location ?? currentLocation)
    }, [coords])

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError(null)

        try {
            if (!pickupLocation || !deliveryLocation) {
                setFormError("Choose both the pickup and delivery pins before submitting your request.")
                return
            }

            const itemsArray = requestForm.items
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => ({ type: item, quantity: 1, price: 1500 }))

            if (itemsArray.length === 0) {
                setFormError("Please enter at least one laundry item.")
                return
            }

            const totalAmount = itemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const result = await createRequestMutation.mutateAsync({
                pickupAddress: pickupLocation.address,
                pickupLatitude: pickupLocation.latitude,
                pickupLongitude: pickupLocation.longitude,
                deliveryAddress: deliveryLocation.address,
                deliveryLatitude: deliveryLocation.latitude,
                deliveryLongitude: deliveryLocation.longitude,
                pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                items: itemsArray,
                totalAmount,
                notes: selectedProvider
                    ? `[Preferred Provider: ${selectedProvider.name}] ${requestForm.specialInstructions}`.trim()
                    : requestForm.specialInstructions,
            })

            if (result.error) {
                setFormError(result.error.message || "Failed to create laundry request.")
                return
            }

            setShowRequestForm(false)
            setSelectedProvider(null)
            setPickupLocation(null)
            setDeliveryLocation(null)
            setRequestForm({
                items: "",
                specialInstructions: "",
                pickupAddress: "12 Allen Avenue, Ikeja, Lagos",
                deliveryAddress: "12 Allen Avenue, Ikeja, Lagos",
            })
        } catch (err: any) {
            setFormError(err?.message || "Failed to create laundry request.")
        }
    }

    const handleRateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!ratingModal) return

        try {
            await rateRequestMutation.mutateAsync({
                requestId: ratingModal.requestId,
                rating: ratingModal.rating,
                review: ratingModal.review,
            })
            setRatingModal(null)
        } catch (err: any) {
            setFormError(err?.message || "Failed to submit rating.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-12">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero / Quick Action Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-yellow-300" />
                            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">Fast & Fresh On-Demand</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {user?.name || "Customer"}!
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base max-w-xl">
                            Discover nearby dry cleaners, schedule instant door-to-door pickups, and track your laundry in real-time.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => {
                                setSelectedProvider(null)
                                setShowRequestForm(true)
                            }}
                            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md px-5 py-2.5 h-auto text-sm"
                        >
                            <TShirtIcon className="w-4 h-4 mr-2" />
                            Request Laundry
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/map")}
                            className="border-white/40 text-white hover:bg-white/10 px-4 py-2.5 h-auto text-sm"
                        >
                            <Navigation01Icon className="w-4 h-4 mr-2" />
                            Explore on Map
                        </Button>
                    </div>
                </div>

                {/* Request Form Modal / Drawer */}
                {showRequestForm && (
                    <Card className="border-blue-200 dark:border-blue-900 shadow-xl ring-1 ring-blue-500/20">
                        <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 border-b pb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl">
                                        {selectedProvider ? `Book with ${selectedProvider.name}` : "Create New Laundry Request"}
                                    </CardTitle>
                                    <CardDescription>
                                        Specify items and addresses for pickup and delivery
                                    </CardDescription>
                                </div>
                                {selectedProvider && (
                                    <Badge className="bg-blue-600 text-white">
                                        Direct Provider Request
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateRequest} className="space-y-4">
                                {formError && <ErrorBanner message={formError} />}

                                <div className="space-y-2">
                                    <Label htmlFor="items" className="font-semibold">
                                        Laundry Items (comma separated)
                                    </Label>
                                    <Input
                                        id="items"
                                        value={requestForm.items}
                                        onChange={(e) => setRequestForm({ ...requestForm, items: e.target.value })}
                                        placeholder="e.g., 3 Shirts, 2 Trousers, 1 Duvet"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Estimated base rate: ₦1,500 per item / batch. Total will be finalized upon inspection.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instructions">Special Instructions</Label>
                                    <Textarea
                                        id="instructions"
                                        value={requestForm.specialInstructions}
                                        onChange={(e) => setRequestForm({ ...requestForm, specialInstructions: e.target.value })}
                                        placeholder="e.g., Please use starch on shirts, gentle wash for delicate fabrics..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <AddressLocationPicker
                                        label="Pickup location"
                                        initialLocation={pickupLocation ?? undefined}
                                        onChange={setPickupLocation}
                                    />
                                    <AddressLocationPicker
                                        label="Delivery location"
                                        initialLocation={deliveryLocation ?? undefined}
                                        onChange={setDeliveryLocation}
                                    />
                                </div>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Search for an address, click the map, or drag each pin. The exact coordinates are saved separately for secure pickup and delivery tracking.
                                </p>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowRequestForm(false)
                                            setSelectedProvider(null)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createRequestMutation.isPending}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {createRequestMutation.isPending ? "Submitting..." : "Submit Laundry Request"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Rating Modal */}
                {ratingModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <Card className="max-w-md w-full shadow-2xl">
                            <CardHeader>
                                <CardTitle>Rate & Review Service</CardTitle>
                                <CardDescription>How was your experience with this laundry order?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRateSubmit} className="space-y-4">
                                    <div className="flex justify-center gap-2 py-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <StarIcon
                                                    className={`w-8 h-8 ${
                                                        star <= ratingModal.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="review">Comments (Optional)</Label>
                                        <Textarea
                                            id="review"
                                            value={ratingModal.review}
                                            onChange={(e) => setRatingModal({ ...ratingModal, review: e.target.value })}
                                            placeholder="Write your feedback..."
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setRatingModal(null)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={rateRequestMutation.isPending}>
                                            {rateRequestMutation.isPending ? "Submitting..." : "Submit Review"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Section 1: Uber/Bolt Style Nearby Providers Discovery */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Store01Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                                Nearby Laundry Providers
                            </h2>
                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                Live
                            </Badge>
                        </div>
                        <Link
                            to="/map"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                        >
                            View on Full Map <ArrowRight01Icon className="w-4 h-4" />
                        </Link>
                    </div>

                    {providersLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="animate-pulse h-44 bg-gray-100 dark:bg-muted" />
                            ))}
                        </div>
                    ) : nearbyProviders.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="text-center py-8">
                                <Location01Icon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400 font-medium">No active providers found in your immediate radius.</p>
                                <p className="text-sm text-gray-400 mt-1">Check out the Map page to adjust search distance.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {nearbyProviders.map((provider) => {
                                const pName = provider.fullName || (provider as any).name || "Provider"
                                const pRating = provider.rating != null ? Number(provider.rating).toFixed(1) : "5.0"
                                const pDistance = provider.distance != null ? Number(provider.distance).toFixed(1) : "0.5"

                                return (
                                    <Card
                                        key={provider.id}
                                        className="hover:shadow-md transition-shadow border-gray-200 dark:border-border flex flex-col justify-between"
                                    >
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-11 w-11 border border-blue-100 dark:border-blue-900">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold dark:bg-blue-900 dark:text-blue-300">
                                                            {pName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold text-sm leading-tight text-gray-900 dark:text-foreground line-clamp-1">
                                                            {pName}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <div className="flex items-center text-xs text-amber-500 font-medium">
                                                                <StarIcon className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                                                                {pRating}
                                                            </div>
                                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {pDistance} km
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span
                                                    title={provider.isOnline ? "Online" : "Offline"}
                                                    className={`h-2.5 w-2.5 rounded-full ring-4 ${
                                                        provider.isOnline
                                                            ? "bg-green-500 ring-green-100 dark:ring-green-950"
                                                            : "bg-gray-300 ring-gray-100 dark:ring-gray-800"
                                                    }`}
                                                />
                                            </div>

                                            <div className="pt-2 border-t flex items-center justify-between gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/messages/${provider.id}`)}
                                                    className="text-xs h-8 px-2.5 flex-1"
                                                >
                                                    <Message01Icon className="w-3.5 h-3.5 mr-1" />
                                                    Chat
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedProvider({ id: provider.id, name: pName })
                                                        setShowRequestForm(true)
                                                    }}
                                                    className="text-xs h-8 px-2.5 flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    Book
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Section 2: Customer Orders & History */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <TShirtIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                                Your Orders ({requests.length})
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => refetchRequests()}
                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-foreground"
                        >
                            <RefreshIcon className="w-3.5 h-3.5 mr-1" />
                            Refresh
                        </Button>
                    </div>

                    {requestsLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <Card key={i} className="animate-pulse h-32 bg-gray-100 dark:bg-muted" />
                            ))}
                        </div>
                    ) : requests.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="text-center py-12">
                                <TShirtIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">No laundry orders yet</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-4">
                                    Click "Request Laundry" above or select any of the nearby providers to place your first order.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSelectedProvider(null)
                                        setShowRequestForm(true)
                                    }}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Start Laundry Request
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((request) => {
                                const requestDate = new Date(request.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })
                                const isProviderTravelling = ["accepted", "picked_up", "out_for_delivery"].includes(request.status)
                                const destination = request.status === "out_for_delivery"
                                    ? [request.deliveryLatitude, request.deliveryLongitude]
                                    : [request.pickupLatitude, request.pickupLongitude]
                                const hasTrackingDestination = destination[0] != null && destination[1] != null

                                return (
                                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-5 sm:p-6 space-y-4">
                                            <div className="flex flex-wrap justify-between items-start gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-base text-gray-900 dark:text-foreground">
                                                            Order #{request.id.slice(0, 8).toUpperCase()}
                                                        </h3>
                                                        <Badge className={getStatusColor(request.status)}>
                                                            {request.status.replace(/_/g, " ").toUpperCase()}
                                                        </Badge>
                                                        {request.paymentStatus === "paid" && (
                                                            <Badge variant="outline" className="text-green-700 bg-green-50 dark:bg-green-950/40 border-green-200">
                                                                <CheckmarkCircle01Icon className="w-3 h-3 mr-1" />
                                                                Paid
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        Placed on {requestDate}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Price</p>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        ₦{Number(request.totalAmount).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-gray-50 dark:bg-muted/40 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Items
                                                    </p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {request.items && request.items.length > 0
                                                            ? request.items.map((i) => `${i.quantity}x ${i.type}`).join(", ")
                                                            : "Standard Laundry Bag"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Pickup & Delivery
                                                    </p>
                                                    <p className="text-sm font-medium mt-0.5 line-clamp-1">
                                                        {request.pickupAddress}
                                                    </p>
                                                </div>
                                            </div>

                                            {request.notes && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                    Note: {request.notes}
                                                </p>
                                            )}

                                            {isProviderTravelling && hasTrackingDestination && (
                                                <ProviderTracker
                                                    requestId={request.id}
                                                    destination={destination as [number, number]}
                                                    destinationLabel={request.status === "out_for_delivery" ? "Delivery location" : "Pickup location"}
                                                />
                                            )}

                                            {/* Provider Information / Action footer */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t">
                                                {request.provider ? (
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                                                                {(request.provider.fullName || (request.provider as any).name || "P").charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium leading-none">
                                                                {request.provider.fullName || (request.provider as any).name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">Assigned Provider</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                        ⏳ Waiting for nearby provider acceptance
                                                    </span>
                                                )}

                                                <div className="flex items-center gap-2 ml-auto">
                                                    {request.provider && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => navigate(`/messages/${request.provider!.id}`)}
                                                            className="text-xs h-8"
                                                        >
                                                            <Message01Icon className="w-3.5 h-3.5 mr-1" />
                                                            Message
                                                        </Button>
                                                    )}

                                                    {request.status === "delivered" && !request.rating && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                setRatingModal({
                                                                    requestId: request.id,
                                                                    rating: 5,
                                                                    review: "",
                                                                })
                                                            }
                                                            className="text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white"
                                                        >
                                                            <StarIcon className="w-3.5 h-3.5 mr-1" />
                                                            Rate Service
                                                        </Button>
                                                    )}

                                                    {request.rating && (
                                                        <div className="flex items-center text-xs font-semibold text-amber-500">
                                                            <StarIcon className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                                                            Rated {request.rating} ⭐
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
