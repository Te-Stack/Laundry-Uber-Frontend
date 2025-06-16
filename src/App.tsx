
import type React from "react"
import { useState, createContext, useContext } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"
import { Badge } from "./components/ui/badge"
import { Avatar, AvatarFallback } from "./components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { MapPin, Clock, Shirt, MessageCircle, CheckCircle, Star, Phone, Truck, Droplets, Package } from "lucide-react"

// Types
interface UserType {
  id: string
  name: string
  email: string
  phone: string
  type: "customer" | "provider"
  avatar?: string
  location: {
    lat: number
    lng: number
    address: string
  }
  rating?: number
  isOnline?: boolean
}

interface LaundryRequest {
  id: string
  customerId: string
  providerId?: string
  status: "pending" | "accepted" | "picked_up" | "washing" | "ready" | "delivered" | "completed"
  items: string[]
  specialInstructions: string
  pickupAddress: string
  deliveryAddress: string
  estimatedPrice: number
  createdAt: Date
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

// Context
interface AppContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  requests: LaundryRequest[]
  setRequests: (requests: LaundryRequest[]) => void
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

// Components
function LandingPage({ onUserTypeSelect }: { onUserTypeSelect: (type: "customer" | "provider") => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LaundryConnect</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with local laundry services or offer your laundry expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onUserTypeSelect("customer")}
          >
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

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onUserTypeSelect("provider")}
          >
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

function AuthForm({ userType, onLogin }: { userType: "customer" | "provider"; onLogin: (user: UserType) => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || "John Doe",
      email: formData.email || "john@example.com",
      phone: formData.phone || "+1234567890",
      type: userType,
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: formData.address || "123 Main St, New York, NY",
      },
      rating: userType === "provider" ? 5.0 : undefined,
      isOnline: userType === "provider",
    }
    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isLogin ? "Sign In" : "Sign Up"} as {userType === "customer" ? "Customer" : "Provider"}
          </CardTitle>
          <CardDescription>{isLogin ? "Welcome back!" : "Create your account to get started"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomerDashboard() {
  const { user, requests, setRequests } = useApp()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    items: "",
    specialInstructions: "",
    pickupAddress: user?.location.address || "",
    deliveryAddress: user?.location.address || "",
  })

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const newRequest: LaundryRequest = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: user!.id,
      status: "pending",
      items: requestForm.items.split(",").map((item) => item.trim()),
      specialInstructions: requestForm.specialInstructions,
      pickupAddress: requestForm.pickupAddress,
      deliveryAddress: requestForm.deliveryAddress,
      estimatedPrice: Math.floor(Math.random() * 50) + 20,
      createdAt: new Date(),
      customer: user!,
    }
    setRequests([...requests, newRequest])
    setShowRequestForm(false)
    setRequestForm({
      items: "",
      specialInstructions: "",
      pickupAddress: user?.location.address || "",
      deliveryAddress: user?.location.address || "",
    })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      washing: "bg-indigo-100 text-indigo-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
      completed: "bg-emerald-100 text-emerald-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const userRequests = requests.filter((req) => req.customerId === user?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button onClick={() => setShowRequestForm(true)} className="mb-4">
            <Shirt className="w-4 h-4 mr-2" />
            Request Laundry Service
          </Button>

          {showRequestForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>New Laundry Request</CardTitle>
                <CardDescription>Fill out the details for your laundry service</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="items">Items (comma separated)</Label>
                    <Input
                      id="items"
                      value={requestForm.items}
                      onChange={(e) => setRequestForm({ ...requestForm, items: e.target.value })}
                      placeholder="e.g., shirts, pants, bedsheets"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={requestForm.specialInstructions}
                      onChange={(e) => setRequestForm({ ...requestForm, specialInstructions: e.target.value })}
                      placeholder="Any special care instructions..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup">Pickup Address</Label>
                      <Input
                        id="pickup"
                        value={requestForm.pickupAddress}
                        onChange={(e) => setRequestForm({ ...requestForm, pickupAddress: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery Address</Label>
                      <Input
                        id="delivery"
                        value={requestForm.deliveryAddress}
                        onChange={(e) => setRequestForm({ ...requestForm, deliveryAddress: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">Submit Request</Button>
                    <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Requests</h2>

          {userRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No laundry requests yet. Create your first request!</p>
              </CardContent>
            </Card>
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
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Items:</p>
                        <p className="text-sm">{request.items.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estimated Price:</p>
                        <p className="text-sm">${request.estimatedPrice}</p>
                      </div>
                    </div>

                    {request.provider && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar>
                          <AvatarFallback>{request.provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.provider.name}</p>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{request.provider.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
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

function ProviderDashboard() {
  const { user, requests, setRequests } = useApp()
  const [activeTab, setActiveTab] = useState("available")

  const availableRequests = requests.filter((req) => req.status === "pending")
  const myRequests = requests.filter((req) => req.providerId === user?.id)

  const handleAcceptRequest = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "accepted", providerId: user!.id, provider: user! } : req,
      ),
    )
  }

  const handleUpdateStatus = (requestId: string, newStatus: LaundryRequest["status"]) => {
    setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)))
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      picked_up: "bg-purple-100 text-purple-800",
      washing: "bg-indigo-100 text-indigo-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
      completed: "bg-emerald-100 text-emerald-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              <Avatar>
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Requests ({availableRequests.length})</TabsTrigger>
            <TabsTrigger value="active">My Active Jobs ({myRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="space-y-4">
              {availableRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No available requests at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                availableRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">{request.createdAt.toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{request.status.toUpperCase()}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Customer:</p>
                          <p className="text-sm">{request.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Items:</p>
                          <p className="text-sm">{request.items.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Estimated Price:</p>
                          <p className="text-sm font-semibold text-green-600">${request.estimatedPrice}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Pickup Address:</p>
                        <p className="text-sm flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {request.pickupAddress}
                        </p>
                      </div>

                      {request.specialInstructions && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
                          <p className="text-sm bg-gray-50 p-2 rounded">{request.specialInstructions}</p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button onClick={() => handleAcceptRequest(request.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Customer
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
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active jobs. Accept some requests to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Request #{request.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-500">Customer: {request.customer.name}</p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Items:</p>
                          <p className="text-sm">{request.items.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Price:</p>
                          <p className="text-sm font-semibold text-green-600">${request.estimatedPrice}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Update Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.status === "accepted" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(request.id, "picked_up")}>
                              <Truck className="w-4 h-4 mr-1" />
                              Mark as Picked Up
                            </Button>
                          )}
                          {request.status === "picked_up" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(request.id, "washing")}>
                              <Droplets className="w-4 h-4 mr-1" />
                              Start Washing
                            </Button>
                          )}
                          {request.status === "washing" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(request.id, "ready")}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark as Ready
                            </Button>
                          )}
                          {request.status === "ready" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(request.id, "delivered")}>
                              <Truck className="w-4 h-4 mr-1" />
                              Mark as Delivered
                            </Button>
                          )}
                          {request.status === "delivered" && (
                            <Button size="sm" onClick={() => handleUpdateStatus(request.id, "completed")}>
                              <Star className="w-4 h-4 mr-1" />
                              Complete Job
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar>
                          <AvatarFallback>{request.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{request.customer.name}</p>
                          <p className="text-sm text-gray-500">{request.customer.phone}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
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

function App() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard">("landing")
  const [selectedUserType, setSelectedUserType] = useState<"customer" | "provider" | null>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [requests, setRequests] = useState<LaundryRequest[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const handleUserTypeSelect = (type: "customer" | "provider") => {
    setSelectedUserType(type)
    setCurrentView("auth")
  }

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser)
    setCurrentView("dashboard")
  }

  const contextValue: AppContextType = {
    user,
    setUser,
    requests,
    setRequests,
    messages,
    setMessages,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen">
        {currentView === "landing" && <LandingPage onUserTypeSelect={handleUserTypeSelect} />}

        {currentView === "auth" && selectedUserType && <AuthForm userType={selectedUserType} onLogin={handleLogin} />}

        {currentView === "dashboard" &&
          user &&
          (user.type === "customer" ? <CustomerDashboard /> : <ProviderDashboard />)}
      </div>
    </AppContext.Provider>
  )
}

export default App
