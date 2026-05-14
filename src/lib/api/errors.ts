import { AxiosError } from 'axios';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status ?? 500;
    this.code = options?.code ?? 'API_ERROR';
  }
}

interface BackendErrorResponse {
  error?: string;
  message?: string;
  code?: string;
}

/**
 * Transforms various error types into user-friendly ApiError instances.
 * Handles network errors, timeouts, HTTP status codes, and backend error messages.
 * @param error - The error to transform
 * @param fallbackMessage - Default message if no specific error message is available
 * @returns ApiError instance with user-friendly message
 */
export const toApiError = (
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.'
): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendErrorResponse>;

    // Extract error message from response
    const responseError =
      axiosError.response?.data?.error || axiosError.response?.data?.message;

    if (responseError) {
      return new ApiError(responseError, {
        status: axiosError.response?.status,
        code: axiosError.response?.data?.code || 'API_ERROR',
      });
    }

    // Handle network errors
    if (axiosError.code === 'ERR_NETWORK') {
      return new ApiError('Network error. Please check your connection.', {
        status: 0,
        code: 'NETWORK_ERROR',
      });
    }

    // Handle timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError('Request timed out. Please try again.', {
        status: 408,
        code: 'TIMEOUT',
      });
    }

    // Handle HTTP status codes
    const status = axiosError.response?.status;
    if (status) {
      return new ApiError(getStatusMessage(status), {
        status,
        code: `HTTP_${status}`,
      });
    }
  }

  // Log unexpected errors for debugging
  console.error('[ApiError]', error);

  return new ApiError(fallbackMessage, {
    code: 'UNEXPECTED_ERROR',
  });
};

/**
 * Type guard to check if an error is an AxiosError.
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Returns a user-friendly message for common HTTP status codes.
 */
function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication required. Please log in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with the current state.',
    500: 'Server error. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };

  return messages[status] || 'An error occurred. Please try again.';
}

export const getErrorMessage = (error: unknown, fallbackMessage?: string) =>
  toApiError(error, fallbackMessage).message;
