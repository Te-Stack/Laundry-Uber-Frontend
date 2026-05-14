import type React from "react"
import { useState } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"
import { Badge } from "./components/ui/badge"
import { Avatar, AvatarFallback } from "./components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { MapPin, Clock, Shirt, MessageCircle, CheckCircle, Star, Truck, Droplets, Package } from "lucide-react"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ThemeToggle } from "./components/ThemeToggle"
import { useAsyncAction } from "@/hooks/useAsyncAction"
import { laundryApi } from "@/services/laundryApi"
import { authManager } from "@/lib/api/auth"
import { SocketProvider } from "@/contexts/SocketContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// Pages
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

import type { LaundryRequest as ApiLaundryRequest } from "@/types/api"

// Local app types (used only in App.tsx legacy dashboard)
interface UserType {
  id: string
  name: string
  email: string
  phone: string
  type: "customer" | "provider"
  location: { lat: number; lng: number; address: string }
  rating?: number
  isOnline?: boolean
}

interface LaundryRequest {
  id: string
  customerId: string
  providerId?: string
  status: ApiLaundryRequest["status"]
  items: string[]
  specialInstructions: string
  pickupAddress: string
  deliveryAddress: string
  estimatedPrice: number
  createdAt: Date
  updatedAt: Date
  customer: UserType
  provider?: UserType
}

interface Message {
  id: string
  requestId: string
  senderId: string
  content: string
  timestamp: Date
}

// ============================================================================
// App Context (kept for legacy dashboard components)
// ============================================================================

import { createContext, useContext } from "react"

interface AppContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  requests: LaundryRequest[]
  setRequests: (requests: LaundryRequest[]) => void
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  )
}

// ============================================================================
// Landing Page
// ============================================================================

function LandingPage({ onUserTypeSelect }: { onUserTypeSelect: (type: "customer" | "provider") => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LaundryBer</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with local laundry services or offer your laundry expertise
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onUserTypeSelect("customer")}>
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>I Need Laundry Service</CardTitle>
              <CardDescription>Get your laundry done by trusted local providers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Quick pickup and delivery</li>
                <li>• Professional cleaning</li>
                <li>• Affordable pricing</li>
                <li>• Real-time tracking</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onUserTypeSelect("provider")}>
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>I Provide Laundry Service</CardTitle>
              <CardDescription>Earn money by helping others with their laundry</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
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

// ============================================================================
// Auth Form
// ============================================================================

function AuthForm({ userType, onLogin }: { userType: "customer" | "provider"; onLogin: (user: UserType) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ fullName: "", email: "", phoneNumber: "", password: "" })
  const { isLoading, error, run, clearError } = useAsyncAction()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let result
      if (isLogin) {
        result = await run(() => laundryApi.login({ email: formData.email, password: formData.password }))
      } else {
        result = await run(() => laundryApi.register({ email: formData.email, password: formData.password, fullName: formData.fullName, phoneNumber: formData.phoneNumber, userType }))
      }
      if (result?.user) {
        const apiUser = result.user
        onLogin({
          id: apiUser.id, name: apiUser.fullName, email: apiUser.email, phone: apiUser.phoneNumber,
          type: apiUser.userType, location: { lat: apiUser.latitude || 0, lng: apiUser.longitude || 0, address: "" },
          rating: apiUser.rating, isOnline: apiUser.isOnline,
        })
      }
    } catch { return }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Sign In" : "Sign Up"} as {userType === "customer" ? "Customer" : "Provider"}</CardTitle>
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
            <button type="button" onClick={() => { clearError(); setIsLogin(!isLogin) }} className="text-sm text-blue-600 hover:underline">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// Customer Dashboard
// ============================================================================

