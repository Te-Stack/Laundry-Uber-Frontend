import React, { createContext, useContext } from 'react';
import { useSession } from '@/lib/auth-client';

interface AuthContextValue {
  data: {
    session: {
      id: string;
      userId: string;
      token: string;
      expiresAt: Date;
    };
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
      phoneNumber?: string;
      userType: 'customer' | 'provider';
      isOnline?: boolean;
      latitude?: number;
      longitude?: number;
      rating?: number;
      totalRatings?: number;
      schedule?: string;
    };
  } | null;
  isPending: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue>({
  data: null,
  isPending: true,
  error: null,
});

/**
 * Provides Better Auth session state to the entire app.
 * Wraps the useSession() hook from Better Auth's React client.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <AuthContext.Provider value={session as AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the current auth session from any component.
 * Returns { data: { session, user } | null, isPending, error }
 */
export function useAuth() {
  return useContext(AuthContext);
}
