import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toApiError } from './errors';
import { authManager } from './auth';

/**
 * ApiClient provides a centralized HTTP client for making API requests.
 * Handles authentication token injection, error transformation, and 401 redirects.
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRedirecting: boolean = false;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Sets up request and response interceptors for authentication and error handling.
   */
  private setupInterceptors(): void {
    // Request interceptor: inject JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = authManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && !this.isRedirecting) {
          this.isRedirecting = true;
          authManager.clearToken();
          window.location.href = '/login';
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
