import { createContext, useContext, useState } from "react"
import type { UserType, LaundryRequest, Message } from "@/types/app"

// ============================================================================
// AppContext
// Provides legacy state (user, requests, messages) to CustomerDashboard and
// ProviderDashboard. Populated from the Better Auth session in AppInner.
// ============================================================================

export interface AppContextType {
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

export function useAppContextState() {
    const [user, setUser] = useState<UserType | null>(null)
    const [requests, setRequests] = useState<LaundryRequest[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    return { user, setUser, requests, setRequests, messages, setMessages }
}

export { AppContext }
