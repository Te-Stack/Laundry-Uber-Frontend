const TOKEN_KEY = 'laundryber_auth_token';

/**
 * AuthManager handles JWT token lifecycle including storage, retrieval, and clearing.
 * Uses localStorage for persistence across page refreshes.
 */
class AuthManager {
  /**
   * Retrieves the JWT token from localStorage.
   * @returns The JWT token string or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Stores the JWT token in localStorage.
   * @param token - The JWT token to store
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Removes the JWT token from localStorage.
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Checks if a user is authenticated by verifying token existence.
   * @returns True if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const authManager = new AuthManager();
