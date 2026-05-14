import { Navigate } from 'react-router-dom';
import { authManager } from '@/lib/api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps routes that require authentication.
 * Redirects to / if the user is not authenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authManager.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
