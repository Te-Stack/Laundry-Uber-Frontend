import { createAuthClient } from "better-auth/react";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

export const authClient = createAuthClient({
  baseURL: backendUrl,
});

// Export convenience aliases
export const { useSession, signIn, signUp, signOut } = authClient;