function CustomerDashboard() {
  const { user, requests, setRequests } = useApp()
  const navigate = useNavigate()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({ items: "", specialInstructions: "", pickupAddress: user?.location.address || "", deliveryAddress: user?.location.address || "" })
  const { isLoading, error, run, clearError } = useAsyncAction()

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const itemsArray = requestForm.items.split(",").map((item) => item.trim()).filter(Boolean).map((item) => ({ type: item, quantity: 1, price: 500 }))
      const totalAmount = itemsArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const result = await run(() => laundryApi.createRequest({ pickupAddress: requestForm.pickupAddress, deliveryAddress: requestForm.deliveryAddress, pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), items: itemsArray, totalAmount, notes: requestForm.specialInstructions }))
      if (result) {
        const apiRequest = result
        setRequests([...requests, {
          id: apiRequest.id, customerId: apiRequest.customerId, providerId: apiRequest.providerId || undefined,
          status: apiRequest.status as LaundryRequest["status"], items: apiRequest.items.map(item => item.type),
          specialInstructions: apiRequest.notes || "", pickupAddress: apiRequest.pickupAddress,
          deliveryAddress: apiRequest.deliveryAddress, estimatedPrice: apiRequest.totalAmount,
          createdAt: new Date(apiRequest.createdAt), updatedAt: new Date(apiRequest.updatedAt),
          customer: user!,
          provider: apiRequest.provider ? { id: apiRequest.provider.id, name: apiRequest.provider.fullName, email: apiRequest.provider.email, phone: apiRequest.provider.phoneNumber, type: apiRequest.provider.userType, location: { lat: 0, lng: 0, address: "" }, rating: apiRequest.provider.rating, isOnline: apiRequest.provider.isOnline } : undefined,
        }])
        setShowRequestForm(false)
        setRequestForm({ items: "", specialInstructions: "", pickupAddress: user?.location.address || "", deliveryAddress: user?.location.address || "" })
      }
    } catch { return }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", accepted: "bg-blue-100 text-blue-800", picked_up: "bg-purple-100 text-purple-800", washing: "bg-indigo-100 text-indigo-800", ready: "bg-green-100 text-green-800", delivered: "bg-gray-100 text-gray-800", completed: "bg-emerald-100 text-emerald-800" }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const userRequests = requests.filter((req) => req.customerId === user?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
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
              <CardHeader><CardTitle>New Laundry Request</CardTitle><CardDescription>Fill out the details for your laundry service</CardDescription></CardHeader>
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
            <Card><CardContent className="text-center py-8"><Shirt className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">No laundry requests yet. Create your first request!</p></CardContent></Card>
          ) : (
            <div className="grid gap-4">
              {userRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                        <p className="text-sm text-gray-500">Created {request.createdAt.toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>{request.status.replace("_", " ").toUpperCase()}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-medium text-gray-700">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                      <div><p className="text-sm font-medium text-gray-700">Estimated Price:</p><p className="text-sm">₦{request.estimatedPrice}</p></div>
                    </div>
                    {request.provider && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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

// ============================================================================
// Provider Dashboard
// ============================================================================

function ProviderDashboard() {
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
        setRequests(requests.map(req => req.id === requestId ? { ...req, status: result.status as LaundryRequest["status"], providerId: result.providerId || undefined, updatedAt: new Date(result.updatedAt) } : req))
      }
    } catch { return }
  }

  const handleUpdateStatus = async (requestId: string, newStatus: LaundryRequest["status"]) => {
    try {
      const result = await run(() => laundryApi.updateRequestStatus(requestId, newStatus))
      if (result) {
        setRequests(requests.map(req => req.id === requestId ? { ...req, status: result.status as LaundryRequest["status"], updatedAt: new Date(result.updatedAt) } : req))
      }
    } catch { return }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", accepted: "bg-blue-100 text-blue-800", picked_up: "bg-purple-100 text-purple-800", washing: "bg-indigo-100 text-indigo-800", ready: "bg-green-100 text-green-800", delivered: "bg-gray-100 text-gray-800", completed: "bg-emerald-100 text-emerald-800" }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="outline" className="bg-green-50 text-green-700"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Online</Badge>
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
                <Card><CardContent className="text-center py-8"><Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">No available requests at the moment.</p></CardContent></Card>
              ) : (
                availableRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">Created {request.createdAt.toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div><p className="text-sm font-medium text-gray-700">Customer:</p><p className="text-sm">{request.customer.name}</p></div>
                        <div><p className="text-sm font-medium text-gray-700">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                        <div><p className="text-sm font-medium text-gray-700">Price:</p><p className="text-sm font-semibold text-green-600">₦{request.estimatedPrice}</p></div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Pickup Address:</p>
                        <p className="text-sm flex items-center"><MapPin className="w-4 h-4 mr-1" />{request.pickupAddress}</p>
                      </div>
                      {request.specialInstructions && (
                        <div className="mb-4"><p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p><p className="text-sm bg-gray-50 p-2 rounded">{request.specialInstructions}</p></div>
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
                <Card><CardContent className="text-center py-8"><Package className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500">No active jobs. Accept some requests to get started!</p></CardContent></Card>
              ) : (
                myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">Customer: {request.customer.name}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{request.status.replace("_", " ").toUpperCase()}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><p className="text-sm font-medium text-gray-700">Items:</p><p className="text-sm">{request.items.join(", ")}</p></div>
                        <div><p className="text-sm font-medium text-gray-700">Price:</p><p className="text-sm font-semibold text-green-600">₦{request.estimatedPrice}</p></div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Update Status:</p>
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
                            <Button size="sm" onClick={() => { clearError(); void handleUpdateStatus(request.id, "out_for_delivery" as LaundryRequest["status"]) }} disabled={isLoading}>Out for Delivery</Button>
                          )}
                          {(request.status as string) === "out_for_delivery" && (
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

// ============================================================================
// Auth Gate (landing + auth flow before routing)
// ============================================================================

function AuthGate({ onAuthenticated }: { onAuthenticated: (user: UserType) => void }) {
  const [selectedUserType, setSelectedUserType] = useState<"customer" | "provider" | null>(null)

  if (!selectedUserType) {
    return <LandingPage onUserTypeSelect={setSelectedUserType} />
  }

  return <AuthForm userType={selectedUserType} onLogin={onAuthenticated} />
}

// ============================================================================
// Dashboard Router (picks the right dashboard based on user type)
// ============================================================================

function DashboardPage() {
  const { user } = useApp()
  if (!user) return <Navigate to="/" replace />
  return user.type === "provider" ? <ProviderDashboard /> : <CustomerDashboard />
}

// ============================================================================
// Root App
// ============================================================================

export default function App() {
  const [user, setUser] = useState<UserType | null>(null)
  const [requests, setRequests] = useState<LaundryRequest[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const handleAuthenticated = (authenticatedUser: UserType) => {
    setUser(authenticatedUser)
  }

  // If not authenticated (no token and no in-memory user), show auth gate
  const isAuthenticated = authManager.isAuthenticated() || user !== null

  return (
    <ThemeProvider>
      <AppContext.Provider value={{ user, setUser, requests, setRequests, messages, setMessages }}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <AuthGate onAuthenticated={handleAuthenticated} />
            }
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
      </AppContext.Provider>
    </ThemeProvider>
  )
}
