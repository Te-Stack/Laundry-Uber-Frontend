import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toApiError } from './errors';

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : window.location.origin);

/**
 * ApiClient provides a centralized HTTP client for making API requests.
 * Uses cookie-based session auth (Better Auth) — no manual token injection needed.
 * The browser sends the session cookie automatically via withCredentials: true.
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRedirecting: boolean = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${backendUrl}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Send session cookies automatically
    });

    this.setupInterceptors();
  }

  /**
   * Sets up response interceptors for error handling.
   * No request interceptor needed — cookies are sent automatically.
   */
  private setupInterceptors(): void {
    // Response interceptor: handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && !this.isRedirecting) {
          this.isRedirecting = true;
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Makes an HTTP request with the specified configuration.
   * @param config - Axios request configuration
   * @param errorMessage - Optional custom error message for failures
   * @returns Promise resolving to { data, error, meta }
   */
  async request<T>(
    config: AxiosRequestConfig,
    errorMessage?: string
  ): Promise<{ data: T | null; error: ReturnType<typeof toApiError> | null; meta: Record<string, unknown> }> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return { data: response.data, error: null, meta: {} };
    } catch (error) {
      return {
        data: null,
        error: toApiError(error, errorMessage),
        meta: {},
      };
    }
  }

  /**
   * Makes a GET request.
   * @param url - Request URL
   * @param config - Optional axios configuration
   * @param errorMessage - Optional custom error message
   */
  async get<T>(url: string, config?: AxiosRequestConfig, errorMessage?: string) {
    return this.request<T>({ ...config, method: 'GET', url }, errorMessage);
  }

  /**
   * Makes a POST request.
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Optional axios configuration
   * @param errorMessage - Optional custom error message
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig, errorMessage?: string) {
    return this.request<T>({ ...config, method: 'POST', url, data }, errorMessage);
  }

  /**
   * Makes a PATCH request.
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Optional axios configuration
   * @param errorMessage - Optional custom error message
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig, errorMessage?: string) {
    return this.request<T>({ ...config, method: 'PATCH', url, data }, errorMessage);
  }

  /**
   * Makes a DELETE request.
   * @param url - Request URL
   * @param config - Optional axios configuration
   * @param errorMessage - Optional custom error message
   */
  async delete<T>(url: string, config?: AxiosRequestConfig, errorMessage?: string) {
    return this.request<T>({ ...config, method: 'DELETE', url }, errorMessage);
  }
}

export const apiClient = new ApiClient();
